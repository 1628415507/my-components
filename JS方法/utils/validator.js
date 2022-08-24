// 校验是否邮箱
export const isEmailValid = val => {
  let reg = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/
  let ret = reg.test(val)
  return ret
}

//  校验网址是否正确
export const isHttpAddrValid = addr => {
  /* eslint-disable-next-line  */
  let reg = /(http|https):\/\/\S*/
  let ret = reg.test(addr)
  return ret
}

//  验证是否是整数
export const isValidInteger = val => {
  var r = /^\+?[1-9][0-9]*$/ //  正整数
  let flag = r.test(val)
  return flag
}

// 验证手机号 10-12位之间
export const isPhoneValid = val => {
  //   const r =
  //     /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/g
  const r = /^1[3456789]\d{9}$/g
  return r.test(val)
}

// 密码格式
export const isPassword = pwd => {
  //   var r = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9~!@&%#$^&()-_.*-+]{6,12}$/
  var r = /^[A-Za-z0-9~!@&%#$^&()-_.*-+]{6,12}$/
  //   var r = /^(?=.*\d+.*)(?=.*[a-z]+.*)(?=.*_.*)[\da-z_]{6,12}$/ // 必须包含 数字、字母、_
  //   var r = /^[0-9a-zA-Z_]{6,12}$/
  // 由数字、26个英文字母或者下划线组成的字符串
  return r.test(pwd)
}

// 校验字母数字
export const isNumberLetter = word => {
  var r = /^[0-9a-zA-Z]*$/g // 字母，数字或字母数字组合正则表达式
  return r.test(word)
}

export const isLimitNumLetterWord = word => {
  var r = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
  return r.test(word)
}
