<template>
  <div v-loading="loading" class="docx-wrap">
    <div ref="docFileRef" />
  </div>
</template>
<script>
import { downloadAttachmentFile } from '@/api/common.js';
import { renderAsync } from 'docx-preview';
// 插件配置项
const docxOption = {
  // className: 'docx', // 默认和文档样式类的类名/前缀
  // inWrapper: true, // 启用围绕文档内容呈现包装器
  // ignoreWidth: false, // 禁用页面的渲染宽度
  // ignoreHeight: false, // 禁用页面的渲染高度
  // ignoreFonts: false, // 禁用字体渲染
  // breakPages: true, // 在分页符上启用分页
  // ignoreLastRenderedPageBreak: true, // 在lastRenderedPageBreak元素上禁用分页
  // experimental: false, // 启用实验功能（制表符停止计算）
  // trimXmlDeclaration: true, // 如果为true，则在解析之前将从xml文档中删除xml声明
  // useBase64URL: false, // 如果为true，图像、字体等将转换为base 64 URL，否则使用URL.createObjectURL
  // useMathMLPolyfill: false, // 包括用于铬、边等的MathML多填充。
  // showChanges: false, // 启用文档更改的实验渲染（插入/删除）
  // debug: false // 启用额外的日志记录
}
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false
    };
  },
  watch: {
  },
  mounted() {
    this.loading = true
    this.getFileStream(this.info)
  },
  methods: {
    // 预览
    getFileStream(item) {
      console.log('【handlePreview- item 】-95', item)
      downloadAttachmentFile({ attachmentManageId: item.attachmentManageId }).then((res) => {
        if (!res) {
          return false
        }
        const fr = new FileReader();
        fr.readAsArrayBuffer(res);
        fr.addEventListener('loadend', (e) => {
          // console.log('loadend---->', e)
          const buffer = e.target.result;
          this.docxPreview(buffer, item);// 在当前页面预览
          // this.docxPreview(buffer, item);// 在新的页面预览
        }, false);
      }).catch(() => {
        this.loading = false
      })
    },
    // docx文档预览(在当前页面预览)
    docxPreview(buffer) {
      const container = this.$refs.docFileRef
      renderAsync(buffer, container, null, docxOption).then(() => {
        this.loading = false
      })
    },
    // docx文档预览(在新的页面预览)
    docxPreviewNewPage(buffer, item) {
      const docWindow = window.open('', 'DetailRunTime'); // 创建新窗口
      const fileName = item.attachmentTitle
      const box = document.createElement('div')
      const container = box
      renderAsync(buffer, container, null, docxOption).then(res => {
        // 在document被加载完后调用docuemnt.write方法时将会自动去触发document.open()
        docWindow.document.write(container.outerHTML);
        // // 渲染文件后将div添加到新窗口中，div不能提前添加，否则新窗口中不能渲染出文件
        // // 注意这里不能直接用box
        docWindow.document.title = fileName // 窗口标题
        // docWindow.document.getElementsByClassName('docx')[0].style.width = 'auto'
        docWindow.document.getElementsByClassName('docx')[0].style.width = '900px'
        docWindow.document.getElementsByClassName('docx')[0].style.overflowX = 'auto'
        docWindow.document.getElementsByClassName('docx')[0].style.padding = '50px'
        // close()方法可关闭一个由open()方法打开的输出流，并显示选定的数据。
        docWindow.document.close();// 不调用此方法，每次document.write的内容会合并在一起
        // docWindow.document.getElementsByClassName('docx_15')[0].style.minWidth = '50% !important'
        // const docx15List = docWindow.document.getElementsByClassName('docx_15')
        // const len = docx15List.length
        // console.log('【docx15List 】-117', len, docx15List)
        // for (let i = 0; i < len; i++) {
        //   docWindow.document.getElementsByClassName('docx_15')[i].style.width = '50% !important'
        //   docWindow.document.getElementsByClassName('docx_15')[i].style.minWidth = '50% !important'
        // }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .docx{
  width:auto;//900px  !important;
  overflow-x: auto !important;
  padding:50px  !important;
}
/deep/ .docx_15{
  min-width: 50%;
}
.docx-wrap{
  min-height: 500px;
}
</style>
