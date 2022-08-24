<template>
	<u-popup v-model="isVisible" mode="bottom" border-radius="26">
		<view class="popup-wrap">
			<view class="title">{{title}}</view>
			<view v-if="yearList.length" class="content-wrap">
				<scroll-view :style="{height:'500rpx',width:'100%'}" scroll-y="true">
					<u-collapse :head-style="headStyle" :accordion="false">
						<u-collapse-item v-for="(item1) in yearList" :title="item1.year" :key="item1.year">
							<scroll-view :style="{width:'100%'}" scroll-y="true">
								<view class="date-list">
									<view v-for="(item2) in item1.dates" class="item" :key="item2.date"
										:class="{'active': item2.active}" @click="handleClick(item2)">{{item2.dateTxt}}
									</view>
								</view>
							</scroll-view>
						</u-collapse-item>
					</u-collapse>
				</scroll-view>
			</view>
			<data-empty v-else margin="0"></data-empty>
			<!-- 按钮 -->
			<view class="btn-wrap">
				<text class="btn cancel-btn" @click="handleCancel">取消</text>
				<text class="btn sure-btn" @click="handleSubmit">{{limit===1?'查看报告':'开始对比'}}</text>
			</view>
		</view>
	</u-popup>
</template>
<script>
	import {
		api
	} from '@/http/apiV2.js';
	export default {
		props: {
			show: {
				type: Boolean, //显示弹框
				default: false
			},
			limit: {
				type: Number, //可勾选的日期个数
				default: 1
			},
			title: {
				type: String, //弹框标题
				default: '选择报告日期'
			},
			studentId: {
				type: String, //弹框标题
				default: '1'
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
				list: [],
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
		computed: {
			// 日期
			yearList: function() {
				let arr = this.list.map((item) => {
					const dates = item.dates.map(dateNum => {
						return {
							date: dateNum,
							dateTxt: this.$moment(dateNum).format('MM月DD日'), //日期文本
							active: false //选中状态
						};
					});
					return {
						...item,
						dates: dates //覆盖原来的dates
					};
				});
				return arr;
			}
		},
		methods: {
			getDateList() {
				api.historyReportDates({
					studentId: this.studentId
				}).then(res => {
					this.list = res;
				});
			},
			// 取消按钮
			handleCancel() {
				this.isVisible = false;
			},
			//日期从小到大排序
			sortDownDate(a, b) {
				return Date.parse(a.date) - Date.parse(b.date);
			},
			// 确认按钮
			handleSubmit() {
				if (this.dateArr.length < this.limit) {
					const tip = this.limit === 1 ? '请选择报告日期！' : '请选择两份报告进行对比！'
					uni.showToast({
						title: tip,
						icon: 'none',
						duration: 2000
					});
					return false;
				} else {
					// 日期排序/提取日期
					const arr = this.dateArr.sort(this.sortDownDate).map(item => {
						return item.date
					})
					this.$emit('getDate', arr)
					this.isVisible = false
				}
			},
			// 选择日期
			handleClick(item) {
				// 单选
				if (this.limit === 1) {
					this.dateArr.map((cur, index) => {
						if (item.date !== cur.date) {
							cur.active = false
							this.dateArr.splice(index, 1) //从dateArr中删除
						}
					});
					item.active = true; //变为选中状态
					this.dateArr.push(item);
				} else {
					// 多选
					// 未选中
					if (!item.active) {
						// 未超过限制数量
						if (this.dateArr.length < this.limit) {
							item.active = !item.active; //变为选中状态
							this.dateArr.push(item);
						} else {
							uni.showToast({
								title: `只能选择${this.limit}个日期`,
								icon: 'none',
								duration: 2000
							});
							return false;
						}
						// 已选中
					} else {
						// 取消选中，并从dateArr中删除
						item.active = !item.active; //取消选中状态
						this.dateArr.map((cur, index) => {
							if (item.date === cur.date) {
								this.dateArr.splice(index, 1); //从dateArr中删除
							}
						});
					}
				}
			}
		},
		mounted() {
			this.getDateList();
			this.isVisible = this.show;
		}
	};
</script>

<style lang="scss" scoped>
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

			// 隐藏滚动条
			::-webkit-scrollbar {
				width: 0;
				height: 0;
				color: transparent;
			}

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
				// height: 333rpx;
				max-height: 333rpx;
				// overflow: auto;
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
