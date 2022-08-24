<!--
 * @Author: Hongzhifeng
 * @Date: 2022-06-10 14:05:56
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-06-15 14:32:37
 * @Description: 
-->
<template>
	<view>
		<view class="top-wrap">
			<view class="calendar-wrap">
				<zzx-calendar @selected-change="datechange" @days-change="mouthChange" :showBack="true" :dotType="1">
				</zzx-calendar>
			</view>
		</view>

		<time-tables :timetables="timeTables"></time-tables>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import TimeTables from './timetables/timetables';
	import {
		timeList
	} from './timetables/testdata.js';
	export default {
		components: {
			TimeTables
		},
		data() {
			return {
				// 	const colorInfo = {
				// 	'未开始': "#F55545", 1//
				// 	'进行中': '#DA9D7E', //2
				// 	'待评价': '#DA9D7E', //'3'
				// 	'已完成': '#4E8070', //4
				// 	'已结束': '#999999', //5
				// 	'已取消': '#F55545' //-1
				// }
				timeTables: timeList
			};
		},
		computed: {
			// Vuex 取出State的值
			...mapState(['userObj']),
		},
		methods: {
			// 选完日历
			datechange(e) {},
			// 月份切换(获取当月有预约的日期)
			mouthChange(data) {
				// let start = this.$moment(data.start).format("YYYY-MM")
				// let end = this.$moment(data.end).format("YYYY-MM")
				// let timeArr = []
				// this.dotList = []
				// if (start === end) {
				// 	timeArr = [start]
				// } else {
				// 	timeArr = [start, end]
				// }
				// timeArr.map(lis => {
				// 	studentApi.getBookingDate({
				// 		month: lis,
				// 		studentId: this.studentId,
				// 	}).then(res => {
				// 		res.map(item => {
				// 			this.dotList.push({
				// 				date: item
				// 			})
				// 		})
				// 	})
				// })
			},
			getInfo() {
				api.timetablesList({
					coachId: this.userObj.objectId,
					startDate: '2022-06-13',
					endDate:  '2022-06-19',
				}).then(res => {

				})
			},
		},
		onLoad() {
			this.getInfo()
		}
	};
</script>

<style lang="scss">
	.top-wrap {
		background: #fff;

		.calendar-wrap {
			margin-left: 95rpx;
			width: 83%;
		}
	}
</style>
