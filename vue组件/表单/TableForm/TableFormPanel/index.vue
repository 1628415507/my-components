<!--
 * @Description:编辑表格（开发中...）
 * @Date: 2023-01-29 21:18:49
 * @LastEditors: Hongzf
 * @LastEditTime: 2023-05-22 09:38:47
    TODO: prop和值的绑定形式有没有更好的方式？
    TODO:自定义表单验证是否支持（待验证）
-->
<template>
  <el-form
    ref="tableFormRef"
    v-bind="$attrs"
    :model="value"
    :rules="rules"
    label-width="0"
    class="table-form-panel"
    :size="size"
  >
    <div class="table-wrap">
      <el-table
        ref="tableRef"
        v-loading="listLoading"
        :data="value[tableProp]"
        highlight-current-row
        :size="size"
        :height="tableConfig.height"
        :max-height="tableConfig.maxHeight || '600px'"
        :border="tableConfig.border"
        :cell-style="tableConfig.cellStyle"
        :stripe="tableConfig.stripe"
        :header-cell-style="headerCellStyle"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
        @select="handleSelect"
        @selection-change="handleSelectionChange"
      >
        <!-- 序号（默认展示）-->
        <el-table-column v-if="tableConfig.indexShow !== false" type="index" label="序号" width="60px" align="center">
          <template slot-scope="scope">
            <el-form-item class="table-form-item">  {{ scope.$index+1 }} </el-form-item>
          </template>
        </el-table-column>
        <!-- 勾选框（默认不展示）-->
        <el-table-column v-if="tableConfig.selectionShow" type="selection" :selectable="tableConfig.selectable" width="60px" />
        <!-- 数据列-->
        <template v-for="(column,index) in columns">
          <!-- 表格列 -->
          <el-table-column
            v-if=" (typeof column.hidden === 'function') ? (column.hidden(column, index) !== true) : (column.hidden !== true) "
            :key="column.prop"
            :prop="column.prop"
            :label="typeof column.label === 'function' ? column.label(column, index) : column.label"
            :align="column.columnAlign || 'center'"
            :min-width="column.columnMinWidth||columnMinWidth"
            :width="column.columnWidth"
          >
            <!-- 表头-自定义表头 -->
            <template slot="header">
              <!-- 加星号* -->
              <div class="custom-header" :title="typeof column.label === 'function' ? column.label(column, index) : column.label">
                <span v-if="!readonly&&column.required" class="required-logo">*</span>
                <span>{{ typeof column.label === 'function' ? column.label(column, index) : column.label }}</span>
              </div>
              <!-- 加提示 -->
              <el-popover
                v-if="typeof column.tipShow === 'function'?column.tipShow(scope.row, scope.$index):(column.tipShow||false)"
                trigger="hover"
                placement="top"
                :width="column.tipWidth||190"
                :content="column.tipContent">
                <i slot="reference" class="el-icon-question" style="color:orange" />
              </el-popover>
            </template>
            <!-- 表单列 -->
            <template slot-scope="scope">
              <!-- 确定每一行的唯一key值 {{ getRowKey(scope.$index) }}-->
              <el-form-item
                :key="`${getRowKey(scope.$index)}_${scope.$index}_${column.prop}`"
                :style="{ width: column.width || '100%' }"
                :prop="`[${tableProp}][${scope.$index}][${column.prop}]`"
                :rules="handleRules(column,scope)"
                :error="typeof column.error === 'function' ? column.error() : column.error "
                class="table-form-item"
              >
                <!-- 1.纯文本 -->
                <template v-if="!column.type||readonly">
                  <div :title="formatterVal(column,scope)" v-html="formatterVal(column,scope)" />
                </template>
                <!-- 2.自定义具名插槽 -->
                <template v-else-if="column.type === 'customSlot'">
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
                    <div
                      :title="formatterVal(column,scope)"
                      v-html="formatterVal(column,scope)"
                    />
                  </template>
                </template>
                <!-- 3.文字链接 -->
                <template v-else-if="column.type === 'link'">
                  <!-- 3.1 不可点击 -->
                  <span
                    v-if="typeof column.disabled == 'function'? column.disabled(scope.row, scope.$index) : (column.disabled || false)"
                    class="link"
                  >
                    {{ formatterVal(column,scope) }}
                  </span>
                  <!-- 3.2 可点击 -->
                  <span
                    v-else
                    class="link linkable"
                    :title="formatterVal(column,scope)"
                    @click="column.method(scope.row, scope.$index)"
                  >
                    {{ formatterVal(column,scope) }}
                  </span>
                </template>
                <!-- 表单项 -->
                <!-- <FormPanelItem v-else v-model="scope.row[column.prop]" :item="column" :index="scope.$index" :row="scope.row" /> -->
                <FormPanelItem
                  v-else
                  :value="value"
                  :item="column"
                  :scope="scope"
                  :row-index="scope.$index"
                  :row="scope.row"
                />
              </el-form-item>
            </template>
          </el-table-column>
        </template>

        <!-- 操作列-->
        <el-table-column
          v-if="
            ((typeof operates.hidden === 'function'
              ? operates.hidden() !== true
              : operates.hidden !== true)
            )&& !readonly && operates.list.length"
          :label="operates.label || '操作'"
          align="center"
          :width="operates.width"
          :fixed="operates.fixed"
        >
          <template slot-scope="scope">
            <el-form-item :key="`${getRowKey(scope.$index)}_${scope.$index}_optColumn`">
              <span v-for="(btnItem, btnIndex) in operates.list" :key="btnIndex">
                <!-- 首先判断按钮是否隐藏 -->
                <template v-if="(typeof btnItem.show == 'function' ? btnItem.show(scope.row, scope.$index) : btnItem.show)===false? false:true">
                  <!-- 自定义插槽 -->
                  <template v-if="btnItem.type==='customSlot'">
                    <slot
                      :name="`${btnItem.id}`"
                      :index="scope.$index"
                      :btn="btnItem"
                      :row="{ index: scope.$index, ...scope.row }"
                    >
                      自定义插槽{{ btnItem.label }}
                    </slot>
                  </template>
                  <template v-else>
                    <!-- 1.字体图标 -->
                    <span v-if="btnItem.type==='icon'" :title="btnItem.label" @click="btnItem.method(scope.row, scope.$index)">
                      <i :class="[btnItem.icon,'icon']" :style="{color:btnItem.color||'#009688'}" />
                    </span>
                    <!-- 2.图片 -->
                    <!-- 3.按钮（默认） -->
                    <el-button
                      v-else
                      style="margin: 0 4px;font-size:14px;"
                      :type="btnItem.type"
                      :class="btnItem.class"
                      size="mini"
                      :disabled="typeof btnItem.disabled == 'function' ? btnItem.disabled(scope.row,scope.$index) : btnItem.disabled "
                      :plain="btnItem.plain"
                      @click.stop="btnItem.method(scope.row, scope.$index)"
                    >
                      {{ btnItem.label }}
                    </el-button>
                  </template>
                </template>
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!--endregion-->
      </el-table>
      <!-- 分页 ( TODO:是否必要？ ) -->
      <!-- <div v-if="tableConfig.pagination" class="pagination-footer">
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
      </div> -->
    </div>
  </el-form>
</template>
<script>
import FormPanelItem from './FormItem.vue';
export default {
  name: 'TableFormPanel',
  provide() {
    return {
      tableProp: this.tableProp
    };
  },
  components: {
    FormPanelItem
  },
  props: {
    // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    columns: {
      type: Array,
      default: () => [],
      required: true
    },
    // 表单验证规则
    rules: {
      type: Object,
      default: () => ({})
    },
    // ====== 表格相关参数 ======
    // 列表数据
    value: {
      type: Object,
      required: true,
      default: () => {
        return {
          tableData: [] // 如果传的字段不是tableData，则通过tableProp配置
        };
      }
    },
    tableProp: {
      type: String,
      default: 'tableData' // 表单中的列表数据的字段名
    },
    // 数据列表加载状态
    listLoading: {
      type: Boolean,
      default: false
    },
    // 操作按钮组 === label: 文本，type :类型（primary / success / warning / danger / info / text），show：是否显示，icon：按钮图标，plain：是否朴素按钮，disabled：是否禁用，method：回调方法
    operates: {
      type: Object,
      default: () => {}
    },
    // 表格配置
    tableConfig: {
      type: Object,
      default: () => {
        return {
          stripe: true, // 是否为斑马纹 table
          border: true, // 是否边框
          highlightCurrentRow: false // 是否要高亮当前行
        };
      },
      pagination: true
    },
    // 表格分页的控制参数
    pagination: {
      type: Object,
      default: () => {}
    },
    // 表格是否只读，只读状态下只显示文本，不显示插槽操作列
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String, // 组件大小
      default: 'small',
      require: false
    },
    // 表格列的最小宽度(整体)
    columnMinWidth: {
      type: String, // 组件大小
      default: '',
      require: false
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
      // // 表单
      // formData: {
      //   tableData: []
      // },
      // 表格
      pageIndex: 1,
      multipleSelection: [] // 多行选中
    };
  },
  computed: {},
  watch: {
    value: {
      deep: true,
      handler(newVal, oldVal) {
        // ！！！如果需要可以监听
        // 传进来的列表需要是响应式数据
        // 如果不是,就通过$set转成响应式数据再传进来
        // 如： this.$set(this.formData, 'tableData', _res.list || []); // 将表格数据转为响应式
        // console.log('【 newVal 】-138', newVal)
      }
    }
  },
  mounted() {
    // this.setDefaultValue()
  },
  methods: {
    handleRules(column, scope) {
      // 自定义验证
      if (column.rules) {
        console.log('【 column.rules 】-323', column.rules, column.prop)
        // 2.
        return typeof column.rules === 'function'
          ? column.rules(scope.row, scope.$index, column)
          : column.rules
        // 3.
        // return typeof column.rules === 'function'
        //   ? [{ validator: (rule, value, callback) => { return column.rules(rule, value, callback, scope.row, scope.$index) }, trigger: ['blur', 'change'] }]// column.rules(scope.row, scope.$index)
        //   : column.rules
      } else {
        console.log('【 this.rules[column.prop] 】-328', column.prop, this.rules[column.prop])
        return this.rules[column.prop]
      }
    },
    // 获取、设置每一行的唯一标识
    getRowKey(index) {
      console.log('【 index 】-316', index);
      let key = '';
      this.value[this.tableProp].forEach((tableItem, tableIndex) => {
        if (tableIndex === index) {
          if (!tableItem.rowKey) {
            tableItem.rowKey = Math.random();
          }
          key = tableItem.rowKey;
        }
      });
      return key;
    },
    // 数据格式化
    formatterVal(column, scope) {
      return column.formatter ? column.formatter(scope.row, column, scope.$index) : scope.row[column.nameProp || column.prop]
    },
    // ====== 表单方法 ======
    setDefaultValue() {
      // console.log('【 this.value 】-278', this.value);
      // this.$emit('input', this.value);
    },
    // ====== 表格方法 ======
    // 表格参数
    handleCurrentChange(row, oldRow) {
      this.$emit('handleCurrentChange', row, oldRow);
    },
    handleSelect(selection, row) {
      this.multipleSelection = selection;
      this.$emit('handleSelect', row);
    },
    // 多行选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('handleSelectionChange', val);
    },
    handleRowClick(row) {
      this.$emit('handleRowClick', row);
    }
    // handleSizeChange(size) {
    //   this.$emit('handleSizeChange', size);
    // },
    /* 切换页码*/
    // handleIndexChange(current) {
    //   this.$emit('handleIndexChange', current);
    // }
  }
};
</script>
<style lang="scss" scoped>
.table-form-panel {
  /deep/ .el-table__row td,
  /deep/ .el-table__row th {
    // background: red;
    padding: 15px 0 0 0  !important;
    // 去除输入框的边框
    .el-input__inner{
      border: none;
      background: transparent;
      // text-align: center !important;
    }
  }

  /deep/ .el-table td, .el-table th {
    padding: 15px 0 0 0;
  }
}
// 表格样式
.table-wrap {
  // 自定义表头加*号
  .custom-header {
    display:inline-block;
    position: relative;
    .required-logo {
      color: #f56c6c;
    }
  }
  // 表单项处理
  .table-form-item {
    margin: 0 auto !important;
    margin-bottom: 18px !important;
  }
  // 文字链接
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
.pagination-footer {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  .pagination-total {
    margin-right: 20px;
    height: 32px;
    line-height: 32px;
  }
}
</style>
