<!--
 * @Author: Hongzf
 * @Date: 2022-08-25 17:06:32
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-08-26 16:36:37
 * @Description: 柱状图-多条
-->
<template>
  <div :id="id" :class="className" :style="{ height, width }" />
</template>

<script>
import echarts from 'echarts';
import resize from '@/components/Charts/mixins/resize';

export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'barChart'
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
    seriesData() {
      return [{
        name: 'one',
        data: [320, 332, 301, 334, 390, 301, 334, 390]
      },
      {
        name: 'two',
        data: [220, 182, 191, 234, 290, 301, 334, 390]
      },
      {
        name: 'three',
        data: [150, 232, 201, 154, 190, 301, 334, 390]
      },
      {
        name: 'four',
        data: [150, 232, 201, 154, 190, 301, 334, 390]
      }];
    },
    legendData() {
      return this.seriesData.map(item => item.name)
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
      const seriesConfig = {
        type: 'bar',
        // barWidth: 15,
        barMinWidth: 15,
        barMaxWidth: 50,
        barGap: 0, // 间距
        itemStyle: {
          // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
          // normal: {
          //   barBorderRadius: 8 // 柱形图圆角，初始化效果[15, 15, 0, 0]
          // }
        }
      };
      this.chart.setOption({
        color: ['#3aa1ff', '#4ecb73', '#fbd437', '#435188'],
        backgroundColor: '#FFF', // 背景
        // 标题
        title: {
          text: '项目人员详细配置情况',
          top: 16,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14,
            color: '#7f7f7f'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          // 【背景框样式设置】
          backgroundColor: 'rgb(255,255,255)', // 设置背景图片 rgba格式
          extraCssText: 'box-shadow: 0 0 8px rgba(0,0,0,0.5)',
          // color: 'black',
          textStyle: {
            fontSize: 12,
            color: '#666'
          },
          // 【指针区域样式】
          axisPointer: {
            show: true, // tooltip轴线,
            type: 'shadow', // 背景色
            shadowStyle: {
              color: 'rgba(0,0,0,0.1)'// 指针区域-背景色设置
            }
          },
          // 【自定义tooltip样式】
          // formatter: '{a} {c}'
          formatter: function(params) {
            // console.log('【 params 】-126', params)
            let htmlStr = ''
            // 编写展示模板
            params.forEach((item) => {
              htmlStr += `<div style="display: flex; justify-content: space-between; align-item:center">
                        <div><span style="font-size:10px;color:${item.color};">●</span> ${item.seriesName}</div>
                        <div style="font-weight:500; margin-left: 15px;">${item.value}</div>
                    </div>`
            })
            htmlStr = params[0].name + htmlStr
            return htmlStr
          }
        },
        // 【图例】
        legend: {
          data: this.legendData,
          icon: 'rect',
          x: 'center',
          y: 'bottom',
          itemWidth: 7,
          itemHeight: 7,
          itemGap: 13,
          textStyle: {
            fontSize: 12,
            color: '#b3b3b3'
          }
        },
        grid: {
          top: 80, // 图表距离标题的距离
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
              // X轴线的颜色
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
            ...seriesConfig,
            name: this.seriesData[0].name,
            data: this.seriesData[0].data
          },
          {
            ...seriesConfig,
            name: this.seriesData[1].name,
            data: this.seriesData[1].data
          },
          {
            ...seriesConfig,
            name: this.seriesData[2].name,
            data: this.seriesData[2].data
          },
          {
            ...seriesConfig,
            name: this.seriesData[3].name,
            data: this.seriesData[3].data
          }
        ]
      });
    }
  }
};
</script>
