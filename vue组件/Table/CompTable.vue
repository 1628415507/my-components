<template>
    <el-table
            class="table"
            v-loading="$store.state.limitLoading&&isLoading"
            :data="tableData"
            :summary-method="getSummaries"
            :show-summary="summaryFlag"
            :header-cell-style="headerCalss"
            border
            ref="table"
            size="mini"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            stripe
            :height="tableHeight"
            :highlight-current-row="isHighlight"
            @sort-change="handleSort"
            @filter-change="filterHandler"
            @row-click="handleRowClick"
            @selection-change="handleSelectionChange">
        <!-- 多选框 -->
        <el-table-column
            type="selection"
            v-if="selection"
            width="55"
            fixed
        >
        </el-table-column>
        <el-table-column
            type="index"
            v-if="index"
            label="序号"
            align="center"
            fixed
        >
        </el-table-column>
        <el-table-column  v-for="(th, key) in tableHeader"
                            :key="key"
                            :prop="th.prop"
                            :label="th.label"
                            :fixed="th.fixed"
                            :sortable="th.sortable?'custom':false"
                            :filters="th.filters"
                            :column-key="th.columnKey"
                            :filtered-value="th.filteredValue"
                            :filter-multiple="th.filterMultiple"
                            :min-width="th.minWidth"
                            show-overflow-tooltip
                            align="center">
            <template slot-scope="scope">
                <ex-slot
                    v-if="th.render"
                    :render="th.render"
                    :row="scope.row"
                    :index="scope.$index"
                    :column="th"
                />
                <span v-else>
                    {{ scope.row[th.prop] || '-' }}
                </span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
/**
 * Author：     yangjc
 * CreateTime： 2020-02-20
 * updateTime： 2020-03-10
 * Desc：表格组件
 * params {Array} tableData [表格数据] 默认为[]
 * params {Array} tableHeader [表头数据] 默认为[]
 * params {Boolean} selection [是否有复选框] 默认为true
 * params {Boolean} index [是否有序号] 默认为true
 * params {Boolean} isHighlight [点击单行是否高亮] 默认为false
 * params {Boolean} isHighlight [点击单行是否高亮] 默认为false
 * params {String} tableHeight [表格高度]
 * params {Boolean} isLoading [是否有loading] 默认为false
 */
  // 自定义内容的组件
    var exSlot = {
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
        render: (h, data) => {
            const params = {
                row: data.props.row,
                index: data.props.index
            }
            if (data.props.column) params.column = data.props.column
            return data.props.render(h, params)
        }
    }
    export default {
        name: 'comp-table',
        components: { exSlot },
        watch: {
            tableData () { // 默认高亮第一行
                this.$nextTick(() => {
                    this.$refs.table.setCurrentRow(this.tableData[0])
                })
            }
        },
        props: {
            // 表格数据
            tableData: {
                type: Array,
                default: () => {
                    return []
                }
            },
            // 表头数据
            tableHeader: {
                type: Array,
                default: () => {
                    return []
                }
            },
            // 是否有复选框
            selection: {
                type: Boolean,
                default: () => {
                    return true
                }
            },
            // 是否有序号
            index: {
                type: Boolean,
                default: () => {
                    return true
                }
            },
            // 是否点击单行高亮
            isHighlight: {
                type: Boolean,
                default: () => {
                    return false
                }
            },
            // 表格高度
            tableHeight: {
                default: () => {
                    return ''
                }
            },
            // 是否有loading
            isLoading: {
                type: Boolean,
                default: () => {
                    return false
                }
            },
            summaryFlag: {
                type: Boolean,
                default: false
            },
            totalCount: {
                type: [String, Number]
            },
            clearSelect: {
                type: Boolean,
                default: () => {
                    return false
                }
            }
        },
        data () {
            return {
                headerCalss: {
                    background: '#F1F5FA',
                    color: '#212053'
                }
            }
        },
        methods: {
            // 排序事件
            handleSort (sort) {
                this.$emit('sort-events', sort)
            },
            // 筛选事件
            filterHandler (filters) {
                this.$emit('filter-events', filters)
            },
            // 某一行被点击
            handleRowClick (row, event, column) {
                this.$emit('getClickRow', row)
            },
            // 复选框
            handleSelectionChange (row) {
                this.$emit('handleOperator', '', row)
                this.$emit('handleEditStatus', row)
            },
            tableRowClassName ({ row, rowIndex }) {
                if (rowIndex % 2 === 0) {
                    return 'even-row'
                } else {
                    return 'odd-row'
                }
            },
            // 合计
            getSummaries (param) {
                this.$nextTick(() => {
                    this.$refs.table.doLayout()
                })
                const { columns } = param
                const sums = []
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计'
                    } else if (index === 8) {
                        sums[index] = this.totalCount
                    } else {
                        return ''
                    }
                })
                return sums
            },
            clearSelectFun () { // 清空复选框
                this.$refs.table.clearSelection()
            }
        }
    }
</script>
<style>
  #elTable .el-tag {
    color: #fff;
    background-color: #409EFF!important;
    cursor: default
  }
  .el-table .odd-row {
    background: #F1F5FA!important;
  }

  .el-table .even-row {
    background: #fff!important;
  }
  /* .el-table .hover-row {
    background: #FAF4DE!important
  } */
</style>
