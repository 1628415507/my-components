<template>
	<view class="">
		<!-- 时间表 start -->
		<view class="time-table">
			<!-- 左侧时间列 start -->
			<view class="left-wrap">
				<view v-for="(timeItem, timeIndex) in courseKnob" :key="timeIndex" class="left-wrap-knob" >
					{{ timeItem }}
				</view>
			</view>
			<!-- 左侧时间列 end -->
			<!-- 右侧课程表 start -->
			<view class="right-wrap">
				<view class="right-wrap-course" v-for="(courseList, idx) in timeTablesData" :key="idx">
					<view v-for="(courseItem, courseIdx) in courseList" :key="courseIdx" class="course-item" :style="{
                            height: courseItem.count * 61 - courseItem.count + 'rpx',
                            background: courseItem.backgroundColor
                        }">
						<view v-if="courseItem.name && courseItem.backgroundColor && courseItem.count">
							<view class="name"> {{ courseItem.name }} </view>
							<view class="status"> {{ $util.dicShow('BOOKING_STATUS', courseItem.status) }} </view>
						</view>
					</view>
				</view>
			</view>
			<!-- 右侧课程表 end -->
		</view>
	</view>
</template>
<script>
	export default {
		name: 'timetables',
		data() {
			return {};
		},
		props: {
			// 左侧列表
			courseKnob: {
				type: Array,
				default () {
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
			// 课程表 默认二维数组
			timetables: {
				type: Array,
				default: () => []
			},
		},
		watch: {
			timetables: {
				handler(val) {},
				immediate: true,
				deep: true
			}
		},
		computed: {
			/**
			 * @description  处理课程信息
			 */
			timeTablesData() {
				const colorInfo = {
					1: '#4E8070', //1未开始
					2: '#DA9D7E', //2进行中
					5: '#999999', //5已结束
					0: '#F55545' //-1已取消
				};
				const listMerge = []; // 合并一个数据
				// 遍历传进来的数据
				this.timetables.forEach((list, i) => {
					// 初始化
					if (!listMerge[i]) {
						listMerge[i] = [];
					}
					let curMergeItemIndex = 0 //指向当前的merge列表项
					// 遍历每一列的数据
					list.forEach((item, index) => {
						const id = item.id;
						const itemInfo = {
							...item,
							id, //标识
							name: item.studentName,
							backgroundColor: item.status == -1 ? colorInfo[0] : colorInfo[
								item.status], //当前项的背景颜色
							count: 1, //表示占几格，默认占一格
							status: item.status
						}
						// 每一项的第一个直接push;
						if (index === 0) {
							listMerge[i].push(itemInfo);
							curMergeItemIndex++; //push完merge指针下移
						} else {
							const preItem = list[index - 1] //上一个id
							const curMergeItem = listMerge[i][curMergeItemIndex - 1]
							// 判断item的id是否与上一个item的id相同,相同则合并，count+1
							if (id && id === preItem?.id && curMergeItem.id) {
								// console.log('preItem', preItem.studentName, preItem);
								// console.log('curItem', studentName, listMerge[i][
								// 	index - 1
								// ]);
								// console.log('======================', curMergeItem);
								curMergeItem.count++; //id相同合并，个数count+1
							} else {
								// console.log('不与上一个name相同', studentName, backgroundColor, "===");
								listMerge[i].push(itemInfo);
								curMergeItemIndex++; //push完merge指针下移
							}
						}
					});
				});
				// console.log(listMerge);
				return listMerge
			}
		},
		methods: {}
	};
</script>
<style lang="scss" scoped>
	page {
		background: #f8f9fa;
	}

	.time-table {
		width: 720rpx;
		margin: 0 auto;
		padding: 30rpx 0;
		display: flex;

		// 左侧时间列
		$leftWidth: 90rpx;

		.left-wrap {
			margin-top: -31rpx;
			width: $leftWidth;
			border-right: 1rpx solid #d1d1d1;

			.left-wrap-knob {
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
				width: $leftWidth;
				height: 61rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: #333333;
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
</style>
