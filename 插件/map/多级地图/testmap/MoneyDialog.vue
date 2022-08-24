/**
* @Description:    哎呀呀，这就是打赏弹窗，为方便你们删除，就单独抽出一个文件来吧
* @Author:         TSY 
* @Email:          t@tsy6.com
* @CreateDate:     2019/5/9 23:02
*/
<template>
  <div class="dialog"
       v-show="isShowDialog">
    <div class="dialog-content">
      <div class="dialog-title">赏根辣条？</div>
      <div class="dialog-close"
           @click="closeDialog">&times;</div>
      <div class="dialog-img">
        <img src="./images/alipay.png"
             alt="">
        <img src="./images/wxpay.jpg"
             alt="">
      </div>
      <div class="dialog-bottom">
        <div class="dialog-btn dialog-cancel"
             @click="confirmDownload('no')">我就不！傲娇地下载</div>
        <div class="dialog-btn dialog-confirm"
             @click="confirmDownload('yes')">已打赏！壕气地下载</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dialog",
  data() {
    return {
      isShowDialog: false,//是否显示打赏弹窗
    }
  },
  mounted() {

  },
  computed: {},
  methods: {
    closeDialog() {
      this.isShowDialog = false;
    },
    confirmDownload(type) {
      if (type === 'no') {
        this.$ba && this.$ba.trackEvent('echartsMap', '打赏弹窗', '点击不打赏');
      } else {
        this.$ba && this.$ba.trackEvent('echartsMap', '打赏弹窗', '点击已打赏');
      }
      this.$emit('confirm')
      this.isShowDialog = false;
    },
    show() {
      this.isShowDialog = true;
    }
  }
}
</script>
