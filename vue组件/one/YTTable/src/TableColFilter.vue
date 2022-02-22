<!--
 * @Author: Hong Yiqun
 * @LastEditors  : ryan
-->
<template>
  <div class="table-col-filter">
    <el-popover v-model="isVisible">
      <div class="filter" slot="reference">
        <slot>
          <svg
            t="1610176656576"
            class="table-filter-icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2557"
            width="16"
            height="16"
          >
            <path
              d="M891.52 369.472h-20.352a355.008 355.008 0 0 0-20.032-48.128l14.528-14.464a95.36 95.36 0 0 0 28.096-67.904 95.616 95.616 0 0 0-28.096-67.84l-22.72-22.656c-36.352-36.224-99.456-36.288-135.808 0l-14.464 14.464a346.496 346.496 0 0 0-48.192-20.032v-20.416c0-52.928-43.072-96-95.936-96h-32c-52.928 0-96 43.072-96 96v20.416c-16.512 5.44-32.576 12.16-48.192 20.032l-14.464-14.528c-36.352-36.224-99.584-36.16-135.744 0l-22.656 22.656a96.128 96.128 0 0 0 0 135.808l14.528 14.528a356.288 356.288 0 0 0-20.032 48.064h-20.48c-52.928 0-96 43.136-96 96v32c0 52.928 43.072 96 96 96h20.416c5.44 16.512 12.16 32.576 20.032 48.192l-14.528 14.528a96.192 96.192 0 0 0 0 135.744l22.656 22.656c36.288 36.288 99.584 36.224 135.744 0l14.528-14.528c15.616 7.872 31.68 14.592 48.192 20.032v20.416c0 52.928 43.072 96 96 96h32c52.864 0 95.936-43.072 95.936-96v-20.416a358.4 358.4 0 0 0 48.128-20.032l14.592 14.592c36.16 36.16 99.328 36.224 135.744 0l22.656-22.656a96.256 96.256 0 0 0 0-135.808l-14.528-14.528c7.872-15.616 14.656-31.68 20.032-48.192h20.416c52.864 0 95.936-43.072 95.936-96v-32a96.128 96.128 0 0 0-95.936-96z m32 128.064a32 32 0 0 1-31.936 32h-44.352a31.936 31.936 0 0 0-30.976 24.064c-6.848 27.008-17.664 53.12-32.192 77.376a32 32 0 0 0 4.864 38.976l31.424 31.424a32.192 32.192 0 0 1 0 45.312l-22.656 22.656a32.96 32.96 0 0 1-45.248 0l-31.488-31.488a32 32 0 0 0-38.976-4.864 291.84 291.84 0 0 1-77.376 32.192 32.064 32.064 0 0 0-24.128 30.976v44.352a32 32 0 0 1-31.936 32h-32a32 32 0 0 1-32-32v-44.352a31.936 31.936 0 0 0-24.064-30.976 287.744 287.744 0 0 1-77.312-32.256 32.256 32.256 0 0 0-39.04 4.864l-31.488 31.488a32.832 32.832 0 0 1-45.248 0l-22.656-22.656a32 32 0 0 1 0-45.248l31.488-31.488a32 32 0 0 0 4.864-38.976A288.256 288.256 0 0 1 248.96 553.6a32.128 32.128 0 0 0-31.04-24.128h-44.352a32 32 0 0 1-32-32v-32c0-17.6 14.4-32 32-32h44.352a31.936 31.936 0 0 0 30.976-24.128 293.76 293.76 0 0 1 32.192-77.312 31.872 31.872 0 0 0-4.864-38.912l-31.488-31.488a32 32 0 0 1 0-45.312l22.656-22.656a32.832 32.832 0 0 1 45.248 0l31.488 31.488a32 32 0 0 0 39.04 4.864 290.56 290.56 0 0 1 77.312-32.192 31.936 31.936 0 0 0 24.064-30.976v-44.352a32 32 0 0 1 32-32h32a32 32 0 0 1 31.936 32v44.352c0 14.656 9.92 27.392 24.128 30.976 26.88 6.848 52.928 17.664 77.312 32.192a32.064 32.064 0 0 0 38.976-4.864l31.424-31.424a32.704 32.704 0 0 1 45.312 0l22.656 22.656a31.872 31.872 0 0 1 0 45.248l-31.488 31.488a32 32 0 0 0-4.864 39.04c14.528 24.256 25.344 50.24 32.256 77.312a32 32 0 0 0 30.976 24.064h44.288c17.6 0 32 14.4 32 32v32z"
              p-id="2558"
              fill="#595959"
            ></path>
            <path
              d="M532.544 274.56a207.232 207.232 0 0 0-206.976 206.976 207.232 207.232 0 0 0 206.976 206.976 207.232 207.232 0 0 0 207.04-206.976A207.296 207.296 0 0 0 532.544 274.56z m0 349.952c-78.848 0-142.976-64.128-142.976-142.976S453.696 338.56 532.544 338.56s143.04 64.128 143.04 142.976-64.192 142.976-143.04 142.976z"
              p-id="2559"
              fill="#595959"
            ></path>
          </svg>
        </slot>
      </div>

      <div class="col-filter-panel">
        <p class="title-text">
          <span slot="title">筛选表头</span>
          [{{ checkedList.length }}/{{ columns.length }}]
        </p>

        <el-checkbox
          class="check-all"
          :value="isAllChecked"
          @change="toggleAllCheck"
          >全选</el-checkbox
        >

        <el-tree
          :data="cloneColumns"
          :draggable="true"
          :check-strictly="true"
          :default-expand-all="true"
          node-key="props"
          :allow-drop="isAllowDrop"
          :allow-drag="isAllowDrag"
          :default-checked-keys="currentNodeKey"
          :renderContent="renderContent"
          :expand-on-click-node="false"
        >
        </el-tree>

        <!-- <draggable
          class="dragContainer"
          ref="dragContainer"
          v-model="cloneColumns"
          :animation="150"
        >
          <transition-group>
            <div
              draggable="true"
              class="item"
              v-for="item in cloneColumns"
              :key="item.props"
            >
              <el-checkbox v-model="item.checked">{{ item.label }}</el-checkbox>
            </div>
          </transition-group>
        </draggable> -->

        <div slot="footer" class="button-container">
          <el-button
            @click="confirm"
            :disabled="checkedList.length === 0"
            class="comfirmBtn"
            type="primary"
            >确定</el-button
          >
          <!-- <el-button @click="close" type="text" class="cancelBtn">{{
            $t("cancel")
          }}</el-button> -->
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { isArray, map, merge, find } from 'lodash'
// import draggable from "vuedraggable";
// import treeRender from "./TreeRender";

/*
change事件抛出已经筛选排序好的数组
默认插槽可以自定义按钮
*/

/*
使用范例

引入组件以及 mixin selectTableHead
import TableColFilter from '@/components/TableColFilter.vue'
import mixinColFilter from '@/mixins/mixinColFilter.js'

```
  mixins:[mixinColFilter],
  components:{
    TableColFilter
  },
```

监听change事件接受筛选后的数组
<TableColFilter :columns="columns" @change="columnsChange"></TableColFilter>

然后循环输出 checkedColumns 数组
<el-table-column
  v-for="(col, index) in checkedColumns"
  :key="index"
  align="center"
  :prop="col.props"
  :label="col.label">
</el-table-column>
 */

/**
 * @typedef {Object} Column
 * @prop {string} label - 标签
 * @prop {string} props - 字段
 * @prop {boolean} [checked] - 是否选中
 */

/**
 * 深度优先遍历
 */
/* function traverse(tree, callback) {
  let stack = [];

  if (isArray(tree)) {
    stack = stack.concat([...tree]);
  } else {
    stack.push(tree);
  }

  while (stack.length > 0) {
    const element = stack.pop();
    callback(element);

    if (element.children) {
      for (let i = element.children.length - 1; i > -1; i--) {
        stack.push(element.children[i]);
      }
    }
  }
} */

/**
 * 过滤树节点，返回过滤后的新树
 */
/* function filterTree(array, callback) {
  let result = [];

  each(array, (e) => {
    console.log(e.checked, e.label);
    if (callback && callback(e)) {
      let newNode = cloneDeep(e);
      newNode.children = filterTree(newNode.children, callback);
      console.log(newNode.children, "newNode.children");
      result.push(newNode);
    }
  });

  return result;
} */

export default {
  props: {
    /**
     * 全部的表头字段，数组中的元素 checked 只要不是全等于 false，就视为勾选
     * @type {Array<Column>}
     */
    columns: {
      required: true,
      type: Array,
      validator(value) {
        // 必须为字符串并且必须有 label 跟 props 字段
        return (
          isArray(value) &&
          !value.find(e => undefined === e.label || undefined === e.props)
        )
      },
      default: () => []
    }
  },
  components: {
    // draggable,
    // treeRender,
  },

  data() {
    return {
      isVisible: false,
      cloneColumns: [],

      // 用于强制更新列表
      // showList: true,

      /**
       * 是否已经全选
       */
      isAllChecked: true
    }
  },

  computed: {
    // 将cloneColumns树展开为一维数组的数组
    /*     flatCloneColumns() {
      let result = [];
      traverse(this.cloneColumns, (e) => {
        result.push(e);
      });
      return result;
    }, */

    /**
     * 选中的树，返回仅被选中的节点构成的树
     */
    checkedList() {
      /**
       * 只要不是严格等于false都视为选中，这样调用方就不用每次写个 checked: true
       */
      return (this.cloneColumns || []).filter(e => false !== e.checked)
    },

    /**
     * 选中的节点的key值
     */
    currentNodeKey() {
      return this.checkedList.map(e => e.props)
    }
  },

  watch: {
    columns() {
      this.updateCloneColumns()
      this.updateAllCheckedState()
      this.$emit('change', this.checkedList)
    },
    checkedList() {
      this.updateAllCheckedState()
    }
  },
  created() {
    // this.isAllChecked = this.checkedList.length === this.columns.length;
    this.updateCloneColumns()
    this.updateAllCheckedState()
  },

  methods: {
    /**
     * 打开菜单
     */
    open() {
      this.isVisible = true
    },

    /**
     * 确认
     */
    confirm() {
      this.$emit('change', this.checkedList)
      this.close()
    },

    /**
     * 关闭菜单
     */
    close() {
      this.isVisible = false
    },

    /**
     * 全选/取消全选
     */
    toggleAllCheck() {
      // console.log('toggleAllCheck');
      let newState = !this.isAllChecked

      this.cloneColumns.forEach(e => {
        if (!e.required) {
          e.checked = newState
        }
      })

      this.isAllChecked = newState
    },

    /**
     * 更新全选按钮的状态
     */
    updateAllCheckedState() {
      // console.log({
      //   "this.checkedList.length": this.checkedList.length,
      //   "this.columns.length": this.columns.length,
      // });
      this.isAllChecked = this.checkedList.length === this.columns.length
    },

    updateCloneColumns() {
      this.cloneColumns = map(this.columns, e => {
        let makeChecked = {}

        if (false !== e.checked) {
          makeChecked = {
            checked: true
          }
        }
        makeChecked.required = e.required || false
        return merge(makeChecked, e)
        // clone(this.columns)
      })
    },

    // 是否允许放置，目前先定为只有一级可放置
    isAllowDrop(draggingNode, dropNode, type) {
      return (
        type !== 'inner' &&
        1 == dropNode.level &&
        this.isAllowDrag(draggingNode)
      )
    },

    // 是否允许拖拽，目前先定为只有一级可拖拽
    isAllowDrag(draggingNode) {
      return find(this.cloneColumns, e => e.props === draggingNode.data.props)
    },

    // handleCheckChange(data, checked, indeterminate) {
    //   console.log(data, checked, indeterminate);
    //   data.checked = checked;
    // },
    renderContent(createElement, { node, data }) {
      let checkbox

      if (1 == node.level) {
        checkbox = createElement('el-checkbox', {
          props: {
            value: false !== data.checked,
            disabled: false !== data.required
          },
          on: {
            change(checked) {
              data.checked = checked
            }
          }
        })
      }

      return createElement('span', {}, [checkbox, node.label])
    }
  }
}
</script>

<style lang="scss" scoped>
.table-col-filter {
  .table-filter-icon {
    position: relative;
    top: -12px;
  }
  .filter {
    position: absolute;
    top: -22px;
    z-index: 1;
    right: 10px;
    color: #9e9e9e;
    cursor: pointer;
    font-size: 12px;
  }
}

// 面板部分
.col-filter-panel {
  // position: absolute;
  // bottom: 0;
  // right: 0;
  // .item{
  //   transition: transform .3s;
  // }
  .title-text {
    margin-bottom: 8px;
  }

  .check-all {
    margin-bottom: 16px;
  }
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
