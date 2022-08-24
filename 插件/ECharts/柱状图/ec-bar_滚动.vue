<!--
 * @Author: Hongzhifeng
 * @Date: 2022-05-06 14:46:27
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-05-06 19:29:25
 * @Description: 柱状图
-->

<template>
  <div class="bar-wrap">
    <div id="bar" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    ecData: {
      type: Array,
    },
  },
  data() {
    return {
      // xData: [30, 29920, 29860, 20131, 17801, 19801, 19801, 19801],
      // yData: ['足球', '篮球', '棒球', '田径', '跳绳', '踢毽', '跳舞', '骑马'],
      xData: [],
      yData: [],
    }
  },
  watch: {
    ecData: {
      handler(val) {
        this.xData = val.map((item) => item.name)
        this.yData = val.map((item) => item.value)
        this.show()
      },
      deep: true,
    },
  },
  computed: {},
  mounted() {
    this.show()
  },
  methods: {
    show() {
      this.charts = echarts.init(document.getElementById('bar'))
      const yData = this.yData
      const xData = this.xData
      let viewLength = 21
      // let listLength = xData.length
      // let startValue = listLength - viewLength < 0 ? 0 : listLength - viewLength
      // let endValue = listLength - 1
      let endPercent = (viewLength / xData.length) * 100
      let option = {
        // dataZoom: [
        //   //滑动条
        //   {
        //     startValue: 0, // 从头开始。
        //     endValue: 10, // 一次性展示6个。
        //   },
        // ],
        dataZoom: [
          //给x轴设置滚动条
          // 下面这个属性是里面拖到
          // {
          //   type: 'inside', //slider有滑块，inside内置
          //   zoomLock: true, //是否锁定区域大小（true,只能平移不能缩放）
          //   show: true, //是否显示滑动条
          //   xAxisIndex: [0],
          //   start: 0, //默认为1
          //   end: endPercent,
          //   // disabled: false, //是否停止组件功能
          //   // xAxisIndex: 0, //x轴,可以用数组表示多个轴
          //   // preventDefaultMouseMove: false,
          //   // filterMode: 'empty',
          //   // startValue: startValue, //一行有几个（起始数组下标）
          //   // endValue: endValue, //一行有几个（结束数组下标）
          // },
          {
            start: 0, //默认为0
            end: endPercent,
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            handleSize: 0, //滑动条的 左右2个滑动条的大小
            height: 8, //组件高度
            left: 50, //左边的距离
            right: 40, //右边的距离
            bottom: 26, //右边的距离
            handleColor: '#ddd', //h滑动图标的颜色
            handleStyle: {
              borderColor: '#cacaca',
              borderWidth: '1',
              shadowBlur: 2,
              background: '#ddd',
              shadowColor: '#ddd',
            },
            fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              {
                //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                //给第一个设置0，第四个设置1，就是垂直渐变
                offset: 0,
                color: '#1eb5e5',
              },
              {
                offset: 1,
                color: '#5ccbb1',
              },
            ]),
            backgroundColor: '#ddd', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            // handleIcon:
            //   'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
            filterMode: 'filter',
          },
        ],
        // 提示框组件。
        tooltip: {
          trigger: 'axis', // 触发类型(坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。)
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'| 'cross'
          },
          // formatter: '',
        },
        grid: {
          top: '10%',
          // bottom: '15%',
          left: '4%', //靠左
          right: '0%',
        },
        xAxis: {
          data: xData,
          type: 'category',
          axisLine: {
            //x轴线的颜色以及宽度
            show: true,
            lineStyle: {
              color: '#D7D7D7', //更改坐标轴颜色
              // width: 0,
              // type: 'solid',
            },
          },
          axisLabel: {
            interval: 0,
            rotate: 30, //倾斜
            color: '#666666',
            fontSize: 14,
            margin: 10, // 刻度标签与轴线之间的距离。
            formatter(val) {
              // console.log('【 val, i 】-157', val, i)
              if (val.length > 5) {
                // return val
                return val.substring(0, 3) + '...'
              } else {
                return val
              }
            },
          },
          // 坐标轴刻度相关设置。
          axisTick: {
            show: false, // 是否显示坐标轴刻度线。
            alignWithLabel: true, //保证刻度线和标签对齐
          },
        },
        yAxis: {
          axisLine: {
            //x轴线的颜色以及宽度
            show: true,
            lineStyle: {
              color: '#D7D7D7', //更改坐标轴颜色
            },
          },
          axisLabel: {
            interval: 0,
            color: '#666666',
            fontSize: 14,
            // margin: 13, // 刻度标签与轴线之间的距离。
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed', //虚线
            },
          },
        },
        series: [
          {
            type: 'bar',
            // encode: { x: 'name', y: 'score' },
            label: {
              show: true,
              position: 'top',
              // valueAnimation: true,
            },
            // datasetIndex: 1,
            barWidth: 26,
            barMaxWidth: 26,
            itemStyle: {
              color: function (params) {
                const index = params.dataIndex
                if (index % 2 === 0) {
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00D1CF' },
                    // { offset: 0.5, color: '#00A5A1' },
                    { offset: 1, color: '#00A5A1' },
                  ])
                } else {
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#4EBAEB' },
                    // { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#2684D2' },
                  ])
                }
              },
            },
            data: yData,
          },
        ],
      }
      // 使用刚指定的配置项和数据显示图表。
      // if (option.dataZoom[0].endValue == yData.length) {
      //   option.dataZoom[0].endValue = 10
      //   option.dataZoom[0].startValue = 0
      // } else {
      //   option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1
      //   option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1
      // }
      this.charts.setOption(option)
      window.addEventListener('resize', () => {
        this.charts.resize()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.bar-wrap {
  width: 100%;
  height: 230px;
}
</style>
