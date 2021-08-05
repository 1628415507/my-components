<template>
  <div class="newsPage">
    <div class="top clearfix"></div>
    <div class="tableBackgroundDiv">
      <div class="btn_gronp">
          <el-button type="primary" size="medium" @click="addForm('添加')">添加</el-button>
          <el-button type="primary" size="medium" @click="deleteForm(currentRowIds)" :disabled="currentRowIds.length === 0">批量删除</el-button>
      </div>
        <!-- 列表 -->
        <simple-table
          :loading="loading"
          :dataList="tableData"
          :labelList="labelData"
          :height="tableHeight"
          :formatter="formatVal"
          :operateShow="true"
          :indexShow="true"
          :selectShow="true"
          @selection-change="handleSelectionChange"
          @select-able="useRevoke"
      >
      <!-- 操作列 -->
        <template #operate="scope">
            <div class="operation">
                <span v-if="scope.row.status === 2" class="defaultColor" @click="offUpForm(scope.row.id)">上架</span>
                <span v-if="scope.row.status === 1" class="defaultColor" @click="offShelf(scope.row.id)">下架</span>
                <span class="defaultColor" @click="addForm('编辑', scope.row)">编辑</span>
                <span v-if="scope.row.status === 2" class="defaultColor" @click="deleteForm(scope.row.id)">删除</span>
            </div>
        </template>
      </simple-table>
    </div>
    <el-form :inline="true" class="footer-btn clearfix">
      <Pagination class="pageClass"
        :params="params"
        @hanlePage="handleCurrentChange"
        @hanleSize="handleSizeChange">
      </Pagination>
    </el-form>
    <AddEdit v-if="addDialog" :dialog.sync="addDialog" :titleName="titleName" :editData="editData" @getSchemeList="getSchemeList"></AddEdit>
  </div>
</template>
<script>
    import SimpleTable from '@/components/public/simple-table'
    // import md5 from 'js-md5'
    import mixin from '@/mixin'
    import AddEdit from './components/add-edit'
    import { getNewsPage, useNews, deleteNews } from '@/api/api'
    export default {
        mixins: [mixin],
        components: {
            AddEdit, SimpleTable
        },
        data () {
            return {
                addDialog: false,
                titleName: '',
                loading: true,
                tableData: [],
                currentRow: [],
                currentRowIds: [], // 删除的ids
                labelData: Object.freeze([
                    { label: '新闻标题', prop: 'title' },
                    { label: '封面图', prop: 'coverImage', type: 'img' },
                    { label: '发布人', prop: 'publisher' },
                    { label: '发布时间', prop: 'publishTime' },
                    { label: '是否置顶', prop: 'isTop', isFormatter: true },
                    { label: '状态', prop: 'status', isFormatter: true }
                ])
            }
        },
        watch: {
            'params.total': function () {
                if (this.params.total === (this.params.current - 1) * this.params.size && this.params.total !== 0) {
                    this.params.current -= 1
                    this.getTableData()
                }
            }
        },
        methods: {
            // 勾选
            handleSelectionChange (rows) {
                this.currentRowIds = rows.map(item => item.id)
                this.currentRow = rows
            },
            useRevoke (row, index) {
                if (row.status === 2) {
                    return true
                } else {
                    return false
                }
            },
            addForm (val, item) {
                this.addDialog = true
                this.editData = item || ''
                this.titleName = val
            },
            getSchemeList () {
                this.$message.success('保存成功')
                this.getTableData()
                this.addDialog = false
            },
            // 删除
            deleteForm (ids) {
                this.$confirm('是否确认删除选中的新闻?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteNews(ids).then(res => {
                        this.$message.success('删除成功')
                        this.getTableData()
                    })
                })
            },
            // 上架
            offUpForm (id) {
                this.$confirm('是否确认上架该新闻', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    useNews({
                        id: id,
                        status: 1
                    }).then(res => {
                        this.$message.success('上架成功')
                        this.getTableData()
                    }).catch(err => {
                        this.$message.error(err.response.data.message)
                    })
                })
            },
            // 下架
            offShelf (id) {
                this.$confirm('是否确认下架该新闻', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    useNews({
                        id: id,
                        status: 2
                    }).then(res => {
                        this.$message.success('下架成功')
                        this.getTableData()
                    }).catch(err => {
                        this.$message.error(err.response.data.message)
                    })
                })
            },
            getTableData () {
                this.loading = true
                getNewsPage({
                    page: this.params.current,
                    size: this.params.size,
                    status: null
                }).then(res => {
                    this.tableData = res.data
                    this.getPagination(res)
                    this.loading = false
                }).catch(err => {
                    console.log(err)
                    this.loading = false
                })
            },
            // 格式化数据
            formatVal (obj) {
                // 是否置顶
                if (obj.prop === 'isTop') {
                    return obj.val === 1 ? '是' : '否'
                }
                // 状态
                if (obj.prop === 'status') {
                    return this.$util.dicShow('UP_OR_DOWN', obj.val) || ''
                }
            }
        },
        mounted () {
            this.getHeight()
            this.handleQuery()
        }
    }
</script>
<style lang="less">
.newsPage{
    .el-dialog .el-form--inline .el-form-item{
        margin-right: 0;
    }
    .top {
        padding: 0;
    }
}
</style>
