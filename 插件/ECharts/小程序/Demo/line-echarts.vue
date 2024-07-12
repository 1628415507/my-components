<template>
    <view class="line-echarts">
        <uni-echarts :ec="ec" class="ec-canvas" :id="canvasId" :ref="canvasId" :canvas-id="canvasId"></uni-echarts>
    </view>
</template>

<script>
    import uniEcharts from '@/components/uni-echarts/uni-echarts'
    export default {
        components: {
            uniEcharts
        },
        props: {
            canvasId: {
                default: 'medicalReport'
            },
            dateList: {
                // 全部数据容器
                default: null
            },
            linetitle: {
                default: ''
            }
        },
        watch: {
            dateList: {
                immediate: true,
                handler() {
                    this.$nextTick(() => {
                        this.showCharts()
                    })
                }
            }
        },
        data() {
            return {
                chartData: null,
                ec: null
            }
        },
        methods: {
            // 执行更新数据
            showCharts() {
                // let { xData, yData } = this.dateList
                const xData = ['09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18']
                const yData = [150, 230, 224, 218, 135, 147, 260]
                console.log('xData', xData)
                console.log('yData', yData)
               // const yData = {
                // 	data: [150, 230, 224, 218, 135, 147, 260],
                // 	type: 'line',
                // 	symbol: 'circle',//折线拐点为实心
                // }
                this.ec = {
                    lazyload: true,
                    option: {
                        color: ['#4E8070', '#DA9D7E', '#FFAF17', '#777AA7'],
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            left: 'left', //位置
                            icon: 'rect', //形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none
                            itemWidth: 10, // 设置宽度
                            itemHeight: 4, // 设置高度,
                            data: [
                                {
                                    name: this.linetitle
                                }
                            ]
                        },
                        grid: {
                            top: '15%',
                            left: '1%',
                            right: '2%',
                            bottom: '1%',
                            containLabel: true
                        },
                        // x轴设置
                        xAxis: {
                            type: 'category',
                            splitNumber: 5,
                            // minInterval: 1,
                            // interval: 1,
                            // 坐标轴轴线相关设置。
                            axisLine: {
                                onZero: true, //X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上，只有在另一个轴为数值轴且包含 0 刻度时有效。
                                lineStyle: {
                                    type: 'solid',
                                    color: 'rgba(255, 255, 255, 0.37)' // 左边线的颜色,
                                    // width:'20rpx'
                                }
                            },
                            // 刻度相关设置
                            axisTick: {
                                // x轴刻度
                                show: true, //是否显示轴刻度,
                                alignWithLabel: true, //保证刻度线和标签对齐
                                // interval: 'auto', //默认会采用标签不重叠的策略间隔显示标签。
                                interval: 0, //默认会采用标签不重叠的策略间隔显示标签。设置成 0 强制显示所有标签。
                                inside: false, // 坐标轴刻度是否朝内
                                lineStyle: {
                                    //刻度线的样式设置。
                                    color: 'rgba(0,0,0,0.1)'
                                }
                            },
                            // 刻度标签的相关设置。
                            axisLabel: {
                                show: true,
                                margin: 12, //刻度标签与轴线之间的距离。
                                interval: 0, //设置成 0 强制显示所有标签。
                                textStyle: {
                                    fontSize: 10,
                                    color: 'rgba(0, 0, 0, 0.45)' //y轴文字颜色
                                }
                                // formatter: function (value, index) {
                                //     return value + 'kg';
                                // }
                            },
                            data: xData
                        },
                        yAxis: {
                            type: 'value',
                            minInterval: 1, // 自动计算的坐标轴最小间隔大小。
                            // name: '(cm)',
                            // nameTextStyle: {
                            // 	color: '#fff',
                            // 	fontSize: 16
                            // },
                            axisTick: {
                                // y轴刻度线
                                show: false //是否显示y轴刻度线
                            },
                            // 网格线（平行于x轴的线）
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: ['rgba(0,0,0,0.1)'],
                                    type: 'solid'
                                }
                            },
                            // splitArea: {
                            // 	show: false // 保留网格区域
                            // },
                            // y轴文字设置
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    fontSize: 10,
                                    color: 'rgba(0, 0, 0, 0.45)' //y轴文字颜色
                                },
                                // 这里重新定义就可以
                                formatter: function (value) {
                                    // var texts = []
                                    // if (value === 0 || value === '0') {
                                    // 	texts.push('Ⅰ类')
                                    // } else if (value === 1 || value === '1') {
                                    // 	texts.push('Ⅱ类')
                                    // } else if (value === 2 || value === '2') {
                                    // 	texts.push('Ⅲ类')
                                    // } else if (value === 3 || value === '3') {
                                    // 	texts.push('Ⅳ类')
                                    // } else if (value === 4 || value === '4') {
                                    // 	texts.push('V类')
                                    // } else if (value === 5 || value === '5') {
                                    // 	texts.push('Ⅵ类')
                                    // }
                                    // return texts
                                    return value
                                }
                            }
                            // axisLine: {
                            // 	lineStyle: {
                            // 		type: 'solid',
                            // 		color: 'rgba(255, 255, 255, 0.37)' // 左边线的颜色
                            // 	}
                            // }
                        },
                        // series: yData
                        series: {
                            name: this.linetitle,
                            type: 'line',
                            symbolSize: 5, //折线拐点大小
                            symbol: 'circle', //折线拐点为实心
                            data: yData
                        }
                    }
                }
                console.log('===', this.ec)
                this.$refs[this.canvasId] && this.$refs[this.canvasId].clear()
                this.$refs[this.canvasId] && this.$refs[this.canvasId].init()
            }
        },
        created() {
            // this.showCharts()
        },
        beforeDestroy() {
            console.log('离开页面销毁组件')
            this.$refs[this.canvasId] && this.$refs[this.canvasId].clear()
        },
        mounted() {
            this.showCharts()
        }
    }
</script>

<style lang="scss">
    .line-echarts {
        // margin-top: 75rpx;
        height: 400rpx;

        .ec-canvas {
            font-size: 28rpx;
            width: 100%;
            height: 400rpx;
        }
    }
</style>
