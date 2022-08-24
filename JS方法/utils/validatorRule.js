/**
 * 组合完成的校验规则
 */
import {
  validatorEmail,
  validatorStringRange,
  validatorHttpAddr,
  validatorPhone,
  validatorPassword
  //   validatorNumLetterWord
} from '@/utils/validatorFrom.js'

export const validatorPhoneRule = (required = true, validator) => [
  {
    required: required,
    message: '请输入手机号码',
    trigger: 'blur'
  },
  {
    required: required,
    validator: validatorPhone,
    trigger: 'blur'
  },
  {
    required: required,
    validator,
    trigger: 'blur'
  }
]
export const validatorHttpAddrRule = (required = true, length = 100) => [
  {
    required: required,
    message: '请输入正确的URL地址',
    trigger: 'blur'
  },
  {
    required: required,
    validator: validatorHttpAddr,
    trigger: 'blur'
  },
  {
    required: required,
    validator: validatorStringRange,
    trigger: 'blur',
    min: 0,
    max: length,
    message: `请输入少于${length}个字`
  }
]

// 校验邮箱
export const validatorEmailRule = (required = true, validator) => [
  {
    required: required,
    message: window.vm.$t('common.isNoEmpty'),
    trigger: 'blur'
  },
  {
    required: required,
    validator: validatorEmail,
    trigger: 'blur'
  },
  {
    required: required,
    validator,
    trigger: 'blur'
  }
]

// 校验输入不为空，并且限制长度
export const validatorInputEmptyRule = (
  required = true,
  message = '请输入',
  length = 100,
  validator
) => [
  {
    required: required,
    message: message,
    trigger: 'blur'
  },
  {
    required: required,
    min: 2,
    max: length,
    validator: validatorStringRange,
    trigger: 'blur'
    // message: `请输入少于${length}个字符`
  },
  {
    required: required,
    validator,
    trigger: 'blur'
  }
]

// 校验输入不为空，并且限制长度
export const validatorInputEmptyRules = (
  required = true,
  message = '请输入',
  length = 100,
  validator
) => [
  {
    required: required,
    message: message,
    trigger: 'blur'
  },
  {
    required: required,
    min: 0,
    max: length,

    trigger: 'blur',
    message: `请输入少于${length}个字`
  },
  {
    required: required,
    validator,
    trigger: 'blur'
  }
]
export const validatorPasswordRule = (
  required = true,
  length = 12,
  validator
) => [
  {
    required: required,
    message: '请输入密码',
    trigger: 'blur'
  },
  {
    required,
    min: 6,
    max: length,
    message: '长度必须在6到12位密码之间',
    trigger: 'blur'
  },
  {
    required,
    validator: validatorPassword,
    trigger: 'blur'
  },
  {
    required,
    validator,
    trigger: 'blur'
  }
]
