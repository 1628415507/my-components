r'r<template>
	<view class="prize-wrapper">
		<!-- 奖品内容 -->
		<view class="prize-content" v-if="prizeList.length !== 0">
			<view class="prize-list">
				<view class="prize-item" v-for="(item,index) in prizeList" :key="index">
					<image :src="item.prizeImage" mode=""></image>
					<view class="right">
						<view class="item-title">{{item.prizeName}}</view>
						<view class="item-text">赛事：{{item.gameName}}</view>
						<view class="item-text">中奖时间：{{item.lotteryTime}}</view>
						<view class="item-text">备注：{{item.remark}}</view>
					</view>
				</view>
				<u-loadmore :status="status" :load-text="loadText" />
			</view>
		</view>
		<!-- 无中奖信息 -->
		<view class="prize-null" v-else>
			<image class="images" src="../../static/img/prizeNull.png" mode=""></image>
			<view class="text1">当前暂无赛事中奖信息～</view>
			<view class="text2">听说参赛越多，中奖几率会变高哦～</view>
		</view>
	</view>
</template>

<script>
	import {
		getMyPrizeList
	} from "../../http/api.js"
	export default {
		data() {
			return {
				prizeList: [],
				size: 5,
				page: 1,
				status: 'loadmore', //加载状态
				loadText: {
					loadmore: '上拉加载更多',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				isPull: false //判断刷新or加载
			}
		},
		onLoad() {
			this.getDataList()
		},
		// 下拉刷新
		async onPullDownRefresh() {
			this.page = 1 //页数重置
			this.isPull = true
			await this.getDataList() //重新请求数据
			wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
		},
		onReachBottom() {
			if (this.status === 'nomore') return
			this.page++; //请求下一页数据
			this.isPull = false //
			this.getDataList()
		},
		methods: {
			getDataList() {
				return new Promise((resolve, reject) => {
					getMyPrizeList({
						size: this.size,
						page: this.page
					}).then(res => {
						const length = res.data.length
						length < this.size ? this.status = 'nomore' : this.status = "loadmore" //改变加载状态
						this.prizeList = this.isPull ? res.data : this.prizeList.concat(res.data) //上拉加载
						resolve() //获取数据成功
					}).catch(err =>
						reject() //获取数据成功
					)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 超出范围用省略号
	@mixin ellipsis($width) {
		width: $width; // 使用参数
		overflow: hidden; //超出的文本隐藏
		text-overflow: ellipsis; //溢出用省略号显示
		white-space: nowrap; //溢出不换行
	}

	.prize-wrapper {
		position: absolute;
		height: 100%;
		width: 100%;
		background: #F7F7F7;

		.prize-null {
			width: 78%;
			margin: 0 auto;
			margin-top: 198rpx;
			text-align: center;
			font-weight: 400;
			color: #202122;

			.images {
				width: 100%;
				height: 338rpx;
			}

			.text1 {
				margin-top: 56rpx;
				font-size: 30rpx;
				line-height: 42rpx;
			}

			.text2 {
				margin-top: 14rpx;
				font-size: 26rpx;
				line-height: 36rpx;
			}
		}

		.prize-content {
			padding: 30rpx;
			margin: 0 auto;

			.prize-list {
				padding: 16rpx;
				border-radius: 12rpx;
				background: #FFFFFF;
				min-height: 1142rpx;

				.prize-item {
					display: flex;
					flex-direction: row; //灵活的项目将水平显示
					border-bottom: 1rpx #F8F8FF solid;
					padding-bottom: 24rpx;
					margin-bottom: 24rpx;

					image {
						width: 258rpx;
						height: 180rpx;
						flex-shrink: 0;
					}

					.right {
						margin-left: 16rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						font-weight: 400;

						.item-title {
							font-size: 30rpx;
							color: #202122;
							@include ellipsis(360rpx);
						}

						.item-text {
							font-size: 24rpx;
							color: #666666;
							@include ellipsis(360rpx);
						}
					}
				}
			}
		}
	}
</style>
