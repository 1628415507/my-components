<template>
	<view class="course-make-page">
		<view class="form-box">
			<!-- 基本信息 -->
			<view class="flex-betweens">
				<view class="flex coach-top">
					<u-avatar class="img" size="100" :src="osimgUrl+coachInfo.headUrl" mode="circle"></u-avatar>
					<view>
						<view class="name-box">{{coachInfo.coachName||'-'}}</view>
						<view> {{coachInfo?$util.dicShow('COACH_TYPE',coachInfo.coachType):'-' }}</view>
					</view>
				</view>
				<view @click="gotoDetail">
					<text style="margin-right: 16rpx; color: #006088;">教练详情</text>
					<u-icon name="arrow-right" color="#006088" size="28"></u-icon>
				</view>
			</view>
			<!-- 预约表单 -->
			<u-form :model="form" ref="uForm" label-width="auto">
				<!-- 预约时间 -->
				<u-form-item label="预约时间" prop="subscribeTime" right-icon="arrow-right">
					<turn-time :dataList="subscribeTimeList" :subscribeTime.sync='form.subscribeTime'
						@openSheet="openSheet('时间', 'subscribeTime')"></turn-time>
				</u-form-item>
				<!-- <u-form-item v-else label="预约时间">
					<u-input placeholder="暂无可选时间" disabled />
				</u-form-item> -->
				<!-- 选择课程 -->
				<u-form-item label="选择课程" prop="courseName" right-icon="arrow-right">
					<u-input v-model="form.courseName" type="select" placeholder="点击选择"
						@click="openSheet('课程', 'courseName')" />
				</u-form-item>
				<!-- <u-form-item v-else label="选择课程">
					<u-input placeholder="暂无可选课程" disabled />
				</u-form-item> -->
				<!-- 课程价格 -->
				<u-form-item label="课程价格 (元)">
					<u-input v-model.number="form.courseFee" disabled placeholder="自动获取金额"
						placeholder-style="color:red;" />
				</u-form-item>
				<!-- 场馆地址 -->
				<u-form-item label="场馆地址" prop="venueName" right-icon="arrow-right">
					<u-input v-model="form.venueName" type="select" placeholder="点击选择"
						@click="openSheet('场馆', 'venueName')" />
				</u-form-item>
				<!-- <u-form-item v-else label="场馆地址">
					<u-input placeholder="暂无地址" disabled />
				</u-form-item> -->
			</u-form>
		</view>
		<u-button type="primary" class="save-btn" @click="saveFun">立即预约</u-button>
		<!--  操作菜单 -->
		<u-select :default-value="defaultArr" v-if="showSheet" v-model="showSheet" :list="sheetList"
			@confirm="sheetChange"></u-select>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		studentApi
	}
	from '@/http/api.js'
	export default {
		computed: {
			// Vuex 取出State的值
			...mapState(['userObj', 'osimgUrl'])
		},
		data() {
			return {
				params: {
					coachId: '',
					studentId: '',
					bookStartTime: '',
					bookEndTime: '',
					subscribeTime: '',
					courseId: '',
					venueId: '',
				},
				coachInfo: {}, //教练信息
				date: '', //预约时间-天
				subscribeTimeList: [], //预约时间列表
				coachCourseList: [], //预约课程列表
				venueList: [], //场馆地址列表
				sheetList: [],
				showSheet: false,
				sheetType: null,
				defaultArr: [1], //如设置default-value为[1]表示默认选中第2个(从0开始)
				form: {
					subscribeTime: '',
					courseName: '',
					courseFee: '',
					venueName: ''
				},
				rules: {
					subscribeTime: [{
						required: true,
						message: '请选择预约时间',
						trigger: ['change', 'blur']
					}],
					courseName: [{
						required: true,
						message: '请选择课程',
						trigger: ['change', 'blur']
					}],
					venueName: [{
						required: true,
						message: '请选择场馆',
						trigger: ['change', 'blur']
					}],
				}
			};
		},
		methods: {
			// 打开交互窗
			openSheet(type, itemName) {
				this.showSheet = true
				this.sheetType = type
				switch (type) {
					case '时间':
						console.log(this.subscribeTimeList, 's时间')
						this.sheetList = this.subscribeTimeList
						break
					case '课程':
						this.sheetList = this.coachCourseList
						break
					case '场馆':
						this.sheetList = this.venueList
						break
					default:
						break
				}
				let data = this.form[itemName]
				// 打开时第几项被选中
				if (data) {
					this.sheetList.map((item, index) => {
						if (item.label === data) {
							this.defaultArr = [index]
						}
					})
				} else {
					this.defaultArr = [0] // 默认第一次打开选中第一个：
				}
			},
			// 下拉回调
			sheetChange(data) {
				switch (this.sheetType) {
					case '时间':
						this.form.subscribeTime = data[0].label
						this.timeConfirm(this.form.subscribeTime)
						break
					case '课程':
						this.form.courseName = data[0].label
						this.params.courseId = data[0].value
						this.coachCourseList.map(item => {
							if (item.value === data[0].value) this.form.courseFee = item.courseFee.toString()
						})
						break
					case '场馆':
						this.form.venueName = data[0].label
						this.params.venueId = data[0].value
						break
					default:
						break
				}
			},
			gotoDetail() {
				uni.navigateTo({
					url: `/pages/student/coach-make/detail?coachId=${this.params.coachId}&&isback=2`
				})
			},
			saveFun() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						let item = JSON.stringify(this.params)
						let arr = [{
							'a': '课程名称',
							'b': this.form.courseName
						}, {
							'a': '预约时间',
							'b': this.params.bookStartTime
						}, {
							'a': '课程价格',
							'b': this.form.courseFee
						}, {
							'a': '教练名称',
							'b': this.coachInfo.coachName
						}, {
							'a': '教练类型',
							'b': this.coachInfo ? this.$util.dicShow('COACH_TYPE', this.coachInfo
								.coachType) : '-'
						}, {
							'a': '场馆地址',
							'b': this.form.venueName
						}]
						arr = JSON.stringify(arr)
						uni.navigateTo({
							url: './order?item=' + item + '&del=' + arr
						})
					} else {
						console.log('验证失败');
					}
				});
			},
			formatArr(arr, type) {
				let newArr = []
				if (type === "course") {
					newArr = arr.map(item => {
						return {
							value: item.id,
							label: item.courseName,
							courseFee: item.courseFee
						}
					})
				}
				type === "venue" && newArr.push({
					value: arr.id,
					label: arr.venueAddress,
				})
				return newArr
			},
			// 时间格式拆解
			timeConfirm(time) {
				let data = time.split('-')
				this.params.bookStartTime = `${this.date} ${data[0]}:00`
				this.params.subscribeTime = this.params.bookStartTime
				this.params.bookEndTime = `${this.date} ${data[1]}:00`
			},
			getData(pms, msg = '') {
				return new Promise((resolve, reject) => {
					pms.then(res => {
						resolve(res);
					}).catch((err) => {
						resolve(msg)
					})
				})
			},
			getDataList() {
				Promise.all([
					// 获取-教练详情
					this.getData(studentApi.coachDetail({
						coachId: this.params.coachId
					})),
					// 获取-预约时间
					this.getData(studentApi.subscribeTimeList({
						coachId: this.params.coachId,
						subscribeTime: this.date
					})),
					// 获取-预约课程
					this.getData(studentApi.coachCourseList({
						coachId: this.params.coachId
					})),
					// 获取-场馆地址
					this.getData(studentApi.venueList())
				]).then(res => {
					let [coachInfo, subscribeTimeList, coachCourseList, venueList] = res
					this.coachInfo = coachInfo || {}
					this.subscribeTimeList = this.turnTime(subscribeTimeList) || []
					// this.turnTime(subscribeTimeList).then(res => {y
					// 	this.subscribeTimeList = res || []
					// })
					this.coachCourseList = coachCourseList ? this.formatArr(coachCourseList, 'course') : []
					this.venueList = venueList ? this.formatArr(venueList, 'venue') : []
					if (this.venueList.length === 1) {
						this.form.venueName = this.venueList[0].label
						this.params.venueId = this.venueList[0].value
					}
				}).catch((err) => {
					console.log('getDataList-出错啦', err);
				})
			},
			// 时间格式转换
			turnTime(arr) {
				// return new Promise((resolve, reject)=>{
				//     let timeData = []
				//     timeData = arr.map((dataItme, index) => {
				//     	let obj = {
				//     		value: index + 1,
				//     		label: dataItme
				//     	}
				//     	return obj
				//     })
				//     resolve(timeData)
				// });
				let timeData = []
				timeData = arr.map((dataItme, index) => {
					let obj = {
						value: index + 1,
						label: dataItme
					}
					return obj
				})
				return timeData
			}
		},
		onLoad(opt) {
			this.params.studentId = this.userObj.objectId
			this.params.coachId = opt.coachId
			this.date = opt.subscribeTime
			this.getDataList()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onShow() {}
	}
</script>

<style lang="scss">
	.course-make-page {
		.form-box {
			padding: 0 28rpx;
			background-color: white;

			.u-input {
				text-align: right !important;
			}

			.u-input__input {
				padding-right: 10rpx;
			}

			.u-form-item--left__content__label {
				min-width: 220rpx;
			}

			.coach-top {
				align-items: center;

				.name-box {
					font-size: 32rpx;
					font-weight: 600;
					margin-bottom: 8rpx;
				}

				.img {
					margin-right: 14rpx;
				}
			}

			.flex-betweens {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 32rpx 0 40rpx 0;
			}
		}

		.save-btn {
			button {
				width: 694rpx;
				margin: 96rpx auto;
			}
		}

		.u-input__right-icon--select {
			display: none;
		}

		.label-box {
			.u-form-item--left__content__label {
				max-width: 500rpx;
			}
		}
	}
</style>
