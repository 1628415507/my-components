/*
 * @Description  :
 * @version      :
 * @Author       : yemaozi
 * @Date         : 2022-02-07 18:30:34
 * @LastEditors  : yemaozi
 * @LastEditTime : 2022-02-08 09:39:08
 * @FilePath     : \education-bureau\src\utils\compare.js
 */
export const isArrayEquals = (_this, array) => {
  // 如果另一个数组是假值，则返回
  if (!array) return false
  // 比较长度-可以节省大量时间
  if (_this.length != array.length) return false

  for (let i = 0, l = _this.length; i < l; i++) {
    // 检查是否有嵌套数组
    if (_this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!isArrayEquals(_this[i], array[i])) return false
    } else if (_this[i] instanceof Object && array[i] instanceof Object) {
      if (!isObjectEquals(_this[i], array[i])) return false
    } else if (_this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false
    }
  }
  return true
}
export const isObjectEquals = (_this, object2) => {
  //对于第一个循环，我们只检查类型
  for (let propName in _this) {
    //Check for inherited methods and properties - like .equals itself
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    //如果返回值不同，则返回false
    if (
      Object.prototype.hasOwnProperty.call(_this, propName) !=
      Object.prototype.hasOwnProperty.call(object2, propName)
    ) {
      return false
    }
    //检查实例类型
    else if (typeof _this[propName] != typeof object2[propName]) {
      //不同类型 => not equal
      return false
    }
  }
  //现在，使用其他对象属性名称进行更深入的检查
  for (let propName in object2) {
    //无论如何，我们必须检查实例，可能有一个属性只存在于object2中
    //我想知道，记住第一个循环中的检查值是否会更快
    Object.prototype.hasOwnProperty.call(_this, propName)
    if (
      Object.prototype.hasOwnProperty.call(_this, propName) !=
      Object.prototype.hasOwnProperty.call(object2, propName)
    ) {
      return false
    } else if (typeof _this[propName] != typeof object2[propName]) {
      return false
    }
    //如果该属性是继承的，则不再检查(如果两个对象都继承它，则它必须是equa)
    if (!Object.prototype.hasOwnProperty.call(_this, propName)) continue

    //现在是细节检查和递归

    //这会将脚本返回到数组
    /**REQUIRES Array.equals**/
    if (
      _this[propName] instanceof Array &&
      object2[propName] instanceof Array
    ) {
      // 递归到嵌套数组中
      if (!isObjectEquals(_this[propName], object2[propName])) return false
    } else if (
      _this[propName] instanceof Object &&
      object2[propName] instanceof Object
    ) {
      // 递归到另一个对象中
      //console.log("递归比较 ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
      if (!isObjectEquals(_this[propName], object2[propName])) return false
    }
    //字符串和数字的正常值比较
    else if (_this[propName] != object2[propName]) {
      return false
    }
  }
  //If everything passed, let's say YES
  return true
}
