<template>
	<view class="vertical-bar" :style="{'backgroundColor':bgColor}">
		<uni-echarts :ec="ec" class="ec-canvas" :id="canvasId" :ref="canvasId" :canvas-id="canvasId">
		</uni-echarts>
	</view>
</template>

<script>
	import uniEcharts from '@/pages/public/uni-echarts/uni-echarts';
	export default {
		components: {
			uniEcharts
		},
		props: {
			canvasId: {
				default: 'verticalBar'
			},
			dateList: { // 全部数据容器
				default: null
			},
			barColor: {
				default: ['#4E8070', '#91B0A6']
			},
			bgColor: {
				type: String,
				default: '#F6F8F8'
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
				const xData = ['2021年08月10日']
				const yData = [150, 230, 224, 218, 135, 147, 260]
				// option.Axis公共配置
				const axisConfig = {
					splitLine: {
						show: false //是否显示分隔线
					},
					axisLine: {
						show: false, //是否显示y轴刻度线
					},
					axisTick: { // y轴刻度线
						show: false, //是否显示y轴刻度线,
						alignWithLabel: true, //保证刻度线和标签对齐
					},
				}
				// option.series公共配置
				const seriesConfig = {
					type: 'bar',
					barWidth: 40,
					label: {
						show: true,
						position: 'inside',
						fontSize: 12,
						color: '#fff',
						formatter: '{a} {c}'
						// formatter: function(params) {
						// 	return 11
						// },
					},
					itemStyle: {
						//柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
						normal: {
							barBorderRadius: 4 //柱形图圆角，初始化效果[15, 15, 0, 0]
						}
					},
				}

				this.ec = {
					lazyload: true,
					option: {
						color: this.barColor,
						tooltip: {
							show: false,
							trigger: 'axis',
							axisPointer: {
								type: 'shadow'
							}
						},
						// 图例
						// legend: {
						// 	icon: "rect", //形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none
						// 	itemWidth: 10, // 设置宽度
						// 	itemHeight: 10, // 设置高度
						// 	top: 200, //图例组件离容器上侧的距离。
						// 	// padding: [200, 30, 0,200],
						// 	// bottom: '20%',
						// 	left: 'left', //位置
						// },
						grid: {
							top: '1%', // grid 组件离容器顶部的距离。可以改变柱条高度
							left: '1%', // grid 组件离容器左侧的距离。
							right: '1%',
							bottom: '1%',
							containLabel: true // grid 区域是否包含坐标轴的刻度标签。
						},
						xAxis: {
							type: 'category',
							data: xData,
							...axisConfig
						},
						yAxis: { //
							type: 'value',
							axisLabel: {
								show: false, //是否显示y轴刻度线
								// align: 'left',
								// verticalAlign: 'bottom'
							},
							...axisConfig
						},
						series: [{
								name: '左',
								data: [],
								barGap: 0, //设置同一组柱体之间的间距
								...seriesConfig,
							},
							{
								name: '右',
								data: [],
								...seriesConfig,
							}
						]
					},
				}
				this.$refs[this.canvasId] && this.$refs[this.canvasId].init();
			},
		},
		created() {
			// this.showCharts()
		},
		mounted() {
			this.showCharts()
		}
	}
</script>

<style lang="scss" scoped>
	.vertical-bar {
		height: 216rpx;
		padding: 11rpx 0;

		.ec-canvas {
			font-size: 28rpx;
			width: 100%;
			height: 400rpx;
		}
	}
</style>
