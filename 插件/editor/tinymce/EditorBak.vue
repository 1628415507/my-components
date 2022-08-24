<!--
 * @Author: Hong Yiqun
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="editor-container">
    <textarea :id="editorId" class="editor-element"></textarea>
  </div>
</template>

<script>
// 富文本编辑器，基于tinyMCE
import tinymce from "tinymce/tinymce";
import { editUpload } from "@/api/common";
import { get } from "lodash";
// import uploadHttp from '../mixins/uploadHttp/index.js'
import "tinymce/icons/default"; // 引入图标
import "tinymce/themes/silver"; // 引入主题
// 引入插件
// import "tinymce/plugins/paste";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/preview";
// import 'tinymce/skins/ui/oxide/skin.min.css'
// import 'tinymce/skins/ui/oxide/content.min.css'
// import 'tinymce/skins/content/default/content.min.css'

export default {
  props: {
    // model: {
    //   type: String,
    //   required: true,
    // },
    value: {
      type: String,
      default: () => ""
    },
    // 语言包
    language_url: {
      require: false,
      type: String,
      // default: process.env.BASE_URL + "tinymce/zh_CN.js"
      default: "@/assets/tinymce_languages/langs/zh_CN.js"
    },
    // 图片
    skin_url: {
      require: false,
      type: String,
      default: process.env.BASE_URL + "tinymce/skins/ui/oxide/"
    }
  },
  data() {
    let editorId =
      "editor-bak" +
      Math.random()
        .toString()
        .replace(/[^0-9]/g, "");
    return {
      editorId: editorId,
      editor: null
      //   content: "",
    };
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }

      if (!this.editor) {
        return;
      }

      let content = this.editor.getContent();
      if (newValue === content) {
        return;
      }

      if (this.editor) {
        this.editor.setContent(this.value || "");
      }
    }
    // content() {
    //   if (this.editor) {
    //     this.editor.setContent(this.content);
    //   }
    // },
  },
  mounted() {
    this.$nextTick(() => {
      this.initEditor();
    });
  },
  beforeDestroy() {
    console.log("销毁组件前", tinymce);
    tinymce.remove();
  },
  methods: {
    initEditor() {
      tinymce.init({
        selector: `#${this.editorId}`,
        language: "zh_CN",
        language_url: require("@/assets/tinymce_languages/langs/zh_CN.js"),
        branding: false, // 隐藏右下角技术支持
        elementpath: false, // 隐藏底栏的元素路径
        skin_url: this.skin_url,
        content_css: false,
        menubar: false,
        plugins: "image | preview | link",
        default_link_target: "_blank",
        // target_list: [
        //   { title: "None", value: "" },
        //   { title: "Same page", value: "_self" },
        //   { title: "New page", value: "_blank" },
        //   { title: "Parent frame", value: "_parent" },
        // ],
        convert_urls: false,
        // 工具栏
        // 工具栏收缩模式：将第一行放不下的工具栏按钮
        toolbar_mode: "sliding", //取值：floating / sliding / false
        toolbar:
          "bold italic underline strikethrough formatselect fontsizeselect | alignleft aligncenter alignright | image | preview | link",
        /*
           toolbar:
              "bold italic underline strikethrough formatselect fontsizeselect | alignment | image | preview | link",
            // 工具栏分组
            toolbar_groups: {
              //文本位置
              alignment: {
                icon: "align-left",
                tooltip: "alignment",
                items: "alignleft aligncenter alignright alignjustify" //把所有文本放一起
              }
            },
           */
        toolbar_sticky: false, //粘性工具栏（或停靠工具栏），在向下滚动网页直到不再可见编辑器时，将工具栏和菜单停靠在屏幕顶部。
        // images_upload_url: "/demo/upimg.php",
        // images_upload_base_path: "/demo",
        // automatic_uploads: true,
        // 显示隐藏图片尺寸input
        image_dimensions: false,
        // 显示隐藏图片说明input
        image_description: false,
        images_upload_handler: (blobInfo, succFun, failFun) => {
          console.log(blobInfo, "00000");
          this.imgUploadFn(blobInfo, succFun, failFun);
        },
        init_instance_callback: editor => {
          this.editor = editor;
          this.editor.setContent(this.value || "");
          editor.on("change", () => {
            this.$emit("input", editor.getContent(), this.editorId);
          });
        }
      });
    },
    imgUploadFn(blobInfo, success, error) {
      // 可以限制图片大小
      if (blobInfo.blob().size / 1024 / 1024 > 4) {
        error("上传失败，图片大小请控制在 4M 以内");
        return false;
      } else {
        const params = new FormData();
        params.append("files", blobInfo.blob());
        params.append("model", "pc");
        console.log(params, "params");
        this.uploadImage(params, success, error);
      }
    },
    // 上传文件
    uploadImage(blob, success, error) {
      console.log(error, "bl");
      editUpload(blob)
        .then(res => {
          if (res.code === 200) {
            console.log(res, "resres");
            let path = get(res, "data[0].url");
            success(path);
          } else {
            error("上传失败");
          }
        })
        .catch(err => {
          console.error(err);
          error(err);
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initEditor();
    });
  },
  beforeDestroy() {
    // 销毁tinymce
    // this.$emit("on-destroy");
    tinymce.remove(`#${this.editorId}`);
    // console.log("【 tinymce 】-182", tinymce);
  }
};
</script>

<style lang="scss">
.tox-tinymce-aux,
.tox .tox-dialog-wrap {
  z-index: 9999 !important;
}
</style>
<style lang="scss" scoped>
.editor-container {
  width: 100%;
  display: inline-block;

  .editor-element {
    height: 500px;
  }
}
</style>
