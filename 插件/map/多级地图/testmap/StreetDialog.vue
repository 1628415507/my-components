/**
* @Description:    全国乡镇数据获取
* @Author:         TSY 
* @Email:          t@tsy6.com
* @CreateDate:     2020/07/07 01:02
*/
<template>
  <div class="dialog"
       v-show="isShowDialog">
    <div class="dialog-content">
      <div class="dialog-title">全国乡镇数据获取</div>
      <div class="dialog-close"
           @click="closeDialog">&times;</div>
      <div class="dialog-concat">
        <p>邮箱：2890228902@qq.com</p>
        <p>QQ：2890228902</p>
      </div>
      <div class="dialog-bottom">
        <div class="dialog-btn dialog-cancel"
             @click="demo">查看示例数据</div>
      </div>
      <div class="dialog-btn dialog-cancel"
           @click="contact">点此咨询</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "streetDialog",
  data() {
    return {
      isShowDialog: false,//是否显示打赏弹窗
    }
  },
  mounted() {

  },
  computed: {},
  methods: {
    demo() {
      this.$ba && this.$ba.trackEvent('echartsMap', '乡镇数据', '查看示例数据');
      window.location.href = "https://hxkj.vip/demo/streetMap/index.html"
    },
    closeDialog() {
      this.isShowDialog = false;
    },
    contact() {
      this.$emit('confirm')
      this.isShowDialog = false;
    },
    show() {
      this.isShowDialog = true;
    }
  }
}
</script>

