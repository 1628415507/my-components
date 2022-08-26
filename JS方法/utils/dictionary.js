/*
 * @Author: Hongzf
 * @Date: 2022-08-01 17:25:40
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-08-04 11:37:17
 * @Description: 字典
 */
import * as dicts from '@/store/constant'
// 获取字典的下拉列表
const getDictOptions = (dicName) => {
  const arr = []
  // console.log('【 dicts 】-13', dicts)
  const dicObj = dicts[dicName]
  for (const key in dicts[dicName]) {
    arr.push({ label: dicObj[key], value: key })
  }
  return arr
}
// 根据code获取中文
const getDictNameByCode = (dicName, code) => {
  const dicObj = dicts[dicName]
  return dicObj[code] || ''
}
export default {
  getDictOptions,
  getDictNameByCode
}
