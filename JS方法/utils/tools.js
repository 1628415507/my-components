import store from '@/store/index'
// import { getDictByGroup } from '@/api/commonApi'

// 根据当前时间 计算时间
export function dateAdd(interval, number, date) {
  /*
   *---------------  DateAdd(interval,number,date)  -----------------
   *  DateAdd(interval,number,date)
   *  功能:实现VBScript的DateAdd功能.
   *  参数:interval,字符串表达式，表示要添加的时间间隔.
   *  参数:number,数值表达式，表示要添加的时间间隔的个数.
   *  参数:date,时间对象.
   *  返回:新的时间对象.
   *  var  now  =  new  Date();
   *  var  newDate  =  DateAdd( "d ",5,now);
   */
  switch (interval) {
    case 'y': {
      date.setFullYear(date.getFullYear() + number)
      return date
      break
    }
    case 'q': {
      date.setMonth(date.getMonth() + number * 3)
      return date
      break
    }
    case 'm': {
      date.setMonth(date.getMonth() + number)
      //   let d = getMonthBeforeFormatAndDay(number, 'YYYY-MM-DD', date)
      //   console.log(d)
      return date
      break
    }
    case 'w': {
      date.setDate(date.getDate() + number * 7)
      return date
      break
    }
    case 'd': {
      date.setDate(date.getDate() + number)
      return date
      break
    }
    case 'h': {
      date.setHours(date.getHours() + number)
      return date
      break
    }
    // eslint-disable-next-line no-duplicate-case
    case 'm': {
      date.setMinutes(date.getMinutes() + number)
      return date
      break
    }
    case 's': {
      date.setSeconds(date.getSeconds() + number)
      return date
      break
    }
    default: {
      date.setDate(date.getDate() + number)
      return date
      break
    }
  }
}
// 根据出生日期计算年龄
export function toGetAge(strBirthday) {
  if (!strBirthday) {
    return
  }
  let returnAge
  let strBirthdayArr = strBirthday.split('-')
  let birthYear = strBirthdayArr[0]
  let birthMonth = strBirthdayArr[1]
  let birthDay = strBirthdayArr[2]
  let d = new Date()
  let nowYear = d.getFullYear()
  let nowMonth = d.getMonth() + 1
  let nowDay = d.getDate()
  if (nowYear === birthYear) {
    returnAge = 0 // 同年则为0岁
  } else {
    let ageDiff = nowYear - birthYear
    // 年之差
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) {
        let dayDiff = nowDay - birthDay // 日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      } else {
        let monthDiff = nowMonth - birthMonth // 月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1
        } else if (monthDiff === 0) {
          let dayDiff = nowDay - birthDay // 日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        } else {
          returnAge = ageDiff
        }
      }
    } else {
      returnAge = 0 // 返回0 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge // 返回周岁年龄
}

export function downLoad(url, params = {}) {
  url = urlEncode(url, params)
  console.log(url, params)
  var xhr = new XMLHttpRequest()
  xhr.open('get', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    console.log(xhr.getResponseHeader('Content-Disposition'))
    const fileName = xhr
      .getResponseHeader('Content-Disposition')
      .split(';')[1]
      .split('filename=')[1]
    saveAs(xhr.response, decodeURI(fileName))
  }
  // 添加token
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Origin-Client-Code', 'ORGANIZATION')
  xhr.setRequestHeader('Authorization', 'Bearer ' + store.state.AUTH_TOKEN)
  xhr.send(JSON.stringify(params))
}
export function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    var link = document.createElement('a')
    var body = document.querySelector('body')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename //html5

    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)
    link.click()
    body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  }
}
// 拼接网址
export function urlEncode(url, data) {
  if (typeof url === 'undefined' || url === null || url === '') {
    return ''
  }
  if (
    typeof data === 'undefined' ||
    data === null ||
    typeof data !== 'object'
  ) {
    return ''
  }
  url += url.indexOf('?') !== -1 ? '' : '?'
  for (var k in data) {
    if (data[k]) {
      url += (url.indexOf('=') !== -1 ? '&' : '') + k + '=' + encodeURI(data[k])
    }
  }
  return url
}

export function formatParamsDate(date, full = true) {
  if (!date) {
    return
  }
  if (typeof date !== 'object') {
    date = new Date(date)
  }
  let year = date.getFullYear()
  let month =
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  let day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
  let hour = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`
  let minutes =
    date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`
  let seconds =
    date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`
  return full
    ? `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
    : `${year}-${month}-${day}`
}

export function postDownLoad(res, type) {
  let blob = new Blob([res], {
    type: type
  }) // 下载格式
  if ('download' in document.createElement('a')) {
    // 非IE下载
    let elink = document.createElement('a') // 创建一个<a>标签
    elink.style.display = 'none' // 隐藏标签
    elink.href = window.URL.createObjectURL(blob) // 配置href
    //   elink.download = zipName;
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink) // 移除<a>标签
  } else {
    //IE10+
    //   navigator.msSaveBlob(blob, zipName);
    navigator.msSaveBlob(blob, '')
  }
}

// 身份证验证
export function validateIdNum(rule, value, callback) {
  // let iSum = 0
  let aCity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  }
  if (!value) {
    return callback(new Error('请输入身份证'))
  }
  let sBirthday =
    value.substr(6, 4) +
    '-' +
    Number(value.substr(10, 2)) +
    '-' +
    Number(value.substr(12, 2))
  let d = new Date(sBirthday.replace(/-/g, '/'))
  // let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  // for (let i = 0; i < 17; i++) iSum += value.substr(i, 1) * arrInt[i]
  // let residue = arrCh[iSum % 11]

  if (!/^\d{17}(\d|x)$/i.test(value)) {
    callback(new Error('身份证长度或格式错误'))
  }
  if (aCity[parseInt(value.substr(0, 2))] === null) {
    callback(new Error('身份证地区非法'))
  }
  if (
    sBirthday !==
    d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  ) {
    callback(new Error('身份证上出生日期非法'))
  }
  // if (residue !== value.substr(17, 1)) {
  //   console.log(residue, value.substr(17, 1))
  //   callback(new Error('身份证号非法'))
  // } else {
  callback()
  // }
}

// 固话+手机正则校验 非必传
export function validateTelNum(rule, value, callback) {
  if (value === '' || value === undefined || value === null) {
    callback(new Error('手机号码不能为空'))
  }
  if (!value) {
    callback(new Error('请输入正确手机号码'))
  } else {
    if (/^([0-9]{3,4}-)?[0-9]{7,8}$/g.test(value)) {
      callback()
    } else if (
      // /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/
      // /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])d{8}$/
      /^1[3456789]\d{9}$/g.test(value)
    ) {
      callback()
    } else {
      callback(new Error('请输入正确手机号码'))
    }
  }
}
// 获取当前日期周一到周日
export function getWeek(time = '') {
  let now = new Date()
  if (time) {
    now = new Date(time.replace(/-/g, '/'))
  }
  let nowTime = now.getTime()
  let day = now.getDay() || 7 //为周日的时候 day 修改为7  否则当天周天会有问题
  let oneDayTime = 24 * 60 * 60 * 1000
  let mondayTime = nowTime - (day - 1) * oneDayTime //显示周一
  let tuesdayTime = nowTime - (day - 2) * oneDayTime //显示周二
  let wednesdayTime = nowTime - (day - 3) * oneDayTime //显示周三
  let thursdayTime = nowTime - (day - 4) * oneDayTime //显示周四
  let fridayTime = nowTime - (day - 5) * oneDayTime //显示周五
  let saturdayTime = nowTime - (day - 6) * oneDayTime //显示周六
  let sundayTime = nowTime + (7 - day) * oneDayTime //显示周日
  const DateTime = [
    {
      week: '一',
      time: mondayTime
    },
    {
      week: '二',
      time: tuesdayTime
    },
    {
      week: '三',
      time: wednesdayTime
    },
    {
      week: '四',
      time: thursdayTime
    },
    {
      week: '五',
      time: fridayTime
    },
    {
      week: '六',
      time: saturdayTime
    },
    {
      week: '日',
      time: sundayTime
    }
  ]
  let weekList = []
  for (let i = 0; i < DateTime.length; i++) {
    const data = getLocalTime(DateTime[i].time, 'yyyy-MM-dd')
    weekList.push({ ...DateTime[i], time: data })
  }
  return weekList
}
export function getLocalTime(date, format) {
  if (date == undefined || date == '') {
    date = new Date()
  } else {
    if ((date + '').indexOf('-') > -1) {
      date = new Date(date.replace(/-/g, '/'))
    } else {
      date = new Date(date)
    }
  }
  if (format == undefined || format == '') {
    format = 'yyyy-MM-dd'
  }

  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return format
}
// 补零函数
export function doHandleZero(zero) {
  var date = zero
  if (zero.toString().length == 1) {
    date = '0' + zero
  }
  return date
}
// 获取每个月一号
export function getDate(time) {
  let now = new Date()
  if (time) {
    now = new Date(time.replace(/-/g, '/'))
  }
  var myDate = new Date(now)
  var tYear = myDate.getFullYear()
  var tMonth = myDate.getMonth()
  tMonth = doHandleZero(tMonth + 1)

  return tYear + '-' + tMonth + '-01'
}
// 获取日期前前几天 后几天
export function funDate(num, time) {
  let date1 = new Date()
  if (time) {
    date1 = new Date(time.replace(/-/g, '/'))
  }
  let date2 = new Date(date1)
  date2.setDate(date1.getDate() + num)
  //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
  let time2 = getLocalTime(date2)
  return time2
}
// 获取日期前前几月 后几月
export function addMonths(v, n) {
  if (v == undefined || v == '') {
    v = new Date()
  } else {
    if ((v + '').indexOf('-') > -1) {
      v = new Date(v.replace(/-/g, '/'))
    } else {
      v = new Date(v)
    }
  }
  if (v) {
    var t = new Date(
      v.getFullYear(),
      v.getMonth(),
      v.getDate(),
      v.getHours(),
      v.getMinutes(),
      v.getSeconds(),
      v.getMilliseconds()
    )
    t.setMonth(v.getMonth() + n)
    if (t.getDate() != v.getDate()) {
      t.setDate(0)
    }
    return getLocalTime(t)
  }
}
// 根据字典码获取字典值
export function getDictNameByCode(DictName, code, prop = 'label') {
  const arr = store.state.DICT[DictName] || []
  const item = arr.length ? arr.filter(item => item.code == code) : []
  const val = item[0] ? item[0][prop] : '-'
  return val
}

export default {
  getDictNameByCode
}
