<template>
    <div class="curbox-wapper">
        <div :ref="propsRef" class="curbox"></div>
    </div>
</template>

<script>
    export default {
        props: {
            seriesData: {
                type: Object
            },
            propsRef: {
                type: String,
                default: 'barEchart'
            }
        },
        data () {
            return {
                legendData: [], // 图例数据
                xAxisData: [], // 坐标轴数据
                highData: [], // 高
                middleData: [], // 中
                lowData: [], // 低
                actualData: [], // 实际值
                barWidth: '8%', // 柱条宽度
                barMaxWidth: 20
            }
        },
        methods: {
            initCharts () {
                // 处理数据
                let seriesData = this.seriesData
                Object.keys(seriesData).forEach((key1) => {
                    key1 === '1' && this.xAxisData.push('上肢肌耐力')
                    key1 === '2' && this.xAxisData.push('下肢肌耐力')
                    key1 === '3' && this.xAxisData.push('核心肌耐力')
                    key1 === '4' && this.xAxisData.push('心肺功能')
                    let item = seriesData[key1]
                    Object.keys(item).forEach((key2) => {
                        // 图例数据
                        key2 === '1' && (this.legendData[0] = '高')
                        key2 === '2' && (this.legendData[1] = '中')
                        key2 === '3' && (this.legendData[2] = '低')
                        key2 === '4' && (this.legendData[3] = '实际值')

                        // 柱条数据
                        key2 === '1' && this.highData.push(item[key2])
                        key2 === '2' && this.middleData.push(item[key2])
                        key2 === '3' && this.lowData.push(item[key2])
                        key2 === '4' && this.actualData.push(item[key2])
                    })
                })
                // 绘制图表
                let curChart = this.$echarts.init(this.$refs[`${this.propsRef}`])
                let option = {
                    barMinHeight: 100,
                    tooltip: {
                        // 提示框组件。
                        trigger: 'axis', // 触发类型(坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。)
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'| 'cross'
                        }
                    },
                    legend: {
                        // 图例组件(顶部提示)
                        data: this.legendData,
                        left: 0, // 图例组件离容器左侧的距离。
                        top: 0,
                        // width: 300, // 图例组件的宽度
                        // height: 10,//图例组件的高度
                        itemWidth: 16,
                        itemHeight: 16,
                        itemGap: 32, // 图例间距
                        icon: 'rect', // 图例项的 icon的形状
                        textStyle: {
                            color: ' #252D30',
                            fontSize: 14
                        }
                    },
                    grid: {
                        // 直角坐标系内绘图网格
                        left: '-9%', // grid 组件离容器左侧的距离。
                        right: '4%',
                        bottom: '2%',
                        top: '23%', // grid 组件离容器顶部的距离。可以改变柱条高度
                        containLabel: true // grid 区域是否包含坐标轴的刻度标签。
                        // show: true// 是否显示直角坐标系网格。
                    },
                    xAxis: [
                        // 直角坐标系 grid 中的 x 轴
                        {
                            type: 'category', // 坐标轴类型。
                            data: this.xAxisData,
                            axisLabel: {
                                color: '#43454A',
                                fontSize: 14,
                                margin: 13 // 刻度标签与轴线之间的距离。
                            },
                            // interval: 101,
                            // 坐标轴轴线相关设置。
                            axisLine: {
                                show: false // 是否显示坐标轴轴线。
                            },
                            // 坐标轴刻度相关设置。
                            axisTick: {
                                show: false // 是否显示坐标轴轴线。
                                // alignWithLabel: true//保证刻度线和标签对齐
                            }
                        }
                    ],
                    // 直角坐标系 grid 中的 y 轴
                    yAxis: [
                        {
                            show: false, // 是否显示 y 轴
                            type: 'value', // 是否显示坐标轴刻度
                            minInterval: 1 // 自动计算的坐标轴最小间隔大小。
                        }
                    ],
                    series: [
                        {
                            name: '低',
                            type: 'bar',
                            stack: '等级',
                            emphasis: {
                                focus: 'series'
                            },
                            barWidth: this.barWidth,
                            barMaxWidth: this.barMaxWidth,
                            itemStyle: {
                                color: '#096DD8'
                            },
                            data: this.lowData
                        },
                        {
                            name: '中',
                            type: 'bar',
                            stack: '等级',
                            emphasis: {
                                focus: 'series'
                            },
                            barWidth: this.barWidth,
                            barMaxWidth: this.barMaxWidth,
                            itemStyle: {
                                color: '#F5BE00'
                            },
                            data: this.middleData
                        },
                        {
                            name: '高', // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
                            type: 'bar',
                            stack: '等级', // 数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置。
                            emphasis: {
                                // 高亮的图形样式和标签样式。？？
                                focus: 'series' // 聚焦当前高亮的数据所在的系列的所有图形。
                            },
                            barWidth: this.barWidth,
                            barMaxWidth: this.barMaxWidth,
                            itemStyle: {
                                color: '#FE7148'
                            },
                            barGap: this.barWidth, //
                            data: this.highData
                        },
                        {
                            name: '实际值',
                            type: 'bar',
                            emphasis: {
                                focus: 'series'
                            },
                            barWidth: this.barWidth,
                            barMaxWidth: this.barMaxWidth,
                            itemStyle: {
                                color: '#41C6C0'
                            },
                            // barCategoryGap: '30%',
                            data: this.actualData
                        }
                    ]
                }
                option && curChart.setOption(option)
                window.addEventListener('resize', () => {
                    curChart.resize()
                })
            }
        },
        watch: {
            seriesData (val) {
                this.initCharts()
            }
        },
        mounted () {
            this.seriesData && this.initCharts()
        }
    }
</script>

<style lang="less" scoped>
.curbox-wapper {
    width: 98%;
    height: 100%;
    .curbox {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
    }
}
</style>
