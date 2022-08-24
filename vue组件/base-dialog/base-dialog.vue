<!--
 * @Author: Hongzf
 * @Date: 2022-08-24 12:34:01
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-08-24 12:36:09
 * @Description: 
-->

<template >
  <el-dialog title="弹框" :visible.sync="dialogVisible" width="640px">
    哈哈哈哈哈
  </el-dialog>
</template>

<script>
// import { getOrganList, addCourse, updateCourse } from '@/api/api'
    export default {
        props: {
            isVisible: {
                type: Boolean
            }
        },
        data () {
            return {
                dialogVisible: false
            }
        },
        methods: {},
        watch: {
            dialogVisible () {
                this.$emit('update:isVisible', this.dialogVisible)
            }
        },
        mounted () {
            this.dialogVisible = this.isVisible
        }
    }
</script>

<style lang="scss" scoped>
.form {
  width: 75%;
  margin: 0 auto;
  height: 282px;
  /deep/ .el-select {
    width: 357px;
  }
}
.dialog-footer {
  margin-top: -10px;
  height: 63px !important;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid #f0f0f0;
  color: rgba(0, 0, 0, 0.85);
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  height: 55px !important;
}
/deep/ .el-dialog__footer {
  border-top: 1px solid #f0f0f0;
  height: 63px;
}
/deep/ .el-input-group__append {
  width: 70px;
  text-align: center;
}
</style>
