<template>
	<view class="charts-box-wrap">
		<view class="charts-box">
			<!-- 配置位置：/src/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js/myMix -->
			<qiun-data-charts type="myLine" :chartData="chartData" background="#fff" :animation="false"
				:ontouch="true" />
		</view>
		<text class="txt x-label">
			日期/日
		</text>
		<text class="txt y-label">
			数值 / {{targetUnit ? targetUnit:''}}
		</text>
	</view>
</template>

<script>
	export default {
		props: {
			chartData: {
				type: Array,
				// default: []
			},
			targetUnit: {
				type: String,
				default: ''
			}
		},
		data() {
			return {}
		},
		// methods: {},
		onLoad() {
			console.log("chartData",this.chartData)
		}
	}
</script>

<style lang="scss" scoped>
	.charts-box-wrap {
		position: relative;
		background-color: #fff;

		.charts-box {
			margin-right: 50rpx;
			height: 502rpx;
		}

		.txt {
			position: absolute;
			font-size: 20rpx;
			font-weight: 400;
			color: #9FA7B3;
			line-height: 30rpx;
		}

		.x-label {
			right: 5rpx;
			bottom: 40rpx;
		}

		.y-label {

			top: 7rpx;
			left: 20rpx;
		}
	}
</style>
