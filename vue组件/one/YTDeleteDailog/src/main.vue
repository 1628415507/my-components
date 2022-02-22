<!--
 * @Descripttion : 
 * @version      : 
 * @Author       : ryan
 * @Date         : 2021-12-03 09:59:49
 * @LastEditors  : ryan
 * @LastEditTime : 2021-12-03 10:13:52
 * @FilePath     : \operator-side\src\components\YTDeleteDailog\src\main.vue
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    v-bind="dialogProps"
    width="390px"
    center
  >
    <p class="title_text" slot="title">提示</p>
    <div class="content-wrap">
      <img src="@/assets/images/remove_icon.png" alt="" />
      <p class="notice_text">是否删除，请确认是否继续删除？</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import dialog from '@/mixins/dialog/dialog'
import RemoveFunc from '@/mixins/dialog/removeFunc'

export default {
  name: 'YTDeleteDailog',
  mixins: [dialog, RemoveFunc],
  data() {
    return {
      data: {
        id: []
      }
    }
  },
  methods: {
    /**
     * @function 弹窗打开前的方法（开发人员覆盖这个方法）
     */
    beforeOpenDialog() {
      // 这里写打开弹窗前的操作，留给开发人员覆盖
      return new Promise(resolve => {
        resolve()
      })
    },
    /**
     * @function 弹窗打开后的方法（开发人员覆盖这个方法）
     */
    afterOpenDialog() {
      // 弹窗打开后的方法（开发人员覆盖这里）
    },
    /**
     * @function 确认点击后，执行操作前的钩子函数
     */
    /* beforeConfirm() {
      return new Promise((resolve) => {
        resolve()
      })
    }, */
    /**
     * @function 关闭弹窗前的事件（开发人员覆盖这个方法）
     */
    /* beforeCloseDialog() {
      return new Promise((resolve) => {
        resolve()
      })
    }, */
    /**
     * @function 关闭弹窗后的方法（开发人员覆盖这个方法）
     */
    afterCloseDialog() {}
  }
}
</script>
<style lang="less" scoped>
.title_text {
  font-size: 14px;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
  font-weight: 500;
  color: #2b2b2b;
  line-height: 20px;
}
.content-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  img {
    width: 55px;
    height: 56px;
    margin-bottom: 18px;
  }
  .notice_text {
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #242d41;
    line-height: 24px;
  }
}
</style>
