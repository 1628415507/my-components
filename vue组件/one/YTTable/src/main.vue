<template>
  <div class="table-container" ref="tableContainer">
    <el-table
      v-if="isShowTable"
      :data="data"
      :height="props.height || defaultHeight"
      header-row-class-name="table-header"
      @selection-change="selectChange"
      @select="select"
      @select-all="selectAll"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @cell-dblclick="cellDblclick"
      @row-click="rowClick"
      @row-contextmenu="rowContextmenu"
      @row-dblclick="rowDblclick"
      @header-click="headerClick"
      @header-contextmenu="headerContextmenu"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @current-change="currentChange"
      @header-dragend="headerDragend"
      @expand-change="expandChange"
      ref="elTable"
      v-bind="props"
    >
      <template slot="empty"> </template>
      <el-table-column
        v-if="showSelect"
        :selectable="selectable"
        type="selection"
        fixed="left"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="序号"
        v-if="showIndex"
        type="index"
        v-bind="indexProps"
        width="100"
      >
      </el-table-column>
      <TableColumn
        show-overflow-tooltip
        v-for="(col, index) in checkedColumns"
        :key="index"
        v-bind="updateColumns(col)"
      >
        <template slot="header" slot-scope="scope">
          <slot :name="`${updateColumns(col).prop}Header`" :scope="scope">
            {{ scope.column.label }}
          </slot>
        </template>
        <template slot-scope="scope">
          <slot :name="scope.column.property" :scope="scope">
            {{ scope.row[scope.column.property] }}
          </slot>
        </template>
      </TableColumn>

      <!-- <el-table-column
        show-overflow-tooltip
        v-for="(col, index) in checkedColumns"
        :key="index"
        v-bind="updateColumns(col)">
        <template slot="header" slot-scope="scope">
          <slot :name="`${updateColumns(col).prop}Header`" :scope="scope">
            {{scope.column.label}}
          </slot>
        </template>
        <template slot-scope="scope">
          <slot :name="updateColumns(col).prop" :scope="scope">
            {{scope.row[updateColumns(col).prop]}}
          </slot>
        </template>
      </el-table-column> -->

      <el-table-column
        :min-width="optionCloumWidth"
        v-if="$scopedSlots.default"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <slot :scope="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="filter" ><slot>筛选列</slot></div> -->
    <slot name="filter">
      <TableColFilter
        :columns="columns"
        @change="columnsChange"
        v-show="showFiltter"
      ></TableColFilter>
    </slot>
  </div>
</template>
<script>
import EleResize from '@/utils/documentResize'
import TableColFilter from './TableColFilter.vue'
import mixinColFilter from '@/mixins/mixinColFilter.js'
import table from '@/mixins/table'
import TableColumn from './TableColumn'
import { map } from 'lodash'

var _ = require('lodash')

export default {
  mixins: [mixinColFilter, table],
  name: 'YTTable',
  componentName: 'YTTable',
  components: {
    TableColFilter,
    TableColumn
  },
  props: {
    showSelect: {
      require: false,
      type: Boolean,
      default: true
    },
    showIndex: {
      require: false,
      type: Boolean,
      default: false
    },
    indexProps: {
      require: false,
      type: Object,
      default: () => {
        return {
          align: 'left'
        }
      }
    },
    height: {
      require: false,
      default: false
    },
    optionConfig: {
      require: false,
      type: Object,
      default: () => {
        return {
          border: false
        }
      }
    },
    data: {
      require: false,
      type: Array,
      default: () => []
    },
    columns: {
      require: true,
      type: Array,
      default: () => [
        {
          props: 'batchNo',
          label: '字段1',
          minWidth: '150px'
        },
        {
          props: 'statusName',
          label: '字段2',
          minWidth: '150px'
        }
      ]
    },
    optionCloumWidth: {
      require: false,
      default: 'auto'
    },
    /**
     * @function 默认表格勾选列是否可以勾选的方法
     */
    selectable: {
      require: false,
      default: () => {
        return () => {
          return true
        }
      }
    },
    props: {
      require: false,
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否显示表头筛选器
    showFiltter: {
      require: false,
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      observer: null,
      resizeNum: 0
    }
  },
  watch: {
    defaultHeight() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$forceUpdate()
          this.$refs['elTable'] && this.$refs['elTable'].doLayout()
        })
      }, 1000)
    },
    resizeNum_2() {
      this.resizeNum++
    }
  },
  computed: {
    resizeNum_2() {
      return (
        this.$parent.$refs.ListFilter && this.$parent.$refs.ListFilter.resizeNum
      )
    },
    defaultHeight() {
      let tableHeight = null
      if (
        this.resizeNum &&
        this.$refs.tableContainer &&
        this.$refs.tableContainer.parentNode.className === 'main-contain'
      ) {
        // console.log(this.$refs.tableContainer.parentNode.class);
        tableHeight =
          document.querySelector('.el-main').offsetHeight -
          (document.querySelector('.searchBar') &&
            (document.querySelector('.searchBar').offsetHeight || 0)) -
          240
        let elseDom = document.querySelectorAll('.more-com-wrap')
        elseDom.forEach(item => {
          tableHeight -= item.offsetHeight
        })
      }
      return tableHeight
    }
  },
  methods: {
    /**
     * @function 监听页面缩放，改变表格大小
     */
    onResize: _.debounce(function () {
      const element = document.querySelector('.search-bar')
      if (element) {
        EleResize.on(element, () => {
          this.resizeNum++
          this.height = element.clientHeight
          // console.log(element.clientHeight);
        })
      }
    }, 300),
    /**
     * @function 销毁监听页面缩放的事件
     */
    offResize: _.debounce(function () {
      const element = document.querySelector('.search-bar')
      if (element) {
        EleResize.off(element, () => {
          // console.log("卸载resize监听");
        })
      }
    }, 300),
    /**
     * @function 加工处理表格表头列信息
     * @param {Array} columns 表格列信息
     */
    updateColumns(columns) {
      let obj = { ...columns }
      obj.prop = obj.props
      obj.align = obj.align || 'left'
      obj.children = map(obj.children, e => this.updateColumns(e))
      return obj
    },
    /**
     * @function 获取表格中选择的索引（第几行）
     */
    getSelectedIndex(key) {
      let keyList = this.selectedArr.map(item => item[key])
      let selectedIndexArr = []
      this.data.map((item, index) => {
        if (keyList.includes(item[key])) {
          selectedIndexArr.push(index)
        }
      })
      return selectedIndexArr
    },

    // 触发表格重新计算高度
    triggerResize() {
      this.resizeNum++
    }
  },
  mounted() {
    // debugger
    this.onResize()
    this.resizeNum++
    window.addEventListener('resize', this.triggerResize)
  },
  activated() {
    this.onResize()
    window.addEventListener('resize', this.triggerResize)

    // 更新一次，否则会出现样式错乱的问题
    if (this.$refs.elTable) {
      this.$refs.elTable.doLayout()
    }
  },
  beforeDestory() {
    window.removeEventListener('resize', this.triggerResize)
  },
  destroyed() {
    this.offResize()
  },
  deactivated() {
    window.removeEventListener('resize', this.triggerResize)
    this.offResize()
  }
}
</script>
<style lang="scss" scoped>
.table-container {
  position: relative;
  // .filter {
  //   position: absolute;
  //   top: -22px;
  //   z-index: 1;
  //   right: 10px;
  //   color: #9E9E9E;
  //   cursor: pointer;
  //   font: {
  //     size: 12px;
  //   }
  // }
}
</style>
<style lang="scss">
.table-container {
  .table-header th {
    background: #fafafa;
    .cell {
      color: #000;
    }
  }
  .empty-wrap {
    position: absolute;
  }
}
// ↓ 下面这个样式会导致弹窗内的表格的fix定位的列在高度超出一页的情况下会有定位错误跟滚动条消失的问题，
// 参考编号 29902 的bug
// 但是作者不知道原先是为什么要加这行，因此先注释掉

// .el-dialog__body {
//   .el-table__fixed-body-wrapper,
//   .el-table__body-wrapper {
//     height: unset !important;
//   }
// }
</style>
