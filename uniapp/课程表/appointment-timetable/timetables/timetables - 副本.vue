<template>
	<view class="">
		<view class="timetable">
			<!-- header start -->
			<view class="header">
				<view class="header-item">
					<view class="">
						{{ TodayMonth }}
					</view>
					<view class="">
						月
					</view>
				</view>
				<!-- 星期/日期 -->
				<view class="header-item" v-for="(weekItem, idx) in week" :key="idx"
					:class="[ConfirmToday(CurrentWeekDateList[idx]) ? 'active' : '']">
					<view class="">
						{{ weekItem }}
					</view>
					<view class="header-item-date" :class="[ConfirmToday(CurrentWeekDateList[idx]) ? 'active' : '']">
						{{ CurrentWeekDateList[idx] }}
					</view>
				</view>
			</view>
			<!-- header end -->

			<!-- 时间表 start -->
			<view class="content-wrap">
				<!-- 左侧时间列 start -->
				<view class="left-wrap">
					<view class="left-wrap-knob" v-for="(timeItem, subidx) in courseKnob" :key="subidx">
						{{ timeItem }}
					</view>
				</view>
				<!-- 左侧时间列 end -->

				<!-- 右侧课程表 start -->
				<view class="right-wrap">
					<view class="right-wrap-course" v-for="(courseList, idx) in TimetablesData" :key="idx">
						<view v-for="(courseItem, courseIdx) in courseList" :key="courseIdx" class="course-item" :style="{
                                height: (courseItem.count * 61-1) + 'rpx',
                                background: courseItem.backgroundColor,
                            }">
							<view v-if="courseItem.name && courseItem.backgroundColor !== 'none' && courseItem.count">
								<view class="name"> {{ courseItem.name }} </view>
								<view class="status"> {{ $util.dicShow('BOOKING_STATUS', courseItem.status) }} </view>
							</view>
						</view>
					</view>
				</view>
				<!-- 右侧课程表 end -->
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'timetables',
		data() {
			return {
				TimetablesData: [], //课程表列表
				saveIndex: [] //保存第二次点击跳转事件
			};
		},
		props: {
			// 星期列表 不传默认为当前月份
			week: {
				type: Array,
				default () {
					return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
				}
			},

			// 每天的上的节数
			courseKnob: {
				type: Array,
				default () {
					// return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
					return [
						'09:00', '09:30',
						'10:00', '10:30',
						'11:00', '11:30',
						'12:00', '12:30',
						'13:00', '13:30',
						'14:00', '14:30',
						'15:00', '15:30',
						'16:00', '16:30',
						'17:00', '17:30',
						'18:00', '18:30',
					];
				}
			},
			// 调色板
			palette: {
				type: Array,
				default () {
					return ['#FD6565', '#389CFC']; //palette[0] 今天周几就是啥颜色  palette[1] 其余为啥颜色
				}
			},

			// 课表月份
			TodayMonth: {
				type: Number,
				default () {
					return new Date().getMonth() + 1;
				}
			},

			// 课程表 默认二维数组
			Timetables: {
				type: Array,
				default () {
					return [
						['', '', '', '英语', '', '', '', '', '', ''],
						['', '', '', '', '', '', '', '', '', ''],
						['', '', '', '', '', '', '', '', '', ''],
						['', '', '', '', '', '', '', '', '', ''],
						['', '', '', '', '', '', '', '', '', ''],
						['', '', '', '', '', '', '', '', '', ''],
						['', '', '', '', '', '', '', '', '', '']
					];
				}
			},

			// 日期列表
			CurrentWeekDateList: {
				type: Array,
				default () {
					let now = new Date();
					let nowTime = now.getTime(); //当前距离1970毫秒数
					let day = now.getDay(); //当期是周几 // Sunday - Saturday : 0 - 6
					const oneDayTime = 24 * 60 * 60 * 1000; //一天的毫秒数
					let MondayTime = nowTime - (day - 1) * oneDayTime; //周一的日期
					let myDate = new Date(MondayTime);
					myDate.setDate(myDate.getDate()); //设置日期
					let dateArray = [];
					for (var i = 0; i < 7; i++) {
						let month = myDate.getMonth() + 1; //月份
						let date = myDate.getDate(); //日期
						month < 10 ? (month = '0' + month) : month;
						date < 10 ? (date = '0' + date) : date;
						let dateTemp = month + '/' + date;
						dateArray.push(dateTemp);
						myDate.setDate(myDate.getDate() + 1);
					}
					// 返回所有的日期列表dateArray
					return dateArray;
				}
			}
		},
		watch: {
			Timetables: {
				handler(val) {
					this.TimetablesData1();
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			/**
			 * @description 判断是否为今天
			 * @param {Object} tod 日期 eg:'08/01'
			 */
			ConfirmToday(tod) {
				let data1 = new Date();
				let month = data1.getMonth() + 1 < 10 ? '0' + (data1.getMonth() + 1) : data1.getMonth() + 1;
				let date = data1.getDate() < 10 ? '0' + data1.getDate() : data1.getDate();
				let TodayDate = month + '/' + date;
				if (TodayDate == tod) {
					return true;
				} else {
					return false;
				}
			},

			/**
			 * @description 点击每一项
			 * @param {Object} idx 二维的第几个数组
			 * @param {Object} idx1 二维第几个数组的第几个
			 * @param {Object} length 相同课程的长度
			 * @param {Object} course 二维数组的详细内容
			 */
			clickEveryTable(idx, idx1, length, course) {
				// console.log({idx,idx1,length})
				this.commonClearFalse();
				this.TimetablesData.forEach((item, i) => {
					if (i == idx) {
						item.forEach((item1, i2) => {
							if (i2 == idx1) {
								item1.show = true;
							}
						});
					}
				});

				this.$emit('clickEveryTable', {
					idx,
					idx1,
					length
				}); //idx: 二维数组的第几项  idx1:二维数组第几项的第几个 length:相同的课程有几个
				if (!course.name) {
					this.additem(idx, idx1);
				} else {
					this.saveIndex = [];
					if (course.show) {
						console.log('1111111111');
						this.$emit('editItem', {
							week: Number(idx) + 1,
							first: Number(idx1) + 1,
							two: Number(idx1) + Number(course.length),
							length: course.length
						});
					}
				}
			},

			/**
			 * @description 保存第二次 如果点击相同的则跳转并且保存在一个数组  跳转 如果不在一列则情况
			 * @param {Object} idx 二维的第几个数组
			 * @param {Object} idx1 二维第几个数组的第几个
			 */
			additem(idx, idx1) {
				uni.setStorageSync('showsaveIndex', 1);
				// console.log(this.saveIndex)
				// 保存上一项idx和idx1  先比较idx 再比较idx1 如果为第二次情况操作
				if (this.saveIndex.length == 0) {
					this.saveIndex.push(idx, idx1);
				} else {
					if (this.saveIndex[0] == idx) {
						// 如果第一节相同然后跳转
						console.log(this.saveIndex);
						this.$emit('additem', {
							week: Number(idx) + 1,
							first: Number(this.saveIndex[1]) + 1,
							two: Number(idx1) + 1
						});
					} else {
						// 清空数据
						this.saveIndex = [];
						this.saveIndex.push(idx, idx1);
					}
				}
			},

			/**
			 * @description 共同的方法 清空显示
			 */
			commonClearFalse() {
				this.TimetablesData.forEach((item, i) => {
					item.forEach((item1, i2) => {
						item1.show = false;
					});
				});
			},
			/**
			 * @description  处理课程信息
			 */
			TimetablesData1() {
				const colorInfo = {
					1: '#4E8070', //1未开始
					2: '#DA9D7E', //2进行中
					5: '#999999', //5已结束
					0: '#F55545' //-1已取消
				};
				// 合并一个数据
				const listMerge = [];
				// 遍历传进来的数据
				this.Timetables.forEach((list, i) => {
					// 初始化
					if (!listMerge[i]) {
						listMerge[i] = [];
					}
					let curMergeItemIndex = 0 //指向当前的merge列表项
					// 遍历每一列的数据
					list.forEach((item, index) => {
						const id = item.id;
						const studentName = item.studentName;
						const backgroundColor = item.status == -1 ? colorInfo[0] : colorInfo[item.status];
						const status = item.status;
						// 每一项的第一个直接push;
						if (index === 0) {
							listMerge[i].push({
								...item,
								name: studentName,
								count: 1,//表示占几格
								backgroundColor,
								show: false
							});
							curMergeItemIndex++; //push完指针下移
						} else {
							const preItem = list[index - 1] //上一个id
							const curMergeItem = listMerge[i][curMergeItemIndex - 1]
							// 判断item的id是否与上一个item的id相同
							if (id && id === preItem?.id && curMergeItem.id) {
								console.log('preItem', preItem.studentName, preItem);
								console.log('curItem', studentName, listMerge[i][
									index - 1
								]);
								console.log('======================', curMergeItem);
								curMergeItem.count++; //id相同合并，个数count+1
							} else {
								// console.log('不与上一个name相同', studentName, backgroundColor, "===");
								listMerge[i].push({
									...item,
									name: studentName,
									count: 1,
									backgroundColor,
									show: false,
									status
								});
								curMergeItemIndex++; //push完指针下移
							}
						}
					});
				});
				// this.$nextTick(() => {
				this.TimetablesData = listMerge;
				// })
				console.log(listMerge);
			}
		}
	};
</script>
<style lang="scss" scoped>
	page {
		background: #f8f9fa;
	}

	.timetable {
		width: 720rpx;
		margin: 0 auto;
	}

	.header {
		// padding-left: 88rpx;
		height: 74rpx;
		display: flex;
		align-items: center;
		background: #f5f7fa;
		// border-bottom: 1px solid #eeeeee;
	}

	.header-item {
		// flex: 1;
		width: 90rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		font-weight: 500;
		text-align: center;
	}

	.header-item-date {
		font-size: 20rpx;
		color: #333333;
		font-weight: 500;
	}

	.today {
		color: #389cfc;
	}

	.content-wrap {
		width: 720rpx;
		padding: 30rpx 0;
		display: flex;

		// 左侧时间列
		$leftWidth: 90rpx;

		.left-wrap {
			margin-top: -31rpx;
			width: $leftWidth;
			border-right: 1rpx solid #D1D1D1;

			.left-wrap-knob {
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
				width: $leftWidth;
				height: 61rpx;
				// width: 66px;
				// height: 37px;
				font-size: 26rpx;
				font-weight: 500;
				color: #333333;
				// line-height: 37px;
				// border-bottom: 1rpx dashed #c8c8c9;
			}
		}

		// 右侧课程表
		.right-wrap {
			display: flex;
			width: calc(720rpx - $leftWidth);


			// 课程项
			$courseItemWidth: 88rpx;

			.course-item {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;
				box-sizing: border-box;
				width: $courseItemWidth;
				min-height: 61rpx;
				border-bottom: 1rpx dashed #c8c8c9;
				color: #fff;
				font-size: 20rpx;
				font-weight: 400;
				text-align: center;

				&:first-child {
					border-top: 1rpx dashed #c8c8c9;
				}

				.name {
					box-sizing: border-box;
					width: $courseItemWidth;
					padding: 0 5rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}


	}

	.active {
		color: blue;
	}
</style>
