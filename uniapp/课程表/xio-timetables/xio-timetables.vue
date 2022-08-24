<template>
	<view class="">
		<view class="timetable">
			<!-- header start -->
			<view class="header">
				<view class="header-item">
					<view class="">
						{{TodayMonth}}
					</view>
					<view class="">
						月
					</view>
				</view>
				<!-- 星期/日期 -->
				<view class="header-item" v-for="(item,idx) in week" :key="idx"
					:class="[ConfirmToday(CurrentWeekDateList[idx]) ? 'active' : '']">
					<!-- 星期 -->
					<view class="">
						{{item}}
					</view>
					<view class="header-item-date" :class="[ConfirmToday(CurrentWeekDateList[idx])? 'active' : '']">
						{{CurrentWeekDateList[idx]}}
					</view>
				</view>
			</view>
			<!-- header end -->

			<!-- aside start -->
			<view class="aside">

				<!-- asideleft start -->
				<view class="aside-subTitle">
					<view class="aside-subTitle-knob" v-for="(sub,subidx) in courseKnob" :key="subidx">
						{{sub}}
					</view>
				</view>
				<!-- asideleft end -->

				<!-- asideright start -->
				<view class="aside-content">
					<view class="aside-content-course" v-for="(item,idx) in TimetablesData" :key="idx">
						<view class="course" v-for="(item1,idx1) in item" :key="idx1"
							:style="{height: (item1.length * 106) +'rpx',background: item1.backgroundColor != 'none' ? (ConfirmToday(CurrentWeekDateList[idx]) ? palette[0] : item1.backgroundColor) : 'none'}"
							@click="clickEveryTable(idx,idx1,item1.length,item1)">
							<view class="name" v-if="item1.name && (item1.backgroundColor !== 'none') && item1.length">
								{{item1.name}}
							</view>
							<view class="close" style="" v-if="item1.name && item1.show"
								@click.stop="delete1(idx,idx1,item1.length)">
								<image src="./static/close.png" mode="" style="width: 50rpx;height: 50rpx;"></image>
							</view>
							<view class=""
								style="border-radius: 6rpx;background-color: #BFBFBF;width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;font-size: 45rpx;color: #fff;"
								v-if="!item1.name && item1.show">
								+
							</view>
							<view class="save" v-if="item1.name && item1.show" @click.stop="save(idx,idx1)">
								保存
							</view>
						</view>
					</view>
				</view>
				<!-- asideright end -->

			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'xieTimetables',
		data() {
			return {
				TimetablesData: [], //课程表列表
				saveIndex: [] //保存第二次点击跳转事件
			}
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
					return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
				}
			},
			// 调色板
			palette: {
				type: Array,
				default () {
					return ['#FD6565', '#389CFC'] //palette[0] 今天周几就是啥颜色  palette[1] 其余为啥颜色
				}
			},

			// 课表月份
			TodayMonth: {
				type: Number,
				default () {
					return (new Date().getMonth() + 1)
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
					]
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
					let myDate = new Date(MondayTime)
					myDate.setDate(myDate.getDate()); //设置日期
					let dateArray = [];
					for (var i = 0; i < 7; i++) {
						let month = myDate.getMonth() + 1; //月份
						let date = myDate.getDate(); //日期
						month < 10 ? (month = "0" + month) : month;
						date < 10 ? (date = "0" + date) : date;
						let dateTemp = month + "/" + date;
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
					this.TimetablesData1()
				},
				immediate: true,
				deep: true
			},
		},
		methods: {
			/**
			 * @description 判断是否为今天
			 * @param {Object} tod 日期 eg:'08/01'
			 */
			ConfirmToday(tod) {
				let data1 = new Date();
				let month = (data1.getMonth() + 1) < 10 ? '0' + (data1.getMonth() + 1) : data1.getMonth() + 1;
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
				this.commonClearFalse()
				this.TimetablesData.forEach((item, i) => {
					if (i == idx) {
						item.forEach((item1, i2) => {
							if (i2 == idx1) {
								item1.show = true
							}
						})
					}
				})

				this.$emit('clickEveryTable', {
					idx,
					idx1,
					length
				}); //idx: 二维数组的第几项  idx1:二维数组第几项的第几个 length:相同的课程有几个
				if (!course.name) {
					this.additem(idx, idx1)
				} else {
					this.saveIndex = []
					if (course.show) {
						console.log('1111111111')
						this.$emit('editItem', {
							week: Number(idx) + 1,
							first: Number(idx1) + 1,
							two: Number(idx1) + Number(course.length),
							length: course.length
						})
					}
				}
			},

			/**
			 * @description 保存第二次 如果点击相同的则跳转并且保存在一个数组  跳转 如果不在一列则情况
			 * @param {Object} idx 二维的第几个数组
			 * @param {Object} idx1 二维第几个数组的第几个
			 */
			additem(idx, idx1) {
				uni.setStorageSync('showsaveIndex', 1)
				// console.log(this.saveIndex)
				// 保存上一项idx和idx1  先比较idx 再比较idx1 如果为第二次情况操作
				if (this.saveIndex.length == 0) {
					this.saveIndex.push(idx, idx1)
				} else {
					if (this.saveIndex[0] == idx) {
						// 如果第一节相同然后跳转
						console.log(this.saveIndex)
						this.$emit('additem', {
							week: Number(idx) + 1,
							first: Number(this.saveIndex[1]) + 1,
							two: Number(idx1) + 1
						})
					} else {
						// 清空数据
						this.saveIndex = []
						this.saveIndex.push(idx, idx1)
					}
				}
			},

			/**
			 * @description 共同的方法 清空显示
			 */
			commonClearFalse() {
				this.TimetablesData.forEach((item, i) => {
					item.forEach((item1, i2) => {
						item1.show = false
					})
				})
			},

			/**
			 * @description 保存
			 * @param {Object} idx 二维的第几个数组
			 * @param {Object} idx1 二维第几个数组的第几个
			 */
			save(idx, idx1) {
				this.commonClearFalse()
				this.TimetablesData.forEach((item, i) => {
					if (i == idx) {
						item.forEach((item1, i2) => {
							if (i2 == idx1) {
								item1.show = false
							}
						})
					}

				})
			},

			/**
			 * @description 删除
			 * @param {Object} idx 二维的第几个数组
			 * @param {Object} idx1 二维第几个数组的第几个
			 * @param {Object} length 长度
			 */
			delete1(idx, idx1, length1) {
				let newArray = new Array(length1).fill('')
				this.Timetables[idx].splice(idx1, length1, ...newArray)
				this.$emit('deleteCurrentItem', {
					idx,
					idx1,
					length: length1
				}) //删除每一项
			},

			/**
			 * @description  处理课程信息
			 */
			TimetablesData1() {
				// 给等于今天的列设置颜色
				const getBackgroundColor = (index) => {
					return this.palette[1]
				}
				// 合并一个数据
				const listMerge = [];
				this.Timetables.forEach((list, i) => {
					if (!listMerge[i]) {
						listMerge[i] = []
					}
					list.forEach((item, index) => {
						// 每一项的第一个至今return;
						if (!index) {
							return listMerge[i].push({
								name: item,
								length: 1,
								backgroundColor: item == '' ? 'none' : getBackgroundColor(i),
								show: false
							})
						}
						// 判断item是否与上一个name相同 并且不为空进入
						if (item === listMerge[i][index - 1].name && item) {
							const sameIndex = listMerge[i][index - 1].sameIndex //判断上一个是否相同
							if (sameIndex || sameIndex === 0) {
								listMerge[i][sameIndex].length++ //上一项相同的值长度加一
								return listMerge[i].push({
									name: item,
									length: 0,
									sameIndex: sameIndex
								}) //继续保存上一个值
							}
							listMerge[i][index - 1].length++ //索引lenght加1
							return listMerge[i].push({
								name: item,
								length: 0,
								sameIndex: index - 1
							})
						} else {
							return listMerge[i].push({
								name: item,
								length: 1,
								backgroundColor: item === '' ? 'none' : getBackgroundColor(i),
								show: false
							})
						}
					})
				})
				// this.$nextTick(() => {
				this.TimetablesData = listMerge;
				// })
				console.log(listMerge)
			}
		},

	}
</script>
<style lang="scss" scoped>
	.timetable {
		width: 720rpx;
		margin: 0 auto;
	}

	.header {
		// padding-left: 88rpx;
		height: 74rpx;
		display: flex;
		align-items: center;
		background: #F5F7FA;
		border-bottom: 1px solid #EEEEEE;
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
		color: #389CFC;
	}

	.aside {
		width: 720rpx;
		display: flex;

		.aside-content {
			width: calc(720rpx - 90rpx);
			display: flex;

			.course {
				position: relative;
				// display: flex;
				// justify-content: center;
				// align-items: center;
				width: 90rpx;
				height: 106rpx;
				// margin: 5rpx;
				box-sizing: border-box;
				border-bottom: 1rpx solid #EEEEEE;
				border-radius: 6rpx;

				.name {
					padding: 20rpx;
					color: #fff;
					font-size: 18rpx;
					font-weight: 500;
				}

				.close {
					position: absolute;
					top: -4rpx;
					right: -6rpx;
					// transform: translate(50%,-50%);
				}

				.save {
					position: absolute;
					bottom: 0;
					border: 1rpx solid #389CFC;
					border-radius: 4rpx;
					border-top: 0;
					left: 0;
					font-size: 20rpx;
					background: #fff;
					color: #389CFC;
					width: 100%;
					text-align: center;
					border-radius: 6rpx;
				}

			}
		}

		.aside-subTitle {
			width: 90rpx;

			.aside-subTitle-knob {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 90rpx;
				height: 106rpx;
				border-bottom: 1px solid #EEEEEE;
			}
		}
	}

	.active {
		color: blue;
	}
</style>
