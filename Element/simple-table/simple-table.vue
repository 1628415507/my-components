<!--
 * @Author: your name
 * @Date: 2021-06-08 15:26:46
 * @LastEditTime: 2021-08-25 16:08:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rfkt-admin\src\views\basicInformation\course\components\simple-table.vue
-->
<template>
    <div class="simple-table">
        <el-table
            v-loading="loading"
            ref="table"
            style="width: 100%"
            :size="size"
            :data="tableData"
            :height="height"
            @selection-change="handleSelectionChange"
            :header-cell-style="headerCellStyle"
        >
            <!-- 1.多选列 -->
            <el-table-column v-if="selectShow" type="selection"  fixed="left" header-align="center" align="center" width="50" :selectable="handleSelectAble"></el-table-column>
            <!-- 2.序号列 -->
            <el-table-column v-if="indexShow" type="index" label="序号" fixed="left" width="48" header-align="center" align="center"></el-table-column>
            <template  v-for="(item, index) in propData" >
            <!-- 3.基础列 -->
            <el-table-column
                v-if="!item.type"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :header-align="item.headerAlign || 'center'"
                :align="item.align || 'center'"
                :formatter="item.isFormatter ? formatVal : null"
                show-overflow-tooltip
            >
            </el-table-column>
            <!-- 4.自定义列 -->
            <el-table-column
                v-if="item.type"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :header-align="item.headerAlign || 'center'"
                :align="item.align || 'center'"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <!-- 图片列 -->
                    <div v-if="item.type === 'img'">
                        <el-image
                            :src="$util.photoShow(scope.row[item.prop])"
                            class="img" fit="contain">
                            <div slot="error" class="image-slot"><i class="el-icon-warning-outline"></i></div>
                        </el-image>
                    </div>
                    <!-- 插槽列（图片、按钮...） -->
                    <div v-if="item.type === 'slot'">
                        <slot :name="`${item.prop}`" v-bind:row="scope.row"></slot><!-- 插槽名：item.prop -->
                    </div>
                </template>
            </el-table-column>
            </template>

            <!-- 5.操作列 -->
            <el-table-column
                v-if="operateShow"
                label="操作"
                header-align="center"
                align="center"
                fixed="right"
                minWidth="130"
            >
                <template slot-scope="scope">
                    <!-- 插槽名：operate，通过v-bind:row传回当前行的值 -->
                    <slot name="operate" v-bind:row="scope.row"></slot>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
/**
 * 【labelList中的对象属性】：{
 *   isFormatter：可选值[true,false] 是否需要对数据进行格式化，默认否；是：则传入formatter方法处理
 *   type:可选值[img,solt]
 *        img  图片类型
 *        solt 自定义插槽，插槽名字为prop的名字
 *   其他：label、prop、width、headerAlign、align同el-table-columne原属性
 * }
*/
    export default {
        props: {
            // 数据部分
            dataList: {
                type: Array,
                default: () => [], // 表格的 数据
                required: true
            },
            labelList: {
                type: Array,
                default: () => [], // 表格的 显示标题和字段名
                required: true
            },
            formatter: {
                type: Function,
                default: () => {} // 用来格式化内容，将表格的数据处理后返回展示
            },
            selectShow: {
                type: Boolean,
                default: false // 是否显示 复选框
            },
            indexShow: {
                type: Boolean,
                default: false // 是否显示 序号列
            },
            operateShow: {
                type: Boolean,
                default: false // 是否显示 操作列
            },
            // 样式部分
            loading: {
                type: Boolean,
                default: false // 是否显示 加载动画
            },
            height: {
                type: Number, // Table 的高度
                required: false
            },
            size: {
                type: String,
                default: 'medium', // Table 的尺寸
                validator: function (val) {
                    return ['medium', 'small', 'mini'].includes(val) // 可选值:medium / small / mini
                }
            },
            headerCellStyle: { // 表头单元格的 style
                type: Object,
                required: false,
                default: () => {}
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
                // return this.formatter(temp) // 将数据传入formatter()方法处理后返回
                return this.formatter({ ...row, ...temp })// 传入scope.row的值
            },
            // 当选择项发生变化时会触发该事件
            handleSelectionChange (selection) {
                this.$emit('selectionChange', selection)
            },
            handleSelectAble (row, index) {
                this.$emit('selectAble', row, index) // Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
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
.simple-table{
    .img{
        position: relative;
        width:70px;
        height: 70px;
        vertical-align: middle;
        /deep/ .image-slot {
            width:70px;
            height: 70px;
            color: #b5b7bb;
            font-size: 20px;
        }
    }
}
</style>