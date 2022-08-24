<template>
	<view class="ec-liebar">
		<uni-echarts :ec="ec" class="ec-canvas" :id="canvasId" :ref="canvasId" :canvas-id="canvasId"></uni-echarts>
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
				default: 'ecLiebar'
			},
			ecData: {
				// 全部数据容器
				default: null
			}
		},
		watch: {
			ecData: {
				immediate: true,
				handler() {
					this.$nextTick(() => {
						this.showCharts();
					});
				}
			}
		},
		data() {
			return {
				ec: null
			};
		},
		computed: {
			getXData: function() {
				/*
        			6项分数集合, 从头到尾为0:体成分、1:柔韧度、2:肌肉耐力、3:肌肉力量、4:心肺耐力
        			8项分数集合, 从头到尾为0:体成分、1:柔韧度、2:肌肉耐力、3:肌肉力量、4:心肺耐力、5:平衡能力、6:爆发力、7:SAQ
        		*/
				// const xData = ['心肌耐力', '体成分', '柔韧度', '肌耐力', '肌肉力量'];
				const xData = [];
				this.ecData?.scoresOne?.map((item, index) => {
					index === 0 && xData.push('体成分');
					index === 1 && xData.push('柔韧度');
					index === 2 && xData.push('肌肉耐力');
					index === 3 && xData.push('肌肉力量');
					index === 4 && xData.push('心肺耐力');
					index === 5 && xData.push('平衡能力');
					index === 6 && xData.push('爆发力');
					index === 7 && xData.push('SAQ');
				});
				return xData
			}
		},
		methods: {
			// 执行更新数据
			showCharts() {
				const xData = this.getXData
				// console.log('【 xData 】-83', xData)
				const seriesConfig = {
					type: 'bar',
					barWidth: 10,
					itemStyle: {
						//柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
						normal: {
							barBorderRadius: 8 //柱形图圆角，初始化效果[15, 15, 0, 0]
						}
					}
				}
				this.ec = {
					lazyload: true,
					option: {
						color: ['#4E8070', '#DA9D7E'],
						tooltip: {
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
						// 	// x: 'right',
						// 	// y: ' center',
						// 	top: 200, //图例组件离容器上侧的距离。
						// 	// padding: [200, 30, 0,200],
						// 	// bottom: '20%',
						// 	left: 'left', //位置
						// },
						grid: {
							top: '5%', // grid 组件离容器顶部的距离。可以改变柱条高度
							left: '1%', // grid 组件离容器左侧的距离。
							right: '10%',
							bottom: '1%',
							containLabel: true // grid 区域是否包含坐标轴的刻度标签。
						},
						xAxis: {
							type: 'value',
							// boundaryGap: [0, 0.01],
							axisLine: {
								show: false //是否显示y轴刻度线
							},
							splitLine: {
								show: false //是否显示分隔线
							},
							axisTick: {
								// y轴刻度线
								show: false, //是否显示y轴刻度线,
								alignWithLabel: true //保证刻度线和标签对齐
							}
						},
						yAxis: {
							//
							type: 'category',
							data: xData,
							// nameGap: 20,
							axisLine: {
								show: false //是否显示y轴刻度线
								// onZero: true, //X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上，只有在另一个轴为数值轴且包含 0 刻度时有效。
								// lineStyle: {
								// 	type: 'solid',
								// 	color: 'rgba(255, 255, 255, 0.37)', // 左边线的颜色,
								// 	// width:'20rpx'
								// }
							},
							// axisLabel: {
							// align: 'left',
							// verticalAlign:'bottom'
							// },
							axisTick: {
								// y轴刻度线
								show: false, //是否显示y轴刻度线,
								alignWithLabel: true //保证刻度线和标签对齐
							}
						},
						series: [{
								...seriesConfig,
								name: this.ecData.dateOne,
								// data: [18203, 23489, 29034, 104970, 131744],
								data: this.ecData.scoresOne,

							},
							{
								...seriesConfig,
								name: this.ecData.dateTwo,
								// data: [19325, 23438, 31000, 121594, 134141],
								data: this.ecData.scoresTwo,

							}
						]
					}
				};
				this.$refs[this.canvasId] && this.$refs[this.canvasId].init();
			}
		},
		created() {
			// this.showCharts()
		},
		mounted() {
			this.showCharts();
		}
	};
</script>

<style lang="scss" scoped>
	.ec-liebar {
		height: 400rpx;

		.ec-canvas {
			font-size: 28rpx;
			width: 100%;
			height: 400rpx;
		}
	}
</style>
