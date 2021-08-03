<template>
  <div class="course_page">
    <div class="top clearfix" style="display: none"></div>
    <!-- 表格 -->
    <div class="tableBackgroundDiv">
      <!-- 按钮 -->
      <div class="btn_gronp">
        <el-button
          type="primary"
          size="mini"
          @click="handleFormVisible(null, '添加课程')"
          >添加</el-button
        >
      </div>
      <!-- 列表 -->
        <simple-table
          :loading="loading"
          :dataList="tableData"
          :labelList="labelData"
          :height="tableHeight"
          :formatter="formatVal"
          :isOperateColumn="true"
      >
      <!-- 操作列 -->
        <template #operate="slotScope">
          <div class="operation">
            <span
              class="defaultColor"
              @click="handleFormVisible(slotScope.rowData, '编辑课程')"
              >编辑</span
            >
            <span
              v-if="slotScope.rowData.status !== 1"
              class="defaultColor"
              @click="handleStatus(slotScope.rowData.id, 1)"
              >上架</span
            >
            <span
              v-if="slotScope.rowData.status !== 2"
              class="defaultColor"
              @click="handleStatus(slotScope.rowData.id, 2)"
              >下架</span
            >
            <span
              v-if="slotScope.rowData.status !== 1"
              class="defaultColor"
              @click="handleDelete(slotScope.rowData.id)"
              >删除</span
            >
          </div>
        </template>
      </simple-table>
    </div>
    <!-- 分页 -->
    <el-form :inline="true" class="footer-btn clearfix">
      <Pagination
        class="pageClass"
        :params="params"
        @hanlePage="handleCurrentChange"
        @hanleSize="handleSizeChange"
      >
      </Pagination>
    </el-form>
    <!-- 弹框 -->
    <DialogForm
      v-if="dialogVisible"
      :isVisible.sync="dialogVisible"
      :title="title"
      :editData="editData"
      @getTableData="getTableData()"
    ></DialogForm>
  </div>
</template>

<script>
    import SimpleTable from '@/components/public/simple-table'
    import mixin from '@/mixin'
    import DialogForm from './components/dialog-form'
    import { getCourseByPage, deleteCourse, updateStatus } from '@/api/api'
    export default {
        mixins: [mixin],
        components: { DialogForm, SimpleTable },
        data () {
            return {
                tableData: [],
                dialogVisible: false,
                title: '',
                editData: {},
                labelData: [
                    { label: '课程名称', prop: 'courseName' },
                    { label: '上架日期', prop: 'publishTime' },
                    { label: '课程金额', prop: 'courseFee', isFormatter: true },
                    { label: '显示顺序', prop: 'courseSort' },
                    { label: '状态', prop: 'status', isFormatter: true }
                ]
            }
        },
        methods: {
            handleFormVisible (rowData, title) {
                this.title = title
                this.editData = rowData
                this.dialogVisible = true
            },
            // 上/下架
            handleStatus (courseId, status) {
                const tips = status === 1 ? '确认上架？' : '确认下架？'
                const successMsg = status === 1 ? '上架成功！' : '下架成功！'
                this.$confirm(tips, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateStatus({ courseId, status })
                        .then((res) => {
                            this.$message.success(successMsg)
                            this.getTableData()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
            },
            // 删除课程名称
            handleDelete (id) {
                this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCourse({ courseId: id })
                        .then((res) => {
                            this.$message.success('删除成功!')
                            this.getTableData()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
            },
            // 获取列表数据
            getTableData () {
                this.loading = true
                getCourseByPage({
                    page: this.params.current,
                    size: this.params.size
                })
                    .then((res) => {
                        this.tableData = res.data
                        this.getPagination(res)
                        this.loading = false
                    })
                    .catch((err) => {
                        console.log(err)
                        this.loading = false
                    })
            },
            // 格式化数据
            formatVal (obj) {
                if (obj.prop === 'courseFee') {
                    return obj.courseFee + '元'
                }
                if (obj.prop === 'status') {
                    return this.$util.dicShow('UP_OR_DOWN', obj.status) || ''
                }
                return obj.val
            }
        },
        mounted () {
            this.getHeight()
            this.$nextTick(() => {
                this.hegihtNum = document.querySelector('.filterForm').clientHeight
            })
            this.getTableData()
        }
    }
</script>

<style lang="less" scope>
</style>
