<template>
	<view class="lottery_container">
		<view class="grid_wrap">
			<view class="lottery_wrap">
				<ul class="lottery_grid">
					<li v-for="(item, index) in grid_info_arr" :class="{ active: current_index == index && index != 8 }"
						:key="index" @click="luck_draw" :data-index="index">
						<!-- 礼物 -->
						<image v-if="index != 8" class="grid_img" mode='aspectFit'
							:src="(current_index == index && index != 8)?lightImg:item.logo" alt=""/>
							<!-- <image v-if="index != 8" class="grid_img" mode='aspectFit' :src="item.logo" alt=""> -->
							<!-- {{ index == 8 ? '抽奖' : index+1 }} -->
							<!-- 开始抽奖 -->
						<image v-if="index == 8" class="grid_img " mode='aspectFit' :src="drawStartImg" alt="开始抽奖"/>
					</li>
				</ul>
			</view>
			<!-- 外围边框 -->
			<!-- <view class="lottery_wrap_border">
				<ul v-for="(item, index) in 4" :key="index">
					<li v-for="(item, index) in 12" :key="index"></li>
				</ul>
			</view> -->
		</view>
		<!-- 抽奖完成弹出的窗口 -->
		<!-- <view class="lottery_finish_wrap">
			
		</view> -->
	</view>

</template>

<script>
	import LotteryDraw from './SJ-LotteryDraw.js';
	const luckdrawSrc = "../../static/img/luck-draw/luckdraw-dark.png"
	let grid_info = [{
			logo: luckdrawSrc,
			text: "手机"
		},
		{
			logo: luckdrawSrc,
			text: "零食包"
		},
		{
			logo: luckdrawSrc,
			text: "口红"
		},
		{
			logo: luckdrawSrc,
			text: "谢谢参与"
		},
		{
			logo: luckdrawSrc,
			text: "压缩饼干"
		},
		{
			logo: luckdrawSrc,
			text: "水杯"
		},
		{
			logo: luckdrawSrc,
			text: "QQ糖"
		},
		{
			logo: luckdrawSrc,
			text: "耳机"
		},
		{
			logo: luckdrawSrc,
			text: "谢谢参与"
		},
	];
	export default {
		data() {
			return {
				current_index: -1,
				lightImg: require('@/static/img/luck-draw/luckdraw-light.png'),
				drawStartImg: require('@/static/img/luck-draw//draw-start.png'),
			};
		},
		props: {
			grid_info_arr: {
				type: Array,
				default: function() {
					return grid_info
				}
			},
		},
		onLoad() {},

		methods: {
			luck_draw(event) {
				let index = event.currentTarget.dataset.index;
				let that = this;
				if (index == 8) {
					// 点击抽奖之后知道获奖位置，修改父组件中lottery_draw_param的值
					this.$emit('get_winingIndex', function(res) {
						console.log(res);
						let lottery_draw_param = res;
						let win = new LotteryDraw({
								domData: that.grid_info_arr,
								...lottery_draw_param
							},
							function(index, count) {
								that.current_index = index;
								console.log()
								if (lottery_draw_param.winingIndex == index && lottery_draw_param.totalCount ==
									count) {
									that.$emit('luck_draw_finish', that.grid_info_arr[index])
									// console.log('抽到了')
								}
							}
						);
					});

				}
			}
		}
	};
</script>

<style scoped lang="scss">
	@import './SJ-LotteryDraw.scss';
</style>
