<!--
 * @Author: Hongzf
 * @Date: 2022-08-25 17:06:32
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-08-26 16:36:29
 * @Description:
-->
<template>
  <div :id="id" :class="className" :style="{ height, width }" />
</template>

<script>
import echarts from 'echarts';
import resize from '@/Charts/mixins/resize';

export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'lineChart'
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    };
  },
  computed: {
    xData() {
      return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月'];
    },
    yData() {
      return [10, 50, 25, 45, 22, 65, 22, 20, 82, 91, 34, 50];
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.setOption({
        backgroundColor: '#FFF', // 背景
        // 标题
        title: {
          text: '人员趋势图',
          top: 16,
          textStyle: {
            fontWeight: 'bold',
            fontSize: 16,
            color: 'rgb(134, 136, 146)'
          },
          left: '2%'
        },
        tooltip: {
          // trigger: 'item', // 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
          trigger: 'axis',
          // 【背景框样式设置】
          backgroundColor: 'rgb(255,255,255)', // 设置背景图片 rgba格式
          extraCssText: 'box-shadow: 0 0 8px rgba(0,0,0,0.5)',
          // color: 'black',
          // borderWidth: '0.5', // 边框宽度设置1
          // borderColor: 'rgba(0, 0, 0, 0.05)', // 设置边框颜色
          textStyle: {
            fontSize: 12,
            color: '#666'
          },
          // 【指针区域样式】
          axisPointer: {
            show: false, // tooltip轴线,
            // type: 'shadow', // 背景色
            lineStyle: {
              color: 'rgba(255,255,255,0)'
            }
            // shadowStyle: {
            //   color: 'rgba(255,255,255,0.5)'// 指针区域-背景色设置
            // }
          }
          // 【自定义tooltip样式】
          // formatter: '{a} {c}'
          // formatter: function(params) {
          //   // console.log(params) // 打印数据
          //   var showdata = params[0];
          //   // 根据自己的需求返回数据
          //   return `
          //  <div>本月：${showdata.data[1]}</div>
          //   <div>上月：${showdata.data[2]}</div>`
          // }
        },
        // 图例
        legend: {
          data: ['num'], // ['CMCC', 'CTCC', 'CUCC'],
          icon: 'rect',
          x: 'center',
          y: 'bottom',
          itemWidth: 10,
          itemHeight: 7,
          itemGap: 13,
          textStyle: {
            fontSize: 12,
            color: '#b3b3b3'
          }
          // padding: [100, 0, 0, 0]
          // left: '-3%', // 图例组件离容器左侧的距离。
          // bottom: -10 // 图例组件离容器下侧的距离。
          // top: 20
          // right: '4%',
        },
        grid: {
          top: 100, // 图表距离标题的距离
          left: '2%',
          right: '2%',
          bottom: '10%', // 图表距离底部图例的距离
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            // scale: true,
            boundaryGap: true, // 刻度线不从0开始
            // 坐标轴刻度相关设置。
            axisTick: {
              alignWithLabel: true // 保证刻度线和标签对齐
            },
            axisLine: {
              lineStyle: {
                color: '#bbb'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // name: '(%)',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
              // lineStyle: {
              //   color: '#57617B'
              // }
            },
            // 刻度值
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            // 刻度线
            splitLine: {
              lineStyle: {
                color: '#ccc',
                type: 'dashed' // 虚线
              }
            }
          }
        ],
        series: [
          {
            type: 'line',
            name: 'num',
            data: this.yData,
            smooth: true,
            symbol: 'circle', // 折线上的圆点
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1.5 // 折现的粗细
              }
            },
            areaStyle: {
              normal: {
                color: 'rgb(185, 221, 255)'
                // new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //   offset: 0,
                //   color: 'rgba(0, 136, 212, 0.3)'
                // }, {
                //   offset: 0.8,
                //   color: 'rgba(0, 136, 212, 0)'
                // }], false)
                // shadowColor: 'rgba(0, 0, 0, 0.1)',
                // shadowBlur: 10
              }
            },
            // 区域线
            itemStyle: {
              normal: {
                color: 'rgb(45, 154, 255)',
                borderColor: 'rgba(0,136,212,0.2)',
                borderWidth: 12
              }
            }
          }
        ]
      });
    }
  }
};
</script>
