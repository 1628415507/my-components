/** * @Description: 下载geoJson文件 * @Author: TSY * @CreateDate: 2018/9/5 9:04
* @email: t@tsy6.com */
<template>
  <div class="body">
    <div class="map" v-show="false">
      <map-range
        :download-tips="downloadTips"
        @change="search"
        @click="downloadJson"
      ></map-range>
    </div>
    <div class="echarts">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
/*global AMap:true*/
import JSZip from 'jszip'
import saveAs from './saveAs'
import MapRange from './MapRange'
import { AD_IMG } from './images/adimg'
import apis from '@/apis'
const _ = require('lodash')
export default {
  name: 'demo',
  components: {
    MapRange,
  },
  data() {
    return {
      AD_IMG,
      isShowAD: true,
      nameType: '',
      cityName: '中国',
      areaCode: 10000,
      geoJsonData: '',
      echartsMap: null,
      map: null,
      uimap: null,
      district: null,
      polygons: [],
      cityCode: 100000,
      citySelect: null,
      districtSelect: null,
      opts: {},
      areaData: {},
      mapData: [],
      zip: {}, //打包zip
      codeList: [],
      loadedNode: {}, // 记录已加载项
      waitToLoadList: [],
      loadingThreads: new Array(8).fill(null), // 8个并发

      isCodeListLoadComplete: false, //codeList是否全部获取完毕
      downloadTips: '下载geoJson数据', //下载进度提示
      isShowTips: false, //是否显示下载提示
    }
  },
  mounted() {
    /*global AMapUI:true*/
    this.zip = new JSZip()
    this.citySelect = document.getElementById('city')
    this.districtSelect = document.getElementById('district')
    this.echartsMap = this.$echarts.init(document.getElementById('map'))
    this.echartsMap.on('click', this.echartsMapClick)
    this.renderCountry()
  },
  props: {
    form: {
      require: true,
      type: Object,
    },
  },
  watch: {
    isCodeListLoadComplete(val) {
      if (val) {
        this.loadAllGeoJson()
      }
    },
  },
  methods: {
    echartsMapClick:_.debounce(function (params) {
      if (params.data.level === 'district') {
        return false
      }
      this.$emit('update', params)
      //地图点击事件
      this.$ba &&
        this.$ba.trackEvent(
          'echartsMap',
          '点击地图',
          `${params.data.name}-${params.data.cityCode}`
        )
      if (params.data.level == 'street') return
      //清除地图上所有覆盖物
      for (var i = 0, l = this.polygons.length; i < l; i++) {
        this.polygons[i].setMap(null)
      }
      this.cityName = params.data.name
      this.cityCode = params.data.cityCode
      this.district.setLevel(params.data.level) //行政区级别
      // this.district.setExtensions('all')
      //行政区查询
      //按照adcode进行查询可以保证数据返回的唯一性
      this.district.search(this.cityCode, (status, result) => {
        if (status === 'complete') {
          this.getData(result.districtList[0], params.data.level, this.cityCode)
        }
      })
    }, 300),
    loadMapData(areaCode) {
      this.$http
        .get(`/geojson/${areaCode}.geoJson`)
        .then((res) => {
          this.mapData = []
          res.data.features.map(item => {
            this.mapData.push({
              name: item.properties.name,
              value: 0,
              cityCode: item.properties.adcode,
              level: item.properties.level,
            })
          })
          let mapJson = res.data
          this.loadMap(this.cityName, mapJson)
          this.geoJsonData = mapJson
        })
        .catch(() => {
          AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
            //创建一个实例
            var districtExplorer = (window.districtExplorer =
              new DistrictExplorer({
                eventSupport: true, //打开事件支持
                map: this.map,
              }))

            districtExplorer.loadAreaNode(areaCode, (error, areaNode) => {
              if (error) {
                return
              }
              let mapJson = {}
              mapJson.type = 'FeatureCollection'
              mapJson.features = areaNode.getSubFeatures()
              this.loadMap(this.cityName, mapJson)
              this.geoJsonData = mapJson
              this.mapData = []
              this.geoJsonData.features.map(item => {
                this.mapData.push({
                  name: item.properties.name,
                  value: 0,
                  cityCode: item.properties.adcode,
                  level: item.properties.level,
                })
              })
            })
          })
        })
    },
    showTips() {
      this.isShowTips = true
      setTimeout(() => {
        this.isShowTips = false
      }, 3000)
    },
    downloadJson(nameType) {
      //geo文件下载
      this.nameType = nameType
      if (nameType === 'area') {
        this.$ba &&
          this.$ba.trackEvent('echartsMap', '文件下载', '下载级联数据')
        this.$refs.dialog.show()
        return
      }
      if (nameType === 'all') {
        this.$ba &&
          this.$ba.trackEvent('echartsMap', '文件下载', '打包下载全部')
        this.$refs.dialog.show()
        return
      }
      if (nameType === 'street') {
        this.$ba &&
          this.$ba.trackEvent('echartsMap', '文件下载', '下载乡镇数据')
        this.$refs.streetDialog.show()
        return
      }
      var blob = new Blob([JSON.stringify(this.geoJsonData)], {
        type: 'text/plain;charset=utf-8',
      })
      let filename = this.cityName
      if (nameType === 'code') {
        filename = this.cityCode
      }
      this.$ba && this.$ba.trackEvent('echartsMap', '文件下载', filename)
      saveAs(blob, `${filename}.geoJson`) //filename
    },
    dialogConfirm() {
      if (this.nameType === 'area') {
        this.$refs.mapDataDialog.show()
      } else {
        this.downloadAllJson()
      }
    },
    downloadAllJson() {
      //一次打包下载所有的数据
      this.showTips()
      if (this.downloadTips != '下载geoJson数据') {
        return
      }
      this.codeList = []

      this.downloadTips = '获取数据中...'

      // this.district.setLevel('country'); //行政区级别
      // this.district.setExtensions('all')
      this.loopSearch('中国')
    },
    loopSearch(code) {
      if (this.loadedNode[code]) return console.warn('已加载过', code)
      this.waitToLoadList.push(code)
      this.loopSearchOnce()
    },
    loadingComplete() {
      this.isCodeListLoadComplete = true
    },
    loopSearchOnce() {
      const pools = this.loadingThreads
      const idle_thread = pools.findIndex((i) => !i)
      if (idle_thread === -1) return
      const code = this.waitToLoadList.shift()
      if (!code) {
        const active_thread = pools.find((i) => i)
        if (!active_thread) return this.loadingComplete()
        return
      }
      this.loadedNode[code] = true
      pools[idle_thread] = new Promise((res, rej) => {
        this.district.search(code, (status, result) => {
          if (status !== 'complete') {
            return rej(status)
          }
          const item = result.districtList[0]
          const children = item.districtList
          children &&
            children.map((i) => {
              const { name, adcode, level } = i
              this.codeList.push({ name, adcode, level, code: adcode })
              if ('city|district|street'.indexOf(i.level) === -1)
                this.loopSearch(i.adcode)
            })
          return res(code)
        })
      })
        .catch(() => {
          this.loadedNode[code] = false // 重置为需要获取
          this.loopSearch(code)
        })
        .finally(() => {
          pools[idle_thread] = null // 设置线程可用
          this.loopSearchOnce()
        })
    },
    loadAllGeoJson() {
      //通过codeList加载全部geoJson数据
      AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
        //创建一个实例
        var districtExplorer = (window.districtExplorer = new DistrictExplorer({
          eventSupport: true, //打开事件支持
          map: this.map,
        }))
        let mapJson = {}
        const list = this.codeList
        const tasks = list.map(
          (i) =>
            new Promise((res) => {
              districtExplorer.loadAreaNode(i.code, (error, areaNode) => {
                if (error) {
                  return res()
                }
                mapJson.type = 'FeatureCollection'
                mapJson.features = (areaNode && areaNode.getSubFeatures()) || ''
                if (i.level === 'province') {
                  this.zip.file(
                    `100000/${i.code}.geoJson`,
                    JSON.stringify(mapJson)
                  )
                } else {
                  this.zip.file(
                    `100000/${i.code.substring(0, 2)}0000/${i.code}.geoJson`,
                    JSON.stringify(mapJson)
                  )
                }
                return res()
              })
            })
        )
        Promise.all(tasks).then(() => {
          let readme = ''
          this.zip.file('readMe(sourceCode).txt', readme)
          this.downloadTips = '文件打包压缩中...'
          this.zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'geoJson数据包.zip')
            this.downloadTips = '下载geoJson数据'
            this.isCodeListLoadComplete = false
            this.$ba &&
              this.$ba.trackEvent('echartsMap', '文件下载', '打包下载成功')
          })
        })
      })
    },
    loadMap(mapName, data) {
      if (data) {
        let codeList = this.mapData.map((item) => item.cityCode + '000000')
        this.$http
          .post(apis._apis_api_games_matchinfo_mapMatchNumberListByCodeList, {
            code: codeList.join(','),
            startDate: this.form.startDate,
            endDate: this.form.endDate,
          })
          .then((res) => {
            // 先归零
            // 对返回的数据进行处理,转成如下格式
            // {
            //   '100000000': 0
            // }
            let _obj = {}
            if (res.data.code === 200) {
              res.data.data.map((item) => {
                _obj[item.code] = item.count
              })
            }
            // 进行赋值
            this.mapData.map((item) => {
              item.value = _obj[item.cityCode + '000000'] || 0
              return item
            })
            this.$echarts.registerMap(mapName, data)
            this.$emit('getData', this.mapData)
            var option = {
              visualMap: {
                type: 'piecewise',
                pieces: [
                  { max: 1, label: '无赛事', color: '#c2dde0' },
                  { min: 1, max: 99999, label: '有赛事', color: '#7fb5b5' },
                ],
                color: '#000',
                textStyle: {
                  color: '#000',
                },
                visibility: 'off',
              },
              tooltip: {
                show: true,
                formatter: '{b0}: {c0}',
              },
              series: [
                {
                  name: '场次',
                  type: 'map',
                  roam: false,
                  mapType: mapName,
                  selectedMode: 'single',
                  showLegendSymbol: false,
                  visibility: 'off',
                  itemStyle: {
                    normal: {
                      color: '#ccc',
                      areaColor: '#000',
                      borderColor: '#000',
                      borderWidth: 0.5,
                      label: {
                        show: true,
                        textStyle: {
                          color: 'rgb(0,0,0)',
                        },
                      },
                    },
                  },
                  emphasis: {
                    disabled: true
                  },
                  select: {
                    disabled: true
                  },
                  data: this.mapData,
                },
              ],
            }
            // option.series[0].roam = true
            let isCountry = this.mapData.map(item => item.cityCode).includes(410000)
            if (isCountry) {
              option.series[0].center = [105.30946, 35.937629]
              option.series[0].zoom = 1.4
            } else {
               option.series[0].center = null
              option.series[0].zoom = 0.9
            }
            this.echartsMap.setOption(option)
          })
          .catch(() => {})
      }
    },
    getData(data, level, adcode) {
      var bounds = data.boundaries
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
          var polygon = new AMap.Polygon({
            map: this.map,
            strokeWeight: 1,
            strokeColor: '#0091ea',
            fillColor: '#80d8ff',
            fillOpacity: 0.2,
            path: bounds[i],
          })
          this.polygons.push(polygon)
        }
        this.map.setFitView() //地图自适应
      }

      //清空下一级别的下拉列表
      if (level === 'province') {
        this.citySelect.innerHTML = ''
        this.districtSelect.innerHTML = ''
      } else if (level === 'city') {
        this.districtSelect.innerHTML = ''
      }
      var subList = data.districtList
      if (subList) {
        var contentSub = new Option('--请选择--')
        var curlevel = subList[0].level
        if (curlevel === 'street') {
          let mapJsonList = this.geoJsonData.features
          let mapJson = {}
          for (let i in mapJsonList) {
            if (mapJsonList[i].properties.name == this.cityName) {
              mapJson.type = 'FeatureCollection'
              mapJson.features = [].concat(mapJsonList[i])
            }
          }
          // this.mapData = []
          // this.mapData.push({
          //   name: this.cityName,
          //   value: Math.random() * 100,
          //   level: curlevel,
          // })
          this.loadMap(this.cityName, mapJson)
          return
        }

        var curList = document.querySelector('#' + curlevel)
        curList.add(contentSub)
        for (let i = 0, l = subList.length; i < l; i++) {
          var name = subList[i].name
          // var cityCode = subList[i].adcode
          // this.mapData.push({
          //   name: name,
          //   value: Math.random() * 100,
          //   cityCode: cityCode,
          //   level: curlevel,
          // })
          var levelSub = subList[i].level
          contentSub = new Option(name)
          contentSub.setAttribute('value', levelSub)
          contentSub.center = subList[i].center
          contentSub.adcode = subList[i].adcode
          curList.add(contentSub)
        }
        this.loadMapData(adcode)
        this.areaData[curlevel] = curList
      }
    },
    search(area) {
      let obj = this.areaData[area]
      //清除地图上所有覆盖物
      for (var i = 0, l = this.polygons.length; i < l; i++) {
        this.polygons[i].setMap(null)
      }
      var option = obj[obj.options.selectedIndex]
      var keyword = option.text //关键字
      var adcode = option.adcode
      this.cityName = keyword
      this.cityCode = adcode
      this.$ba &&
        this.$ba.trackEvent(
          'echartsMap',
          '筛选地图',
          `${this.cityName}-${this.cityCode}`
        )
      this.district.setLevel(option.value) //行政区级别
      // this.district.setExtensions('all')
      //行政区查询
      //按照adcode进行查询可以保证数据返回的唯一性
      this.district.search(adcode, (status, result) => {
        if (status === 'complete') {
          this.getData(result.districtList[0], obj.id, adcode)
        }
      })
    },
    // 联系下载乡镇数据
    contact() {
      this.$ba && this.$ba.trackEvent('echartsMap', '文件下载', '联系下载')
      if (/(iPhone|iPad|iPod|iOS|android)/i.test(navigator.userAgent)) {
        window.open(
          'mqqwpa://im/chat?chat_type=wpa&uin=2890228902&version=1&src_type=web&web_src=http:://wpa.b.qq.com'
        )
      } else {
        window.open(
          'http://wpa.qq.com/msgrd?v=3&uin=2890228902&site=在线客服&menu=yes'
        )
      }
    },
    openAd() {
      location.href = 'https://hxkj.vip/map'
    },
    renderCountry() {
      //实例化zip对象

      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: [105.30946, 35.937629],
        zoom: 1.7,
      })
      this.opts = {
        subdistrict: 1, //返回下一级行政区
        showbiz: false, //最后一级返回街道信息
      }
      if (!this.form.provinceCode) {
        this.district = new AMap.DistrictSearch(this.opts) //注意：需要使用插件同步下发功能才能这样直接使用
        this.district.search('中国', (status, result) => {
          if (status == 'complete') {
            this.getData(result.districtList[0], '', 100000)
          }
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
}

.body {
  display: flex;
  width: 100%;
  overflow: hidden;
}

.map,
.echarts {
  width: 0;
  flex: 1;
  overflow: hidden;
}

.echarts {
  background-size: 100% 100%;
}

#map {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.tips {
  position: fixed;
  bottom: 30%;
  left: 40%;
  padding: 10px 15px;
  border-radius: 5px;
  color: #000;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
}

.gg {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  cursor: pointer;
  width: 420px;

  img {
    width: 420px;
  }
}

.gg-close {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
}

@keyframes adShakeAnmation {
  0% {
    bottom: 1px;
    left: 0px;
  }

  30% {
    bottom: 1;
    left: 10px;
  }

  70% {
    bottom: 0px;
    left: 1px;
  }

  100% {
    bottom: 0;
    left: 0;
  }
}
</style>
