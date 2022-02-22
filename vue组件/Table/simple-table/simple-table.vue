<!--
 * @Author: your name
 * @Date: 2021-06-08 15:26:46
 * @LastEditTime: 2021-07-30 09:46:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rfkt-admin\src\views\basicInformation\course\components\simple-table.vue
-->
<template>
    <el-table
        v-loading="loading"
        ref="table"
        style="width: 100%"
        :size="size"
        :data="tableData"
        :height="height"
    >
        <!-- 数据列 -->
        <el-table-column
            v-for="(item, index) in propData"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :header-align="item.headerAlign || 'center'"
            :align="item.align || 'center'"
            :formatter="item.isFormatter ? formatVal : null"
        >
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column
            v-if="isOperateColumn"
            label="操作"
            header-align="center"
            align="center"
            fixed="right"
            minWidth="130"
        >
            <template slot-scope="scope">
            <!-- 传递每行的值 -->
                <slot name="operate" v-bind:rowData="scope.row"></slot>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        props: {
            dataList: {
                type: Array,
                default: () => [], // 数据列的数据
                required: true
            },
            labelList: {
                type: Array,
                default: () => [], // 数据列的显示标题和字段名
                required: true
            },
            height: {
                type: Number, // 表格高度
                required: false
            },
            isOperateColumn: {
                type: Boolean,
                default: false // 是否显示操作列
            },
            loading: {
                type: Boolean,
                default: false // 是否显示加载动画
            },
            size: {
                type: String,
                default: 'medium', // Table 的尺寸
                validator: function (val) {
                    return ['medium', 'small', 'mini'].includes(val) // 可选值:medium / small / mini
                }
            },
            formatter: {
                type: Function,
                default: () => {} // 数据列-数据格式化方法
            }
        },
        data () {
            return {
                tableData: [], // 表格数据
                propData: [] // 列名数据
            }
        },
        methods: {
            // 格式化数据
            formatVal (row, column, cellValue, index) {
                const temp = {
                    prop: column.property, // 字段名
                    val: cellValue // 字段值
                }
                return this.formatter({ ...row, ...temp })
            }
        },
        watch: {
            // 监听外部-表格数据-的变化
            dataList: {
                handler: function (newVal) {
                    this.tableData = newVal
                },
                deep: true // 深度监听
            },
            // 监听外部-加载状态-的变化
            loading: function (newVal) {
                this.loading = newVal
            }
        },
        created () {
            this.tableData = this.dataList
            this.propData = this.labelList
        },
        mounted () {}
    }
</script>

<style lang='less' scoped>
</style>
