<!--
 * @Description:
 * @Date: 2023-01-29 21:18:49
 * @LastEditors: Hongzf
 * @LastEditTime: 2023-03-29 14:36:01
    TODO: prop和值的绑定形式有没有更好的方式？
-->
<template>
  <div>
    <!-- 文本框：input type: text | textarea | password-->
    <el-input
      v-if="['input', 'textarea', 'password'].includes(item.type)"
      v-model="value[tableProp][index][item.prop]"
      :type="item.type"
      :rows="item.type === 'textarea' ? item.rows : ''"
      :placeholder="item.placeholder"
      :class="item.class"
      :autosize="item.autosize"
      :disabled="item.disabled"
      :resize="item.resize"
      :maxlength="item.maxlength"
      :show-word-limit="item.showWordLimit"
      :prefix-icon="item.type === 'text' ? item.prefix - icon : ''"
      :suffix-icon="item.type === 'text' ? item.suffix - icon : ''"
      :clearable="item.clearable || false"
      :style="{ width: item.width || '100%' }"
      @change="handleInputChange($event, item.prop)"
    />
    <!-- 单选框radio -->
    <el-radio-group
      v-if="item.type === 'radio'"
      v-model="value[tableProp][index][item.prop]"
      @change="
        radioVal => {
          item.changeRadio ? item.changeRadio(radioVal, item, index) : '';
        }
      "
    >
      <el-radio
        v-for="(radio, radioIndex) in item.radioArr"
        :key="radioIndex"
        :label="radio[item.radioValue || 'label']"
        :disabled="radio.disabled"
      >
        {{ radio[item.radioLabel || "label"] }}
      </el-radio>
    </el-radio-group>
    <!-- 复选框 checkbox -->
    <el-checkbox-group
      v-if="item.type === 'checkbox'"
      v-model="value[tableProp][index][item.prop]"
      @change="
        checkVal => {
          item.changeCheck ? item.changeCheck(checkVal, item, index) : '';
        }
      "
    >
      <el-checkbox
        v-for="(checkbox, checkboxIndex) in item.checkboxArr"
        :key="checkboxIndex"
        :label="checkbox[item.checkLabel || 'label']"
        :disabled="checkbox.disabled"
      >
        {{ checkbox[item.checkLabel || "label"] }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 下拉框 select -->
    <el-select
      v-if="item.type === 'select'"
      v-model="value[tableProp][index][item.prop]"
      v-loading="item.selectLoading"
      :disabled="item.disabled"
      :clearable="item.clearable"
      :multiple="item.multiple"
      :placeholder="item.placeholder"
      :style="{ width: item.width || '100%' }"
      @change="
        optionVal => {
          item.changeSelect ? item.changeSelect(optionVal, item, index) : '';
        }
      "
    >
      <el-option
        v-for="option in item.options"
        :key="item.optionSingle ? option : option[item.optionKey || 'value']"
        :label="
          item.optionSingle ? option : option[item.optionLabel || 'label']
        "
        :value="
          item.optionSingle ? option : option[item.optionValue || 'value']
        "
        :disabled="option.disabled"
      />
    </el-select>
    <!-- cascader -->
    <el-cascader
      v-if="item.type === 'cascader'"
      v-model="value[tableProp][index][item.prop]"
      :options="item.options"
      :props="item.props"
      :clearable="item.clearable || false"
      :style="{ width: item.width || '100%' }"
      @change="
        value => {
          item.changeCascader ? item.changeCascader(value, item, index) : '';
        }
      "
    />
    {{ item.prependText }}
    <!-- number -->
    <el-input-number
      v-if="item.type === 'number'"
      v-model="value[tableProp][index][item.prop]"
      :min="item.min"
      :max="item.max"
      :size="item.size"
      :controls-position="item.controlsPosition"
      :controls="item.controls"
      :precision="item.precision"
      :class="{ 'text-align-left': item.textAlignLeft }"
      :style="{ width: item.width || '100%' }"
      @change="
        (currentValue, oldValue) => {
          item.changeNumber
            ? item.changeNumber(currentValue, oldValue, item, index)
            : '';
        }
      "
    />
    <!-- @input.native="(keyValue)=>{
            handleNumberInput(keyValue,item.prop)}" -->
    <!-- @keyup.native="(keyValue)=>{
            handleNumberKeyup(keyValue,item.prop)}"> -->
    {{ item.suffixText }}
    <!-- 时间选择timePicker -->
    <el-time-select
      v-if="item.type === 'timePicker'"
      v-model="value[tableProp][index][item.prop]"
      :picker-options="item.pickerOptions"
      :placeholder="item.placeholder || '选择时间'"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :is-range="item.isRange"
      :start-placeholder="item.startPlaceholder"
      :end-placeholder="item.endPlaceholder"
      :prefix-icon="item.prefixIcon || 'el-icon-time'"
      :clear-icon="item.clearIcon || 'el-icon-circle-close'"
      :range-separator="item.rangeSeparator || '至'"
      :style="{ width: item.width || '100%' }"
      @change="
        time => {
          item.changeTime ? item.changeTime(time, item, index) : '';
        }
      "
    />
    <!-- 日期选择datePicker --- subType:date daterange-->
    <el-date-picker
      v-if="item.type === 'datePicker'"
      v-model="value[tableProp][index][item.prop]"
      :type="item.subType || 'date'"
      :disabled="item.disabled"
      :readonly="item.readonly"
      :unlink-panels="item.unlinkPanels || false"
      :placeholder="item.placeholder || '选择日期'"
      :range-separator="item.rangeSeparator || '至'"
      :start-placeholder="item.startPlaceholder || '开始日期'"
      :end-placeholder="item.endPlaceholder || '结束日期'"
      :picker-options="item.pickerOptions"
      :format="item.format"
      :align="item.align"
      :editable="item.editable"
      :clearable="item.clearable"
      :value-format="item.valueFormat"
      :style="{ width: item.width || '100%' }"
      @change="
        date => {
          item.changeDate ? item.changeDate(date, item, index) : '';
        }
      "
    />
    <!-- 日期时间选择dateTimePicker -->
    <el-date-picker
      v-if="item.type === 'dateTimePicker'"
      v-model="value[tableProp][index][item.prop]"
      :type="item.subType || 'datetime'"
      :disabled="item.disabled"
      :readonly="item.readonly"
      :unlink-panels="item.unlinkPanels || false"
      :placeholder="item.placeholder"
      :range-separator="item.rangeSeparator || '至'"
      :start-placeholder="item.startPlaceholder || '开始日期'"
      :end-placeholder="item.endPlaceholder || '结束日期'"
      :picker-options="item.pickerOptions"
      :format="item.format"
      :align="item.align"
      :editable="item.editable"
      :clearable="item.clearable"
      :value-format="item.valueFormat"
      :style="{ width: item.width || '100%' }"
      @change="
        dateTime => {
          item.changeDateTime ? item.changeDateTime(dateTime, item, index) : '';
        }
      "
    />
    <!-- 文本 -->
    <!-- <span v-else>
      <div :title="item.formatter?item.formatter(row, item,index):modelVal">
        {{ item.formatter?item.formatter(row, item,index):modelVal }}
      </div>
    </span> -->
  </div>
</template>
<script>
export default {
  inject: ['tableProp'],
  name: 'FormItem',
  // props: ['value', 'item', 'index'],
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          tableData: []
        }
      }
    },
    // 值
    // value: {
    //   // TODO:无法接收undefined
    //   type: [String, Number, Array, Object],
    //   required: true
    //   // default: undefined
    //   // validator(propVal) { // 函数的返回值为Boolean类型表示验证结果
    //   //   console.log('【 propVal 】-231', propVal)
    //   //   if (propVal === undefined) {
    //   //     return true
    //   //   } else {
    //   //     return true
    //   //   }
    //   // }
    // },
    // 表单项配置
    item: {
      type: Object,
      required: true
    },
    // 当前行顺序
    index: {
      type: Number,
      required: false,
      default: 0
    },
    // 当前行数据
    row: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      modelVal: undefined
    };
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        console.log('【 value 】-259', newVal, this.item.prop)
        this.modelVal = newVal;
      }
    },
    modelVal: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        this.$emit('input', newVal);
      }
    }
  },
  mounted() {
    // this.modelVal = this.value
    // console.log('【  this.modelVal 】-250', this.modelVal)
    // this.initData()
  },
  methods: {
    // initData() {
    //   const initVal = this.value;
    //   console.log('【 initVal 】-278', initVal);
    //   // 数字类型
    //   if (typeof initVal === 'number') {
    //     this.modelVal = undefined;
    //   }
    //   // 字符串类型
    //   if (typeof initVal === 'string') {
    //     this.modelVal = '';
    //   }
    //   // 数组类型
    //   if (Array.isArray(initVal)) {
    //     this.modelVal = [];
    //   }
    //   //
    // },
    handleInputChange(value, prop) {
      // this.modelVal = this.ToCDB(value.trim());
      this.modelVal = value.trim();
    },
    handleNumberInput(value, prop) {
      // this.modelVal = value.replace(/[^\d]/g, '') // 不可输入数字和小数点以外的
    },
    // handleNumberKeyup(value, prop) {
    //   console.log(value);
    //   debugger
    //   this.modelVal = this.modelVal.replace(/[^0-9.]/g, '') // 不可输入数字和小数点以外的
    // },
    ToCDB(str) {
      // 全角转半角
      let tmp = void 0;
      if (str) {
        tmp = '';
        for (let i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) === 12288) {
            tmp += String.fromCharCode(32);
          } else if (str.charCodeAt(i) === 160) {
            tmp += String.fromCharCode(32); // 处理下Unicode为160的特殊空格
          } else if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
          } else {
            tmp += str[i];
          }
        }
      } else {
        tmp = str;
      }
      return tmp;
    },
    ToDBC(txtStr) {
      // 半角转全角
      if (txtStr == null || txtStr === '' || txtStr === ' ') {
        return '';
      }
      let tmp = '';
      for (let i = 0; i < txtStr.length; i++) {
        if (txtStr.charCodeAt(i) === 32) {
          tmp += String.fromCharCode(12288);
        } else if (txtStr.charCodeAt(i) === 160) {
          // 处理下Unicode为160的特殊空格
          tmp += String.fromCharCode(12288);
        } else if (txtStr.charCodeAt(i) < 127) {
          tmp += String.fromCharCode(txtStr.charCodeAt(i) + 65248);
        } else {
          tmp += String.fromCharCode(txtStr.charCodeAt(i));
        }
      }
      return tmp;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ textarea {
  font-family: unset !important;
}
.el-input-number {
  &.text-align-left {
    .el-input__inner {
      text-align: left;
    }
  }
}
</style>
