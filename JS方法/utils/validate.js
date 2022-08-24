/*
 * @Author: gaopengli
 * @Date: 2022-04-28 17:32:51
 * @LastEditTime: 2022-04-30 18:43:01
 * @LastModifiedBy: gaopengli
 * @LastEditors: gaopengli
 * @Description: 描述
 * @FilePath: \cli\src\utils\validate.js
 */
import moment from 'moment'
// 正整数校验
const Integer = (rule, value, callback) => {
  if (/(^[1-9]\d*$)/.test(value)) {
    callback()
  } else {
    callback(new Error('只能输入正整数'))
  }
}
const Integer2 = (rule, value, callback) => {
  if (value) {
    if (/(^[1-9]\d*$)/.test(value)) {
      callback()
    } else {
      callback(new Error('只能输入正整数'))
    }
  } else {
    callback(new Error('请输入'))
  }
}

// 校验当前日期之前
const currentDate = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择入队日期'))
  } else {
    if (value > moment(new Date()).format('YYYY-MM-DD')) {
      callback(new Error('入队日期不能大于当天时间'))
    }
  }
}

//校验社会信用代码
const capital = (rule, value, callback) => {
  if (!/^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/.test(value)) {
    callback(new Error('请输入正确的统一社会信用代码'))
  } else {
    callback()
  }
}
const Number = (rule, value, callback) => {
  if (!value && value !== 0) {
    callback(new Error('参赛人数不能为空且为数字格式'))
  } else {
    if (value < 10000000) {
      callback()
    } else {
      callback(new Error('参赛人数为数字格式且最多八位'))
    }
  }
}
const voteQty = (rule, value, callback) => {
  if (value < 10000000) {
    callback()
  } else {
    callback(new Error('投票为数字格式且最多八位'))
  }

}
export default {
  Integer: Integer,
  currentDate: currentDate,
  Integer2,
  // dotted: dotted,
  capital,
  Number,
  voteQty,
}
