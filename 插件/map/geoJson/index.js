/*
 * @Description: 中国地图数据
 * @Date: 2023-02-14 10:07:33
 * @LastEditors: Hongzf
 * @LastEditTime: 2023-02-17 13:35:32
 */
import china from '@/largescreen/common/geoJson/china.json';// 完整中国地图数据
import chinaPart from '@/largescreen/common/geoJson/chinaPart.json'; // 不包含海南省子岛数据，用于渲染地图外围轮廓

// 23个省、5个自治区、4个直辖市、2个特别行政区，合计34个省级行政区。
// 23个省
import fujian from '@/largescreen/common/geoJson/fujian.json';
import hebei from '@/largescreen/common/geoJson/hebei.json';
import shanxi from '@/largescreen/common/geoJson/shanxi.json';
import heilongjiang from '@/largescreen/common/geoJson/heilongjiang.json';
import jilin from '@/largescreen/common/geoJson/jilin.json';
import liaoning from '@/largescreen/common/geoJson/liaoning.json';
import jiangsu from '@/largescreen/common/geoJson/jiangsu.json';
import zhejiang from '@/largescreen/common/geoJson/zhejiang.json';
import anhui from '@/largescreen/common/geoJson/anhui.json';
import jiangxi from '@/largescreen/common/geoJson/jiangxi.json';
import shandong from '@/largescreen/common/geoJson/shandong.json';
import henan from '@/largescreen/common/geoJson/henan.json';
import hubei from '@/largescreen/common/geoJson/hubei.json';
import hunan from '@/largescreen/common/geoJson/hunan.json';
import guangdong from '@/largescreen/common/geoJson/guangdong.json';
import hainan from '@/largescreen/common/geoJson/hainan.json';
import sichuan from '@/largescreen/common/geoJson/sichuan.json';
import guizhou from '@/largescreen/common/geoJson/guizhou.json';
import yunnan from '@/largescreen/common/geoJson/yunnan.json';
import shanxi2 from '@/largescreen/common/geoJson/shanxi2.json';
import gansu from '@/largescreen/common/geoJson/gansu.json';
import qinghai from '@/largescreen/common/geoJson/qinghai.json';
import taiwan from '@/largescreen/common/geoJson/taiwan.json';
// 5个自治区
import neimenggu from '@/largescreen/common/geoJson/neimenggu.json';
import guangxizhuangzu from '@/largescreen/common/geoJson/guangxizhuangzu.json';
import xizang from '@/largescreen/common/geoJson/xizang.json';
import ningxiahuizu from '@/largescreen/common/geoJson/ningxiahuizu.json';
import xinjiangweiwuer from '@/largescreen/common/geoJson/xinjiangweiwuer.json';
// 4个直辖市
import beijing from '@/largescreen/common/geoJson/beijing.json';
import tianjin from '@/largescreen/common/geoJson/tianjin.json';
import shanghai from '@/largescreen/common/geoJson/shanghai.json';
import chongqing from '@/largescreen/common/geoJson/chongqing.json';
// 2个特别行政区
import xianggang from '@/largescreen/common/geoJson/xianggang.json';
import aomen from '@/largescreen/common/geoJson/aomen.json';

// 导出全部
const mapJson = {
  china,
  chinaPart,
  // 23个省
  '河北省': hebei,
  '山西省': shanxi,
  '黑龙江省': heilongjiang,
  '吉林省': jilin,
  '辽宁省': liaoning,
  '江苏省': jiangsu,
  '浙江省': zhejiang,
  '安徽省': anhui,
  '福建省': fujian,
  '江西省': jiangxi,
  '山东省': shandong,
  '河南省': henan,
  '湖北省': hubei,
  '湖南省': hunan,
  '广东省': guangdong,
  '海南省': hainan,
  '四川省': sichuan,
  '贵州省': guizhou,
  '云南省': yunnan,
  '陕西省': shanxi2,
  '甘肃省': gansu,
  '青海省': qinghai,
  '台湾省': taiwan,
  // 5个自治区
  '内蒙古自治区': neimenggu,
  '广西壮族自治区': guangxizhuangzu,
  '西藏自治区': xizang,
  '宁夏回族自治区': ningxiahuizu,
  '新疆维吾尔自治区': xinjiangweiwuer,
  // 4个直辖市
  '北京市': beijing,
  '天津市': tianjin,
  '上海市': shanghai,
  '重庆市': chongqing,
  // 2个特别行政区
  '香港特别行政区': xianggang,
  '澳门特别行政区': aomen
}
export default mapJson
