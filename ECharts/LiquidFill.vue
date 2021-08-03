<template>
  <div
    :style="{ width: vesselWidth, height: vesselHeight}"
    :ref="propsRef"
  ></div>
</template>

<script>
    export default {
        props: {
            value: { // 水球的值范围[ 0~1 ]
                type: String,
                require: true,
                default: '0'
            },
            propsRef: {
                type: String,
                require: true,
                default: 'chartDom'
            },
            vesselWidth: { // 水球宽度
                type: String,
                default: '56px'
            },
            vesselHeight: { // 水球高度
                type: String,
                default: '56px'
            },
            waterColor: { // 水球显示的液体颜色
                type: String,
                default: 'pink'
            },
            borderColor: { // 水球边框的颜色
                type: String,
                default: 'pink'
            },
            labelColor: { // 标签字体的颜色
                type: String,
                default: 'rgba(0,0,0,0.5)'
            },
            labelFontSize: { // 标签字体的大小
                type: String,
                default: '12'
            }
        },
        data () {
            return {}
        },
        methods: {
            initCharts () {
                let curChart = this.$echarts.init(this.$refs[`${this.propsRef}`])
                // 绘制图表
                let option = {
                    // 标题
                    title: {
                        text: '',
                        bottom: 50,
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 12,
                            color: 'red'
                        }
                    },
                    series: [
                        {
                            data: [`${this.value}`], // 显示的数据
                            type: 'liquidFill',
                            radius: '95%', // 水球站所处div的半径
                            center: ['50%', '50%'], // 水球图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
                            amplitude: 5, // 振幅:波浪的弧度
                            animationDurationUpdate: 2e3, // 动画持续时间更新
                            phase: 0, // 波的相位弧度 不设置  默认自动
                            direction: 'right', // 波浪移动的速度[ left/right ]
                            itemStyle: {
                                color: this.waterColor, // 水球显示的液体颜色
                                opacity: 1, // 波浪的透明度
                                shadowBlur: 5 // 波浪的阴影范围
                            }, // 图形上的文本标签
                            label: {
                                normal: {
                                    color: this.labelColor, // 标签的颜色
                                    textStyle: {
                                        fontSize: this.labelFontSize, // 标签文字的大小
                                        fontWeight: 'normal'
                                    }

                                }
                            },
                            backgroundStyle: {
                                color: 'rgba(255,255,255,0.1)' // 液体的背景颜色
                            },
                            outline: { // 水球边框
                                show: true,
                                borderDistance: 0, // 边框与球体的距离
                                itemStyle: {
                                    borderColor: this.borderColor, // 边框的颜色
                                    borderWidth: 2
                                }
                            }
                            // color: '#bbffaa', // 水球容器的颜色
                        }
                    ]
                    // backgroundColor: '#bfa'//容器背景颜色
                }
                option && curChart.setOption(option)
                window.addEventListener('resize', () => {
                    curChart.resize()
                })
            }
        },
        mounted () {
            this.value && this.initCharts()
        }
    }
</script>
