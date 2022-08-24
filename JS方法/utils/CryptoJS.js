/*
 * @Author: your name
 * @Date: 2020-07-04 12:33:49
 * @LastEditTime: 2020-09-03 11:14:15
 * @LastEditors: chenjianxin
 * @Description: 加解密
 * @FilePath: \ui-standard\src\utils\CryptoJS.js
 */
import CryptoJS from 'crypto-js'
import md5 from 'js-md5'

/**
 * @function 对登录的时候密码进行加密
 * @param {String} word 要被加密的文本
 * @param {String} keyStr 密钥
 * @param {String} ivStr  偏移量
 * @returns {String} 返回加密后的文本
 */
export const encrypt = (
  word,
  keyStr = '1234567890123456',
  ivStr = '1234567891012345'
) => {
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const iv = CryptoJS.enc.Utf8.parse(ivStr)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
/**
 * @function 对登录的时候密码进行解密
 * @param {String} word 要被解密的文本
 * @param {String} keyStr 密钥
 * @param {String} ivStr  偏移量
 * @returns {String} 返回解密后的文本
 */
export const decrypt = (
  word,
  keyStr = '1234567890123456',
  ivStr = '1234567891012345'
) => {
  // 解密
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const iv = CryptoJS.enc.Utf8.parse(ivStr)
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedStr = CryptoJS.enc.Utf8.stringify(decrypt).toString()
  return decryptedStr
}
/**
 * @function 加密密码
 * @param {String} password 要加密的密码
 * @return 返回加密后的密码
 */
export const passwordCrypt = (password, timestamp) => {
  const salt = 'fd#O@7Ej0.U4P2^i'
  const newPass = md5(timestamp + salt)
  const aes = newPass.substring(0, 16)
  const iv = newPass.substring(16)
  return encrypt(password, aes, iv)
}
