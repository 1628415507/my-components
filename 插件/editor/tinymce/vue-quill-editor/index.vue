<template>
  <div class="edit_container">
    <!-- 参考链接:https://blog.csdn.net/qq_44782585/article/details/123571236 -->
    <!-- 富文本不可以编辑--通过disabled='true'控制 -->
    <!-- <quill-editor v-model="content" ref="quillEditorRef" class="editor" :options="editorOption" :disabled='true'>
    </quill-editor> -->
    <quill-editor
      v-if="editable"
      ref="quillEditorRef"
      v-model="content"
      class="rich-text"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    />
    <!-- 移除标签-通过v-html -->
    <!-- ！！！类名必须是ql-editor -->
    <div v-else class="ql-editor" v-html="content" />
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'

// require styles 引入样式
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
// 添加或覆盖自带的样式
import './quill.css'

import { titleConfig } from './config.js'

// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗、斜体、下划线、删除线
  ['blockquote', 'code-block'], // 引用、代码块、
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ direction: 'rtl' }], // 文本方向
  // [{ size: ['12', '14', '16', '18', '20', '22', '24', '28', '32', '36'] }], // 字体大小
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ['clean'], // 清除文本格式
  ['link', 'image', 'video'] // 链接、图片、视频
]
export default {
  name: 'RichEditor',
  components: { quillEditor },
  props: {
    value: {
      type: String, // 文本内容
      default: '',
      require: true
    },
    editable: {
      type: Boolean, // 文本内容
      default: true
    }
  },
  data() {
    return {
      // isEditor: false,
      content: '',
      editorOption: {
        placeholder: '请输入文本...',
        theme: 'snow', // 主题 snow：有工具栏的；bubble：只有文本域的
        readyOnly: false, // 3.0.6版本通过此设置不能达到控制是否为只读模式,可以通过给组件添加 属性 :disabled='true' 或 :disabled='false' <quill-editor :disabled='true'></quill-editor>
        modules: {
          toolbar: {
            container: toolbarOptions
            // video: function(value) {
            //   console.log('【 value 】-77', value)
            //   if (value) {
            //     const href = prompt('请输入视频链接：')
            //     this.$refs.quillEditorRef.quill.format('video', href)
            //   } else {
            //     this.$refs.quillEditorRef.quill.format('video', false)
            //   }
            // }
          }
        }
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        // console.log('【 RichText-newVal, oldVal 】-96', newVal, oldVal)
        this.content = newVal
      }
    },
    content(val) {
      this.$emit('input', val);
    }
  },
  mounted() {
    // 自动聚焦
    this.$refs.quillEditorRef && this.$refs.quillEditorRef.quill && this.$refs.quillEditorRef.quill.focus()
    // 给工具栏鼠标悬停加上中文释义
    for (const item of titleConfig) {
      const tip = document.querySelector('.quill-editor ' + item.Choice)
      if (!tip) continue
      tip.setAttribute('title', item.title)
    }
    // const input = document.querySelector('.edit_container input');
    // console.log('【 input 】-111', input)
    // input && input.setAttribute('placeholder', '请输入内容');
  },
  methods: {
    // 失去焦点事件
    onEditorBlur(quill) {
      // console.log('【 onEditorBlur 】-83', this.content)
      // this.content = this.delHtmlTag(this.content) //调用移除标签函数
    },
    // 获得焦点事件
    onEditorFocus(quill) {
    },
    // 内容改变事件
    onEditorChange({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      this.content = html
    },
    // 准备富文本编辑器
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    }
    // 移除文本内容中的HTML (p)标签
    // delHtmlTag(str) {
    //   return str.replace(/<[^>]+>/g, '')
    // }
  }
}
</script>
<style lang="scss">
.edit_container{
  height: 100%;
  .rich-text{
    height: 400px;
  }
  // 输入区域的高度
  .ql-container{
    height: 300px;
  }
}
</style>
