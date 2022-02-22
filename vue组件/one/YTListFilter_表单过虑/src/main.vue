<!--
 * @Description:
 * @Author: yangjiecan
 * @Date: 2021-01-14 20:30:17
 * @LastEditTime : 2021-12-17 15:09:06
 * @LastEditors  : yemaozi
-->
<template>
  <div>
    <el-card class="search-container">
      <el-form
        class="search-form demo-form-inline"
        ref="ruleForm"
        :class="[showAll ? 'search-form2' : 'search-form1']"
        :label-width="`${labelWidth}px`"
        :model="formInline"
        size="mini"
        :inline="true"
      >
        <slot name="header"></slot>
        <span v-for="(parent, dex) in showList" :key="dex">
          <template v-if="parent.type === 'cascader'">
            <el-form-item
              v-for="(item, index) in parent.options"
              :key="index"
              :label="item.label"
              :prop="item.propName"
              :rules="item.rules || []"
            >
              <el-cascader
                :options="item.optionData"
                :show-all-levels="false"
                v-model="$data[`formInline`][item.propName]"
                :props="item.defaultProps"
                @change="emitEvent(item.eventName, $event)"
              >
              </el-cascader>
            </el-form-item>
          </template>
          <template v-if="parent.type === 'input'">
            <el-form-item
              v-for="(item, index) in parent.options"
              :key="index"
              :label="item.label"
              :prop="item.propName"
              :rules="item.rules || []"
            >
              <el-input
                v-model="$data[`formInline`][item.propName]"
                :placeholder="item.placeholder || '请输入'"
                :clearable="item.clearable || true"
              >
                <i
                  v-if="item.suffix"
                  slot="suffix"
                  class="el-input__icon"
                  :class="item.suffix"
                ></i>
                <i
                  v-if="item.prefix"
                  slot="prefix"
                  class="el-input__icon"
                  :class="item.prefix"
                ></i>
              </el-input>
            </el-form-item>
          </template>
          <template v-if="parent.type === 'select'">
            <el-form-item
              v-for="(item, index) in parent.options"
              :key="index"
              :label="item.label"
              :prop="item.propName"
              :rules="item.rules || []"
            >
              <!--  -->
              <el-select
                v-model="$data[`formInline`][item.propName]"
                :placeholder="item.placeholder || '请选择'"
                style="100%"
                :multiple="item.multiple || false"
                :collapse-tags="item.collapseTags || false"
                @change="emitEvent(item.eventName, $event)"
              >
                <el-option
                  v-for="(text, idx) in item.optionData"
                  :label="setLabel(text, item)"
                  :value="setValue(text, item)"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-if="parent.type === 'datetime'">
            <el-form-item
              v-for="(item, index) in parent.options"
              :key="index"
              :label="item.label"
              :prop="item.propName"
              :rules="item.rules || []"
            >
              <el-date-picker
                :type="item.type"
                :range-separator="item.rangeSeparator || '至'"
                v-model="$data[`formInline`][item.propName]"
                :placeholder="item.placeholder || '选择日期'"
                :start-placeholder="item.startPaceholder || '开始日期'"
                :end-placeholder="item.endPaceholder || '结束日期'"
                style="100%"
              ></el-date-picker>
            </el-form-item>
          </template>
        </span>
      </el-form>
      <div class="search-button">
        <el-button class="inline-block" plain @click="resetForm('ruleForm')">
          重置
        </el-button>
        <el-button
          class="inline-block"
          type="primary"
          @click="submitForm('ruleForm')"
        >
          查询
        </el-button>
        <div
          @click="isShowAll"
          class="inline-block show-more"
          v-if="defaultIsShow"
        >
          {{ word }}
          <i :class="!showAll ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import EleResize from '@/utils/documentResize'
var _ = require('lodash')
export default {
  name: 'YTListFilter',
  props: {
    formData: {
      type: Array,
      default: () => {
        return []
      }
    },
    showMore: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      formInline: {}, // 表单数据
      defaultObj: {}, //作为重置表单的时候使用
      showAll: false,
      resizeNum: 0
    }
  },
  computed: {
    showList: function () {
      return this.formData
    },
    word: function () {
      if (this.showAll == false) {
        //对文字进行处理
        return '展开'
      } else {
        return '收起'
      }
    },
    defaultIsShow() {
      if (!this.showMore) {
        return false
      }
      let offsetWidth = null
      let w = 0
      this.formData.forEach(parent => {
        parent.options.forEach(item => {
          const labelw = item.label ? this.labelWidth : 0
          w += 192 + labelw
        })
      })
      if (this.resizeNum) {
        offsetWidth =
          document.querySelector('.search-form') &&
          (document.querySelector('.search-form').offsetWidth || 0)
      }
      if (w > offsetWidth) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.initDefaultValue()
  },
  components: {},
  methods: {
    // 初始化数据
    initDefaultValue() {
      const obj = {}
      this.formData.forEach(parent => {
        parent.options.forEach(item => {
          if (item.defualtValue !== null && item.defualtValue !== undefined) {
            obj[item.propName] = item.defualtValue
          }
        })
      })
      this.defaultObj = obj
      this.formInline = { ...obj }
    },
    /**
     * @Author      : yemaozi
     * @Date        : 2021-12-16 10:46:41
     * @Desc        : 处理下拉框的默认key
     * @param        {*}
     * @return       {*}
     */
    setLabel(text, item) {
      if (item.defaultProps && item.defaultProps.label) {
        return text[item.defaultProps.label]
      } else {
        return text.label
      }
    },
    setValue(text, item) {
      if (item.defaultProps && item.defaultProps.value) {
        return text[item.defaultProps.value]
      } else {
        return text.id
      }
    },
    // 提交查询 防抖
    submitForm: _.debounce(function () {
      let data = this.$refs['ruleForm'].model
      let startTime = ''
      let endTime = ''
      if (data.date) {
        if (data.date[0]) {
          startTime = this.$moment(data.date[0]).format('YYYY-MM-DD')
        } else {
          startTime = this.$moment(data.date).format('YYYY-MM-DD')
        }
        if (data.date[1]) {
          endTime = this.$moment(data.date[1]).format('YYYY-MM-DD')
        }
      }
      data = {
        startTime,
        endTime,
        ...data
      }
      delete data.date
      for (const key in data) {
        // 去除对象内多余的空值key
        if (data[key] === '') {
          delete data[key]
        }
      }
      this.$emit('submit', data)
    }, 300),
    // 重置数据
    resetForm: _.debounce(function (ruleForm) {
      this.$emit('resert')
      this.formInline = { ...this.defaultObj }
      this.$refs[ruleForm].resetFields()
    }, 300),
    /**
     * @function 往外抛出事件
     */
    emitEvent(button, e) {
      if (button) {
        this.$emit(button, e)
      }
    },
    isShowAll() {
      this.showAll = !this.showAll
      this.resizeNum++
    },
    // 触发表格重新计算高度
    triggerResize() {
      this.resizeNum++
    },
    /**
     * @function 监听页面缩放，改变表格大小
     */
    onResize: _.debounce(function () {
      const element = document.querySelector('.search-bar')
      if (element) {
        EleResize.on(element, () => {
          this.resizeNum++
          this.height = element.clientHeight
        })
      }
    }, 300),
    /**
     * @function 销毁监听页面缩放的事件
     */
    offResize: _.debounce(function () {
      const element = document.querySelector('.search-bar')
      if (element) {
        EleResize.off(element, () => {
          // console.log("卸载resize监听");
        })
      }
    }, 300)
  },
  mounted() {
    if (!this.showMore) {
      this.showAll = true
    }
    // debugger
    this.onResize()
    this.resizeNum++
    window.addEventListener('resize', this.triggerResize)
  },
  activated() {
    this.onResize()
    window.addEventListener('resize', this.triggerResize)
    if (!this.showMore) {
      this.showAll = true
    }
  },
  beforeDestory() {
    window.removeEventListener('resize', this.triggerResize)
  },
  destroyed() {
    this.offResize()
  },
  deactivated() {
    window.removeEventListener('resize', this.triggerResize)
    this.offResize()
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-card__body {
  padding: 10px 20px !important;
}
.demo-form-inline {
  .el-form-item {
    margin-bottom: 0;
    padding: 10px 0;
    flex-shrink: 0;
    user-select: none;
  }
}
// /deep/ .searchBar {
//   margin-bottom: 16px;
//   background-color: #fff;
//   padding: 24px;
//   margin: 0 -16px 16px;
//   width: calc(100% - 32px);
// }
$searchW: 300px;
.search-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  /deep/ .el-card__body {
    width: 100%;
  }
  .search-form {
    width: calc(100% - 300px);
    overflow: hidden;
    transition: height 0.2s linear;
    display: inline-block;
    vertical-align: middle;
  }
  .search-form1 {
    height: 50px;
  }
  .search-form2 {
    height: auto !important;
  }
  .search-button {
    margin-top: 10px;
    width: $searchW;
    text-align: right;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: top;
    user-select: none;
    .inline-block {
      display: inline-block;
      vertical-align: middle;
    }
    .show-more {
      margin-left: 15px;
      color: #1890ff;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
    }
  }
  /deep/.el-date-editor .el-range-separator {
    padding: 0 !important;
  }
}
</style>
