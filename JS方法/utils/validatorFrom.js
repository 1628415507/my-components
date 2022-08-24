/**
 *  表单验证相关的校验工具
 */

import {
  isEmailValid,
  isHttpAddrValid,
  isPhoneValid,
  isPassword,
  isNumberLetter,
  isLimitNumLetterWord
} from '@/utils/validator.js'

export let validatorPhone = (rule, value, callback) => {
  let valid = isPhoneValid(+value)
  if (!valid) {
    callback(new Error('请输入正确手机号码'))
  } else {
    callback()
  }
}

export let validatorHttpAddr = (rule, value, callback) => {
  if (!rule.required && value === undefined) {
    callback()
    return
  }
  let valid = isHttpAddrValid(value)
  if (!valid) {
    callback(new Error('请输入正确的URL地址'))
  } else {
    callback()
  }
}
// 校验非空
export let validatorEmpty = (rule, value, callback) => {
  if (value === undefined || value === '' || value === null) {
    callback(new Error('不能为空'))
  } else {
    callback()
  }
}

// 校验邮箱
export let validatorEmail = (rule, value, callback) => {
  let valid = isEmailValid(value)
  if (!valid) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}

// 校验字符串长度范围
export let validatorStringRange = (rule, value, callback) => {
  let { min, max } = rule
  if (value === undefined) {
    value = ''
  }
  let len = value.length
  if (len < min || len > max) {
    // callback(new Error(`字符串长度必须在 ${min} 到 ${max}之间`))
    callback()
  } else {
    callback()
  }
}

// 校验密码
export let validatorPassword = (rule, value, callback) => {
  let valid = isPassword(value)
  if (!valid) {
    callback(new Error('请输入6-12位的密码'))
  } else {
    callback()
  }
}

// 校验数字或字母 或组合
export let validatorNumberLetter = (rule, value, callback) => {
  let valid = isNumberLetter(value)
  if (!valid) {
    callback(new Error('请输入字母或数字或字母数字组合'))
  } else {
    callback()
  }
}

export let validatorNumLetterWord = (rule, value, callback) => {
  let valid = isLimitNumLetterWord(value)
  if (!valid) {
    callback(new Error('请输入中英文数字'))
  } else {
    callback()
  }
}
