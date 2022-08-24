<template>
	<u-popup v-model="isVisible" mode="bottom" border-radius="26">
		<view class="popup-wrap">
			<view class="title">选择报告对比日期</view>
			<view class="content-wrap">
				<u-collapse :head-style="headStyle" :accordion="false">
					<u-collapse-item v-for="(item) in dateList" :title="item.actionTypeName"
						:key="item.actionTypeName">
						<view class="date-list">
							<view v-for="(item, index) in list" :key="index" class="item"
								:class="{'active': item.active}" @click="handleClick(item)">{{item.date}}</view>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>
			<!-- 按钮 -->
			<view class="btn-wrap">
				<text class="btn cancel-btn" @click="handleCancel">取消</text>
				<text class="btn sure-btn" @click="handleSubmit">开始对比</text>
			</view>
		</view>
	</u-popup>
</template>
<script>
	import {
		coachApi
	} from '@/http/api.js';
	export default {
		props: {
			show: {
				type: Boolean, //显示弹框
				default: false
			},
			limit: {
				type: Number, //可勾选的日期个数
				default: 2
			}
		},
		data() {
			return {
				isVisible: false,
				headStyle: {
					background: '#F3F3F3',
					borderBottom: '1rpx solid #fff',
					color: '#333',
					fontSize: '30rpx',
					fontWeight: 500,
					paddingLeft: '32rpx'
				},
				form: {
					eventDesc: ''
				},
				current: '',
				dateList: [],
				list: [{
						date: '1月1日',
						active: false
					},
					{
						date: '1月2日',
						active: false
					},
					{
						date: '1月3日',
						active: false
					},
					{
						date: '1月4日',
						active: false
					},
					{
						date: '1月5日',
						active: false
					},
					{
						date: '1月6日',
						active: false
					},
					{
						date: '1月1日',
						active: false
					},
					{
						date: '1月2日',
						active: false
					},
					{
						date: '1月3日',
						active: false
					},
					{
						date: '1月4日',
						active: false
					},
					{
						date: '1月5日',
						active: false
					},
					{
						date: '1月6日',
						active: false
					}
				],
				dateArr: []
			};
		},
		watch: {
			show() {
				this.isVisible = this.show;
			},
			isVisible() {
				this.$emit('update:show', this.isVisible);
			}
		},
		methods: {
			getCourseDetailList() {
				coachApi
					.getCourseDetailV2({
						bookingId: 353,
						trainType: 2
					})
					.then(res => {
						console.log('res', res);
						this.dateList = res.actionList;

						// this.isRequested = true //请求数据完毕
					});
			},
			handleCancel() {
				this.isVisible = false;
			},
			// 确认按钮
			handleSubmit() {
				if (this.dateArr.length < this.limit) {
					uni.showToast({
						title: `请选择${this.limit}个日期`,
						icon: 'none',
						duration: 2000
					});
					return false
				} else {
					this.$emit('getDate', this.dateArr);
					this.isVisible = false;
				}
			},
			handleClick(item) {
				console.log(item);
				this.current = item.date;
				// 未选中
				if (!item.active) {
					// 未超过限制数量
					if (this.dateArr.length < this.limit) {
						item.active = !item.active;
						this.dateArr.push(item);
					} else {
						(this.limit > 1) && uni.showToast({
							title: `只能选择${this.limit}个日期`,
							icon: 'none',
							duration: 2000
						});
						return false
					}
				} else {
					// 已选中-取消选中，并从dateArr中删除
					item.active = !item.active;
					this.dateArr.map((cur, index) => {
						if (item.date === cur.date) {
							console.log(item.date, cur.date);
							this.dateArr.splice(index, 1)
						}
					})
				}
				console.log('=====', this.dateArr);
				// 日期从大到小排序
			}
		},
		mounted() {
			this.current = '一级';
			this.isVisible = this.show;
			this.getCourseDetailList();
		}
	};
</script>

<style lang="scss">
	.popup-wrap {
		padding: 36rpx 0;

		.title {
			height: 48rpx;
			font-size: 34rpx;
			font-weight: 500;
			color: #333333;
			line-height: 48rpx;
			text-align: center;
		}

		// 内容
		.content-wrap {
			margin-top: 32rpx;
			height: 500rpx;
			overflow: auto;

			.date-list {
				// display: flex;
				// justify-content: space-between;
				// flex-wrap: wrap;
				display: grid;
				grid-template-columns: repeat(4, 153rpx);
				// grid-template-rows: repeat(4, 25%);
				// grid-row-gap: 24rpx; //属性设置行与行的间隔（行间距）
				// grid-column-gap: calc((100% - 120*4)/3)rpx;
				justify-content: space-between;
				max-height: 233rpx;
				overflow: auto;
				padding: 32rpx;

				.item {
					margin-bottom: 32rpx;
					box-sizing: border-box;
					width: 153rpx;
					height: 72rpx;
					line-height: 72rpx;
					border-radius: 8rpx;
					border: 2rpx solid #395771;
					color: #395771;
					font-size: 30rpx;
					font-weight: 400;
					text-align: center;
				}

				.active {
					background: #395771;
					color: #ffffff;
				}
			}
		}

		// 按钮
		.btn-wrap {
			display: flex;
			justify-content: space-around;
			font-weight: 400;
			padding: 36rpx 32rpx;

			.btn {
				width: 308rpx;
				line-height: 96rpx;
				border-radius: 48rpx;
				border: 2rpx solid #395771;
				color: #fff;
				font-size: 30rpx;
				font-weight: 500;
				text-align: center;
			}

			.cancel-btn {
				color: #395771;
			}

			.sure-btn {
				background-color: #395771;
			}
		}
	}
</style>
