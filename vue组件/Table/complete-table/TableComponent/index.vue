<template>
  <div class="table-component">
    <!-- v-loading="listLoading" -->
    <el-table
      id="iTable"
      ref="iTable"
      :show-header="options.showHeader===false?false:true"
      highlight-current-row
      :default-sort="options.defaultSort"
      :size="options.size||'medium'"
      :height="options.height"
      :max-height="options.maxHeight || '600px'"
      :data="data"
      :border="options.border"
      :stripe="options.stripe"
      :class="{'edit-table':options.isEditTable}"
      :cell-style="(typeof options.cellStyle === 'function') ? (params) => {options.cellStyle(params)} : options.cellStyle"
      :row-style="(typeof options.rowStyle === 'function') ? (params) => {options.rowStyle(params)} : options.rowStyle"
      :row-class-name="(typeof options.rowClassName === 'function') ? (params) => {options.rowClassName(params)} : options.rowClassName"
      :header-cell-style="headerCellStyle"
      @row-click="handleRowClick"
      @current-change="handleCurrentChange"
      @select="handleSelect"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 序号-->
      <el-table-column
        v-if="options.indexShow"
        type="index"
        label="序号"
        width="60px"
        align="center"
      >
        <template slot-scope="scope">
          <div class="index"> {{ scope.$index+1 }} </div>
        </template>
      </el-table-column>
      <!-- 选择框-->
      <el-table-column
        v-if="options.mutiSelect"
        type="selection"
        :selectable="options.selectable"
        style="width: 55px;"
      />
      <!-- 数据列-->
      <template v-for="(column, index) in columns">
        <el-table-column
          v-if="
            (typeof column.hidden === 'function'
              ? column.hidden(column, index)===true
              : column.hidden===true)?false:true
          "
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :align="column.align || 'center'"
          :min-width="column.minWidth"
          :width="column.width"
          :sortable="column.sortable"
          :sort-orders="column.sortOrders"
          :sort-method="column.sortMethod"
        >
          <!-- 表头-自定义表头 -->
          <template v-if="!column.notCustomHeader" slot="header">
            <div class="custom-header" :title="column.label">
              <!-- 加星号* -->
              <span>
                <span v-if="!readonly&&column.required" class="required-logo">*</span>
                {{ typeof column.label === 'function'?column.label():column.label }}
              </span>
              <!-- 加提示 -->
              <el-popover
                v-if="typeof column.tipShow == 'function'?column.tipShow(scope.row, scope.$index):(column.tipShow||false)"
                trigger="hover"
                placement="top"
                :width="column.tipWidth||190"
                :content="column.tipContent">
                <i slot="reference" class="el-icon-question" style="color:orange" />
              </el-popover>
            </div>
          </template>
          <!-- 表格列 -->
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="150"
              :disabled="typeof column.popoverDisabled == 'function'?column.popoverDisabled(scope.row, scope.$index):(column.popoverDisabled||true)"
              :trigger="typeof column.popoverTrigger == 'function'?column.popoverTrigger(scope.row, scope.$index):(column.popoverTrigger||'manual')"
              :content="typeof column.popoverContent == 'function'?column.popoverContent(scope.row, scope.$index):(column.popoverContent||'')">
              <div slot="reference" class="popover">
                <!-- 非自定义表格列 -->
                <template v-if="!column.render && !column.customSlot">
                  <!-- 序号 -->
                  <template v-if="column.type === 'index'">
                    <span class="edit-table-item"> {{ (pagination.pageIndex-1)*(pagination.pageSize) + (scope.$index +1) }}</span>
                  </template>
                  <!-- 文字链接 -->
                  <template v-if="column.type === 'link'">
                    <!-- 不可点击 -->
                    <span
                      v-if="typeof column.disabled === 'function'?column.disabled(scope.row, scope.$index):(column.disabled||false)"
                      class="link"
                    >
                      {{ column.formatter?column.formatter(scope.row, column,scope.$index):scope.row[column.prop] }}
                    </span>
                    <!-- 可点击 -->
                    <span
                      v-else
                      class="link linkable"
                      :title="column.formatter?column.formatter(scope.row, column,scope.$index):scope.row[column.prop]"
                      @click="column.method(scope.row, scope.$index)"
                    >
                      {{ column.formatter?column.formatter(scope.row, column,scope.$index):scope.row[column.prop] }}
                    </span>
                  </template>
                  <!-- 开关组件 -->
                  <template v-else-if="column.component === 'switch'">
                    <el-switch
                      v-model="scope.row[column.prop]"
                      @change="column.method(scope.row, scope.row[column.prop])"
                    />
                  </template>
                  <!-- 正常回显数据 class="txt" -->
                  <template v-else>
                    <span
                      class="edit-table-item"
                      :title="column.formatter?column.formatter(scope.row, column,scope.$index):scope.row[column.prop]"
                      v-html="column.formatter?column.formatter(scope.row, column,scope.$index):scope.row[column.prop]"
                    />
                    <!-- <div :title="column.formatter?column.formatter(scope.row, column,scope.$index):scope.row[column.prop]">
                  {{ column.formatter?column.formatter(scope.row, column,scope.$index):scope.row[column.prop] }}
                </div> -->
                  </template>
                </template>
                <!-- 自定义表格列：自定义具名插槽 传出去的值通过scope.row获取-->
                <template v-else-if="column.customSlot">
                  <template v-if="!readonly">
                    <slot
                      :name="`${column.prop}`"
                      :index="scope.$index"
                      :row="{ index: scope.$index, ...scope.row }"
                    >
                      自定义插槽{{ scope.$index + 1 }}
                    </slot>
                  </template>
                  <template v-else>
                    <span
                      class="edit-table-item"
                      :title="column.formatter?column.formatter(scope.row, column,scope.$index):scope.row[column.nameProp||column.prop]"
                      v-html="column.formatter?column.formatter(scope.row, column,scope.$index):scope.row[column.nameProp||column.prop]"
                    />
                    <!-- {{ column.formatter?column.formatter(scope.row, column,scope.$index):scope.row[column.nameProp||column.prop] }} -->
                  </template>
                </template>
                <!-- render函数 -->
                <template v-else>
                  <expand-dom
                    :column="column"
                    :row="scope.row"
                    :render="column.render"
                    :index="index"
                  />
                </template>
              </div>
            </el-popover>

          </template>
        </el-table-column>
      </template>
      <!--region 按钮操作组-->
      <el-table-column
        v-if="
          ((typeof operates.hidden === 'function'
            ? operates.hidden()===true
            : operates.hidden===true)?false:true
          )&& !readonly && operates.list.length"
        ref="fixedColumn"
        :label="operates.label||'操作'"
        align="center"
        :width="operates.width"
        :fixed="operates.fixed"
      >
        <template slot-scope="scope">
          <span v-for="(btn, key) in operates.list" :key="key" class="opt-item">
            <!-- 首先判断按钮是否隐藏 -->
            <template v-if="(typeof btn.show == 'function' ? btn.show(key, scope.row) : btn.show)===false? false:true">
              <!-- 自定义插槽 -->
              <template v-if="btn.type==='customSlot'">
                <slot
                  :name="`${btn.id}`"
                  :index="scope.$index"
                  :btn="btn"
                  :row="{ index: scope.$index, ...scope.row }"
                >
                  自定义插槽{{ btn.label }}
                </slot>
              </template>
              <template v-else>
                <!-- 1.字体图标 -->
                <span v-if="btn.type==='icon'" :title="btn.label" @click="btn.method(scope.row, scope.$index)">
                  <i :class="[btn.icon,'icon']" :style="{color:btn.color||'#009688'}" />
                </span>
                <!-- 2.图片 -->
                <!-- 3.按钮（默认） -->
                <!-- style="margin: 0 4px;font-size:14px;color:blue" -->
                <el-button
                  v-else
                  style="margin: 0 4px;font-size:14px;"
                  :type="btn.type"
                  :class="btn.class"
                  size="mini"
                  :disabled="typeof btn.disabled == 'function' ? btn.disabled(key, scope.row) : btn.disabled "
                  :plain="btn.plain"
                  @click.stop="btn.method(scope.row, scope.$index)"
                >
                  {{ btn.variable ? scope.row[btn.variableLabel] === 0 ? "启用" : "禁用" : btn.label }}
                </el-button>
              </template>
            </template>
          </span>
        </template>
      </el-table-column>
      <!--endregion-->
    </el-table>
    <!-- 分页 -->
    <div v-if="options.pagination" class="pagination-footer">
      <div v-if="options.showMutiSelected" class="pagination-select">已选中<span class="number">{{ pagination.selectedNumber || 0 }}</span>条</div>
      <div class="pagination-total">共计{{ pagination.total || 0 }}条</div>
      <el-pagination
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="pagination.pageSize"
        :current-page.sync="pagination.pageIndex"
        :total="pagination.total"
        layout="sizes, prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
        style=""
        @size-change="handleSizeChange"
        @current-change="handleIndexChange"
      />
    </div>
  </div>
</template>
<!--endregion-->
<script>
export default {
  name: 'TableComponent', // 用于注册全局组件的名称
  // 组件
  components: {
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        // 作用渲染视图，相当于template
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        };
        if (ctx.props.column) params.column = ctx.props.column;
        return ctx.props.render(h, params);
      }
    }
  },
  props: {
    // 数据列表
    listLoading: {
      type: Boolean,
      default: false
    },
    // 数据列表
    data: {
      type: Array,
      default: () => []
    },
    // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    columns: {
      type: Array,
      default: () => []
    },
    // 操作按钮组 === label: 文本，type :类型（primary / success / warning / danger / info / text），show：是否显示，icon：按钮图标，plain：是否朴素按钮，disabled：是否禁用，method：回调方法
    operates: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {
        return {
          stripe: true, // 是否为斑马纹 table
          border: true, // 是否边框
          highlightCurrentRow: false // 是否要高亮当前行
        };
      },
      pagination: true
    }, // table 表格的控制参数
    pagination: {
      type: Object,
      default: () => {}
    },
    // 表格是否只读，只读状态下只显示文本，不显示插槽
    readonly: {
      type: Boolean,
      default: false
    }
  },
  // 数据
  data() {
    const headerCellStyle = {
      color: '#242831',
      fontSize: '14px',
      fontWeight: 400,
      // height: '53px',
      background: '#EBEDF2'
    }
    return {
      headerCellStyle,
      loadingInstance: null,
      status: false,
      pageIndex: 1,
      multipleSelection: [] // 多行选中
    };
  },
  computed: {},
  watch: {
    listLoading: {
      immediate: true,
      handler(loadingStatus) {
        this.handleLoading(loadingStatus)
      }
    }
  },
  beforeDestroy() {
    this.loadingInstance = null
  },
  created() {},
  mounted() {},
  methods: {
    // 处理表格加载动画:实现局部loading效果(不包含表头)
    handleLoading(loadingStatus) {
      // const tableDom = document.querySelector('.el-table__body')
      const tableDomArr = document.querySelectorAll('.el-table__body')
      const tableDom = tableDomArr[tableDomArr.length - 1]
      // 开启加载动画
      if (tableDom && loadingStatus && !this.loadingInstance) {
        this.loadingInstance = this.$loading({
          // lock: true, // 同v-loading的修饰符
          // text: 'Loading',
          // spinner: 'el-icon-loading',
          background: 'transparent',
          target: tableDom, // loading需要覆盖的DOM节点，默认为body
          customClass: 'custom-loading'
        });
        // console.log('【 开启加载动画 】-328', loadingStatus, this.loadingInstance)
      } else {
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          this.loadingInstance && this.loadingInstance.close()
          this.loadingInstance = null
          // console.log('【 关闭加载动画 】-328', loadingStatus, this.loadingInstance)
        });
      }
    },
    handleCurrentChange(row, oldRow) {
      this.$emit('handleCurrentChange', row, oldRow);
    },
    handleSelect(selection, row) {
      this.multipleSelection = selection;
      this.$emit('handleSelect', row);
    },
    handleSortChange(obj) {
      this.$emit('handleSortChange', obj);
    },
    // 多行选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('handleSelectionChange', val);
    },
    handleRowClick(row) {
      this.$emit('handleRowClick', row);
    },
    handleSizeChange(size) {
      this.$emit('handleSizeChange', size);
    },
    /* 切换页码*/
    handleIndexChange(current) {
      this.$emit('handleIndexChange', current);
    }
  }
};
</script>
<style lang="scss" scoped>
// 编辑表格下的样式（控制居中对齐）
.edit-table{
  /deep/ .el-table__row td,
  /deep/ .el-table__row th {
    // background: red;
    padding: 15px 0 0 0  !important;
    .el-input__inner{
      border: none;
      background: transparent;
    }
  }
  .index{
    // background: red !important;
    margin-top: -5px;
    min-height: 30px !important;
  }
  .opt-item{
    margin: 0 auto;
    display:inline-block;
    min-height: 42px !important;
  }
  .edit-table-item {
    display:inline-block;
    // margin-top: -6px;
    // min-height: 36px !important;
    min-height: 28px !important;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // background: red !important;
  }
}
// 表头加*号
.custom-header{
  position: relative;
  .required-logo{
    color: #F56C6C;
  }
}
/deep/ .custom-loading{
  color:red;
  min-height:70px !important;
  // width:100% !important;
}
.table-component{
  .link{
    margin-top: 5px;
    display: inline-block;
    color:#606266;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
    text-overflow: ellipsis;
  }
  .linkable{
    // margin-top: 10px;
    border-bottom: 1px solid $colorTheme;
    color:$colorTheme !important;
    cursor: pointer;
  }
  .icon{
    font-size:17px;
    color:#009688;
    padding:0 10px;
    cursor: pointer;
  }

}

// 分页
.pagination-footer{
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  .pagination-select{
    flex: 1;
    line-height: 30px;
    font-weight: bold;
    .number{
      color: #009688;
    }
  }
  .pagination-total {
    // float: left;
    margin-right: 20px;
    height: 32px;
    line-height: 32px;
  }
}
</style>
