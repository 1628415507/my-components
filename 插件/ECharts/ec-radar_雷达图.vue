<template>
	<view class="ec-radar">
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
				default: 'radarId'
			},
			ecData: {
				default: null// 全部数据容器
			}
		},
		watch: {
			ecData: {
				immediate: true,
				handler() {
					this.$nextTick(() => {
						this.ecData && this.showCharts()
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
				// 综合得分
				const scoresList = this.ecData
				// 剔除第一个
				let scoresArr = scoresList?.slice(0, scoresList.length - 1) || [];
				/*
    				6项分数集合, 从头到尾为
    					0:体成分、1:柔韧度、2:肌肉耐力、3:肌肉力量、4:心肺耐力、5:综合得分,
    				8项分数集合, 从头到尾为
    					0:体成分、1:柔韧度、2:肌肉耐力、3:肌肉力量、4:心肺耐力、5:平衡能力、6:爆发力、7:SAQ、8:综合得分
    			*/
				let indicator = [{
						text: '体成分 ' + (scoresArr[0] || 0),
						max: 100
					},
					{
						text: '柔韧度 ' + (scoresArr[1] || 0),
						max: 100
					},
					{
						text: '肌肉耐力 ' + (scoresArr[2] || 0),
						max: 100
					},
					{
						text: '肌肉力量 ' + (scoresArr[3] || 0),
						max: 100
					},
					{
						text: '心肺耐力 ' + (scoresArr[4] || 0),
						max: 100
					}
				];
				// 长度大于5，有7项
				if (scoresArr.length > 5) {
					indicator = indicator.concat([{
							text: '平衡能力 ' + (scoresArr[5] || 0),
							max: 100
						},
						{
							text: '爆发力 ' + (scoresArr[6] || 0),
							max: 100
						},
						{
							text: 'SAQ ' + (scoresArr[7] || 0),
							max: 100
						}
					])
				}
				this.ec = {
					lazyload: true,
					option: {
						animation: false,
						color: ['#DA9D7E'],
						radar: [{
							indicator: indicator,
							shape: 'circle',
							radius: 57,
							center: ['50%', '55%']
						}],
						series: [{
							type: 'radar',
							areaStyle: {},
							data: [{
								value: scoresArr,
								name: '综合得分'
							}]
						}]
					}
				}
				this.$refs[this.canvasId] && this.$refs[this.canvasId].clear();
				this.$refs[this.canvasId] && this.$refs[this.canvasId].init();
			}
		},
		created() {
			// this.showCharts()
		},
		mounted() {
			// this.showCharts()
		},
		beforeDestroy() {
			console.log('离开页面销毁组件')
			this.$refs[this.canvasId] && this.$refs[this.canvasId].clear()
		}
	}
</script>

<style lang="scss" scoped>
	.ec-radar {
		height: 450rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.ec-canvas {
			margin-top: -50rpx;
			font-size: 28rpx;
			width: 100%;
			height: 450rpx;
		}
	}
</style>
