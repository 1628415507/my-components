
<template>
  <div v-loading="loading" class="file-preview">
    <VueOfficeExcel
      :src="fileBuffer"
      style="height: 100vh;"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
  </div>
</template>

<script>
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import { downloadAttachmentFile } from '@/api/common.js';

export default {
  name: 'ExcelOfVueOffice',
  components: {
    VueOfficeExcel
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      fileLoading: false,
      fileBuffer: ''
    }
  },
  mounted() {
    this.loading = true
    this.getFileStream(this.info)
  },
  methods: {
    // 渲染完成
    renderedHandler() {
      console.log('渲染完成')
      this.loading = false
    },
    // 渲染失败
    errorHandler() {
      console.log('渲染失败')
      // this.$message.error('表格加载失败')
      this.loading = false
    },
    // 获取文件流
    getFileStream(item) {
      console.log('【handlePreview- item 】-95', item)
      this.loading = true
      downloadAttachmentFile({ attachmentManageId: item.attachmentManageId }).then((res) => {
        if (!res) {
          return false
        }
        const reader = new FileReader();
        reader.readAsArrayBuffer(res);// 将文件对象读取为arraybuffer类型的数据
        reader.onload = (event) => {
          this.fileBuffer = event.target.result
        };
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ .x-spreadsheet-contextmenu{
  visibility: hidden !important;//隐藏鼠标右键点击弹框
}
</style>
