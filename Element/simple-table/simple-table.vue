<!--
 * @Author: your name
 * @Date: 2021-06-08 15:26:46
 * @LastEditTime: 2021-08-03 11:49:41
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
/**
 * 【labelList中的对象属性】：{
 *  isFormatter：是否需要对数据进行格式化，默认否，是：则传入formatter方法设置
 *  其他：label、prop、width、headerAlign、align同el-table-columne原属性
 * }
 *
*/
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
            formatter: {
                type: Function,
                default: () => {} // 数据列-数据格式化方法
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
                // row：当前行数据
                // column：当前列属性
                // cellValue：
                const temp = {
                    prop: column.property // 字段名
                    // val: cellValue // 字段值
                }
                return this.formatter({ ...row, ...temp })// 传入当前行的数据和temp中的数据
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
