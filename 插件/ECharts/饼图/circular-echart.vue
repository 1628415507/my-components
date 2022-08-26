<template>
    <div
        :style="{ width: vesselWidth, height: vesselHeight }"
        :ref="propsRef"
    ></div>
</template>

<script>
    export default {
        props: {
            seriesData: {
                type: Array
            },
            propsRef: {
                type: String,
                default: 'circularEchart'
            },
            vesselWidth: {
                // 容器宽度
                type: String,
                default: '200px'
            },
            vesselHeight: {
                // 容器高度
                type: String,
                default: '130px'
            }
        },
        data () {
            return {
                labelData: []
            }
        },
        methods: {
            initCharts () {
                let curChart = this.$echarts.init(this.$refs[`${this.propsRef}`])
                // 绘制图表
                let option = {
                    tooltip: {
                        trigger: 'item' // 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
                    },
                    legend: {
                        left: '-3%', // 图例组件离容器左侧的距离。
                        bottom: '10%', // 图例组件离容器下侧的距离。
                        width: 650, // 图例组件的宽度。默认自适应
                        height: 8,
                        itemWidth: 6, // 图例标记的图形宽度
                        itemHeight: 6, // 图例标记的图形高度。
                        textStyle: {
                            fontSize: 10,
                            fontWeight: 400,
                            color: '#252D30'
                        },
                        formatter: (name) => {
                            let labelData = this.seriesData
                            for (let i = 0; i < labelData.length; i++) {
                                if (labelData[i].name === name) {
                                    return name + ': ' + labelData[i].value + 'cm'
                                }
                            }
                        }
                    },
                    series: [
                        {
                            name: '体格数据',
                            type: 'pie',
                            data: this.seriesData,
                            width: 85, // 组件的宽度
                            height: 85, // 组件的高
                            left: '50%', // 组件离容器左侧的距离。
                            radius: ['60%', '100%'], // 饼图的半径,数组的第一项是内半径，第二项是外半径
                            // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等
                            label: {
                               show: false,
                                position: 'center', // 标签的位置。center
                                color: '#000', // 文字的颜色。
                                fontWeight: 'normal',
                                formatter: '{c}cm',
                                fontSize: 10
                            },
                            emphasis: {
                                scale: false, // 是否开启高亮后扇区的放大效果
                                // 鼠标移到时，标签内容格式器
                                label: {
                                    show: false,
                                    fontSize: '10',
                                    scale: false
                                }
                            }
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
        created () {},
        mounted () {
            this.seriesData && this.initCharts()
        }
    }
</script>
