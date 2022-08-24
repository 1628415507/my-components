/*
 * @Author: Hongzhifeng
 * @Date: 2022-04-30 20:39:02
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-04-30 20:39:05
 * @Description: 
 */


/**
 * 把文件流保存成文件
 */
function saveBlob(blob, fileName) {
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
    // this.exportLoading = 'close'
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}

export {
  saveBlob
}