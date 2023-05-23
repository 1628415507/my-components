<!--
 * @Description: 文件预览页面
 * @Date: 2023-03-24 17:27:51
 * @LastEditors: Hongzf
 * @LastEditTime: 2023-03-29 10:47:25
-->
<template>
  <div class="file-preview">
    <!-- Excel-预览 -->
    <ExcelOfXLSX v-if="false" :info="info" />
    <ExcelOfVueOffice v-if="['xlsx'].includes(info.attachmentSuffix)" :info="info" />
    <!-- Docx-预览 -->
    <DocxOfDocxPreview v-if="['doc', 'docx'].includes(info.attachmentSuffix)" :info="info" />
  </div>
</template>

<script>
import ExcelOfXLSX from './component/ExcelOfXLSX';
import ExcelOfVueOffice from './component/ExcelOfVueOffice';
import DocxOfDocxPreview from './component/DocxOfDocxPreview';
export default {
  name: 'FilePreview',
  components: {
    ExcelOfVueOffice,
    ExcelOfXLSX,
    DocxOfDocxPreview
  },
  data() {
    return {
      info: {}
    };
  },
  mounted() {
    const info = this.$route.query.info
    this.info = JSON.parse(info)
  },
  methods: {}
};
</script>
<style scoped lang="scss"></style>
