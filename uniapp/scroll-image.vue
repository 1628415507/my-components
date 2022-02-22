<template>
	<scroll-view :style="{height}" scroll-x="true">
		<view class="img-list">
			<view class="item" v-for="(item, index) in info" :key="index">
				<u-image width="180" height="225" :src="osimgUrl+item.src" error-icon="photo">
				</u-image>
				<view class="name">{{item.name}}</view>
				<view v-if="item.score" class="score">{{item.score.toString() || 0}}分</view>
			</view>
		</view>
	</scroll-view>
</template>
<script>
	export default {
		props: {
			info: {
				type: Array,
				default: () => []
			},
			height: {
				type: String,
				default: '300rpx'
			}
		},
		watch: {
			info(val) {
				// this.info =val;
			},
		},
		data() {
			return {
				osimgUrl: this.$config.osimgUrl,
				list: []
			}
		}
	}
</script>

<style lang="scss" scoped>
	.img-list {
		display: flex;

		.item {
			margin-right: 24rpx;

			image {
				width: 180rpx;
				height: 225rpx;
				// border: 1rpx solid #ccc;
			}

			.name {
				height: 40rpx;
				// text-align: center;
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
			}

			.score {
				font-size: 32rpx;
				font-weight: 500;
				color: #DA9D7E;
				line-height: 45rpx;
			}

			.u-image__error {
				margin-top: 0 !important;
			}

			view {
				margin-top: 16rpx;
				color: $colorE;
			}
		}
	}
</style>
