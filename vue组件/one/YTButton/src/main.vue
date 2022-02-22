<!--
 * @Author: chenjianxin
 * @Date: 2020-07-20 18:25:30
 * @LastEditTime : 2021-12-20 09:55:30
 * @LastEditors  : yemaozi
 * @Description: 按钮模块
 * @FilePath     : \basic-info\src\components\one\YTButton\src\main.vue
-->
<template>
  <div class="button-wrap">
    <template v-for="(button, index) in buttonData">
      <el-button
        v-if="!button.uploadProps"
        v-bind="{
          ...button.buttonProps
        }"
        :disabled="button.disabled && selectedArrLength === 0"
        :key="`button_${index}`"
        @click.native="emitEvent(button)"
      >
        {{ button.text }}
      </el-button>
      <el-upload
        :key="`button_${index}`"
        class="upload"
        :show-file-list="false"
        :with-credentials="true"
        :httpRequest="uploadHttpDefault"
        :name="button.uploadProps.name || 'files'"
        multiple
        v-if="button.uploadProps"
        v-bind="{
          ...button.buttonProps,
          ...button.uploadProps
        }"
      >
        <el-button
          plain
          v-bind="{
            ...{
              plain: true
            },
            ...button.buttonProps
          }"
          :key="`button_${index}`"
        >
          {{ button.text }}
        </el-button>
      </el-upload>
    </template>
  </div>
</template>
<script>
import file from '@/mixins/file'
import { mapState } from 'vuex'
// import DEV_CONFIG from '@/config'

export default {
  name: 'YTButton', // 必填 烤肉d
  props: {
    data: {
      require: true,
      type: Array
    },
    checkAuth: {
      require: false,
      type: Boolean,
      default: true
    },
    selectedArrLength: {
      require: false,
      type: Number,
      default: 0
    }
  },
  mixins: [file],
  computed: {
    ...mapState(['buttonAuth']),
    buttonData() {
      // if (DEV_CONFIG.IS_CHECK_AUTHORITY && this.checkAuth) {
      //   return this.data.filter(
      //     item =>
      //       this.buttonAuth.includes(item.code) || item.checkAuth === false
      //   )
      // } else {
      return this.data
      // }
    }
    // DEV_CONFIG: () => DEV_CONFIG
  },
  methods: {
    /**
     * @function 往外抛出事件
     */
    emitEvent(button) {
      this.$emit(button.eventName)
    },
    /**
     * @function 上传成功的回调方法
     */
    uploadSuccess(res, file, fileList, button) {
      // console.log(res)
      this.$emit(button.eventName, res)
    },
    nullFunc() {},
    uploadError() {
      // 上传失败的方法，默认为空
    }
  }
}
</script>
<style lang="scss" scoped>
.button-wrap {
  min-height: 28px;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
}
/deep/.el-button--default {
  color: #35bcd7;
  border-color: #35bcd7;
}
/deep/.el-button {
  margin-bottom: 10px;
}
</style>
<style lang="scss">
.button-wrap {
  .el-button + .upload,
  .upload + .upload,
  .upload + .el-button {
    margin-left: 10px;
  }
}
</style>
