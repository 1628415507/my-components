<template>
  <el-form
    :ref="formConfig.ref"
    :inline="formConfig.inline"
    :label-position="formConfig.labelPosition || 'right'"
    :class="formConfig.class"
    :label-width="formConfig.labelWidth || '80px'"
    :model="value"
    :rules="rules"
    :style="formConfig.style"
    :disabled="dialogStatus === 'examine'"
  >
    <!-- rowWrap:flex布局+换行 ，解决空格问题-->
    <el-row :gutter="formConfig.gutter" :class="{'flex-wrap':formConfig.flexWrap}">
      <template v-for="(item, index) in formConfig.formItemList">
        <el-col
          v-if="item.show===false?item.show:true"
          :key="item.prop"
          :span="item.col || formConfig.col"
        >
          <el-form-item
            :label="item.label"
            :prop="item.prop"
            :label-width="item.labelWidth || (formConfig.labelWidth || '80px')"
          >
            <!-- 文本框：input type: text | textarea | password-->
            <el-input
              v-if="['input','textarea','password'].includes(item.type)"
              v-model="value[item.prop]"
              :type="item.type"
              :rows="item.type === 'textarea' ? item.rows : ''"
              :show-password="item.type === 'password' && item.showPassword"
              :placeholder="item.placeholder"
              :class="item.class"
              :autosize="item.autosize"
              :disabled="item.disabled"
              :prefix-icon="item.type === 'text' ? item.prefix - icon : ''"
              :suffix-icon="item.type === 'text' ? item.suffix - icon : ''"
              :clearable="item.clearable || false"
              :style="{ width: item.width || '100%' }"
            />
            <!-- 单选框radio -->
            <el-radio-group
              v-if="item.type === 'radio'"
              v-model="value[item.prop]"
              @change="
                (radioVal) => {
                  item.changeRadio ? item.changeRadio(radioVal, item, index) : '';
                }
              "
            >
              <el-radio
                v-for="(radio, index) in item.radioArr"
                :key="index"
                :label="radio[item.radioValue||'label']"
                :disabled="radio.disabled"
              >
                {{ radio[item.radioLabel||'label'] }}
              </el-radio>
            </el-radio-group>
            <!-- 复选框 checkbox -->
            <el-checkbox-group
              v-if="item.type === 'checkbox'"
              v-model="value[item.prop]"
              @change="
                (checkVal) => {
                  item.changeCheck ? item.changeCheck(checkVal, item, index) : '';
                }
              "
            >
              <el-checkbox
                v-for="(checkbox, index) in item.checkboxArr"
                :key="index"
                :label="checkbox[item.checkLabel || 'label']"
                :disabled="checkbox.disabled"
              >
                {{ checkbox[item.checkLabel || "label"] }}
              </el-checkbox>
            </el-checkbox-group>
            <!-- 下拉框 select -->
            <el-select
              v-if="item.type === 'select'"
              v-model="value[item.prop]"
              :disabled="item.disabled"
              :clearable="item.clearable"
              :multiple="item.multiple"
              :placeholder="item.placeholder"
              :style="{ width: item.width||'100%' }"
              @change="
                (optionVal) => {
                  item.changeSelect
                    ? item.changeSelect(optionVal, item, index)
                    : '';
                }
              "
            >
              <el-option
                v-for="option in item.options"
                :key="
                  item.optionSingle
                    ? option
                    : option[item.optionKey || 'value']
                "
                :label="
                  item.optionSingle
                    ? option
                    : option[item.optionLabel || 'label']
                "
                :value="
                  item.optionSingle
                    ? option
                    : option[ item.optionValue || 'value']
                "
                :disabled="option.disabled"
              />
            </el-select>
            <!-- cascader -->
            <el-cascader
              v-if="item.type === 'cascader'"
              v-model="value[item.prop]"
              :options="item.options"
              :props="item.props"
              :clearable="item.clearable ? true : false"
              :style="{ width: item.width ? item.width : '100%' }"
              @change="
                (value) => {
                  item.changeCascader
                    ? item.changeCascader(value, item, index)
                    : '';
                }
              "
            />
            {{ item.prependText }}
            <!-- number -->
            <el-input-number
              v-if="item.type === 'number'"
              v-model="value[item.prop]"
              :min="item.min"
              :max="item.max"
              :size="item.size"
              :style="{ width: item.width ? item.width : '100%' }"
              @change="
                (currentValue, oldValue) => {
                  item.changeNumber
                    ? item.changeNumber(currentValue, oldValue, item, index)
                    : '';
                }
              "
            />
            {{ item.suffixText }}
            <!-- 时间选择 -->
            <el-time-select
              v-if="item.type === 'timePicker'"
              v-model="value[item.prop]"
              :picker-options="item.pickerOptions"
              :placeholder="item.placeholder || '选择时间'"
              :clearable="item.clearable"
              :disabled="item.disabled"
              :is-range="item.isRange"
              :start-placeholder="item.startPlaceholder"
              :end-placeholder="item.endPlaceholder"
              :prefix-icon="item.prefixIcon || 'el-icon-time'"
              :clear-icon="item.clearIcon || 'el-icon-circle-close'"
              :range-separator="item.rangeSeparator ||'至'"
              :style="{ width: item.width || '100%' }"
              @change="
                (time) => {
                  item.changeTime ? item.changeTime(time, item, index) : '';
                }
              "
            />
            <!-- 日期选择datePicker --- subType:date daterange-->
            <el-date-picker
              v-if="item.type === 'datePicker'"
              v-model="value[item.prop]"
              :type="item.subType || 'date'"
              :disabled="item.disabled"
              :readonly="item.readonly"
              :unlink-panels="item.unlinkPanels || false"
              :placeholder="item.placeholder || '选择日期'"
              :range-separator="item.rangeSeparator || '至'"
              :start-placeholder="item.startPlaceholder ||'开始日期'"
              :end-placeholder="item.endPlaceholder || '结束日期'"
              :picker-options="item.pickerOptions"
              :format="item.format"
              :align="item.align"
              :editable="item.editable"
              :clearable="item.clearable"
              :value-format="item.valueFormat"
              :style="{ width: item.width || '100%' }"
              @change="
                (date) => {
                  item.changeDate ? item.changeDate(date, item, index) : '';
                }
              "
            />
            <!-- 日期时间选择 -->
            <el-date-picker
              v-if="item.type === 'dateTimePicker'"
              v-model="value[item.prop]"
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
                (dateTime) => {
                  item.changeDateTime
                    ? item.changeDateTime(dateTime, item, index)
                    : '';
                }
              "
            />
            <!-- 自定义插槽 -->
            <template v-if="item.type === 'customSlot'">
              <slot :name="`${item.prop}`" :item="item">自定义插槽</slot>
            </template>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>
<script>
export default {
  props: {
    // 表单配置
    formConfig: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    // 表单验证规则
    rules: {
      type: Object,
      default: () => ({})
    },
    dialogStatus: {
      type: String,
      default: ''
    }
  },
  computed: {},
  mounted() {
    this.setDefaultValue();
    // this.triggerAssociate();
  },
  methods: {
    // triggerAssociate() {
    //   // if (Array.isArray(this.$refs.associate)) {
    //   //   const arr = this.$refs.associate
    //   //   arr.forEach((item) => {
    //   //     var write=item.value
    //   //     item.value=''
    //   //     item.value=write
    //   //   })
    //   // }
    //   var write = this.value.applyPostId
    //   this.value.applyPostId = ''
    //   this.$nextTick(() => {
    //     this.value.applyPostId = write
    //   })
    // },
    setDefaultValue() {
      const formData = { ...this.value };
      // 设置默认值
      this.formConfig.formItemList.forEach(({ key, value }) => {
        if (formData[key] === undefined || formData[key] === null) {
          formData[key] = value;
        }
      });
      this.$emit('input', formData);
    }
  }
};
</script>
<style lang="scss" scope>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
