<!--
 * @Author: Hongzhifeng
 * @Date: 2022-04-30 16:27:57
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-05-07 14:20:49
 * @Description: 纵向轮播
-->

<template>
  <div :class="['swiper-page', dataList && dataList.length ? '' : 'no-data']">
    <!-- 多于15条数据 -->
    <div v-if="dataList && dataList.length > limit">
      <div v-swiper:mySwiper="swiperOption" class="swiper-container">
        <div class="swiper-wrapper">
          <div
            v-for="(item, index) in dataList"
            :key="index"
            class="swiper-slide"
          >
            <div
              class="slide-item"
              @click="$router.push(`/matchDetail/${item.id}`)"
              :title="item.matchName"
            >
              {{ item.matchName }}
            </div>
          </div>
        </div>
        <!-- <div class="swiper-pagination swiper-pagination-style"></div> -->
        <!-- <div slot="button-prev" class="swiper-button-prev"></div> -->
        <!-- <div
        slot="button-next"
        class="swiper-button-next swiper-button-hidden"
      ></div> -->
      </div>
    </div>
    <!-- 少于17条 -->
    <div v-else class="list-wrap">
      <div v-for="(item, index) in dataList" :key="index">
        <div
          class="slide-item"
          @click="$router.push(`/matchDetail/${item.id}`)"
          :title="item.matchName"
        >
          {{ item.matchName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apis from '@/apis'
export default {
  props: {
    paramsInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      limit: 15,
      dataList: [],
      swiperOption: {
        direction: 'vertical',
        speed: 800,
        // pagination: {
        //   el: '.swiper-pagination',
        //   bulletClass: 'my-bullet-swiper', // 自定义设置默认类名
        //   bulletActiveClass: 'my-bullet-active-swiper', // 自定义滑块活跃类名
        //   clickable: true, // 点击当前滑块切换到对应的轮播图片
        // },
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        //   hiddenClass: 'swiper-button-hidden', //隐藏按钮
        // },
        // autoplay: false, //设置为true启动自动切换，并使用默认的切换设置。
        autoplay: {
          delay: 1000,
          pauseOnMouseEnter: true, //开启此功能，鼠标置于swiper时暂停自动切换，鼠标离开时恢复自动切换。
          stopOnLastSlide: false,
          disableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
        },
        // autoplayDisableOnInteraction: false, //在低版本swiper中想使用disableOnInteraction: false的话，应该写成这个，用户操作swiper之后，是否禁止autoplay。默认为true：停止。
        // paginationClickable: true,
        loop: true,
        // loopAdditionalSlides: 0, //loop 模式下会在slides 前后复制若干个slide ，前后复制的个数不会大于原来的总个数。
        observer: true,
        observerUpdate: true, //当同一个元素多次改变时，observer 只会在结束时响应一次。例如隐藏元素的同时新增一个他的子元素。
        observeParents: true,
        onSlideChangeEnd: function (swiper) {
          swiper.update() //更新Swiper，这个方法包含了updateContainerSize，updateSlidesSize，updateProgress，updatePagination，updateClasses方法。也就是数据改变是重新初始化一次swiper；
          swiper.reLoop() //重新对需要循环的slide个数进行计算，当你改变了slidesPerView参数时需要用到，需要自动轮播的时候必须要加上；
          swiper.startAutoplay() //重新开始自动切换；
        },
        slidesPerView: 17, //'auto', //设置slider容器能够同时显示的slides数量(carousel模式)。
        slidesPerGroup: 1, //一次循环四个、在carousel mode下定义slides的数量多少为一组。
        // loopedSlides: 5,//超出几个停止
        // loopFillGroupWithBlank: false, //在loop 模式下，将用空白slide 填充slide 数量不足的组。需要与  slidesPerGroup 一起使用。
      },
    }
  },
  watch: {
    paramsInfo: {
      immediate: true,
      deep: true,
      handler(newVal) {
        newVal.startDate && this.getData()
      },
    },
  },
  computed: {},
  mounted() {},
  methods: {
    getData() {
      // TODO
      this.$http
        .post(
          apis._apis_api_games_matchinfo_getMatchInfoByMapData,
          this.paramsInfo
        )
        .then((res) => {
          if (res.data.code === 200) {
            this.dataList = res.data.data
          }
        })
    },
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.swiper-page {
  overflow: hidden;
  width: 100%;
  height: 600px;
  box-sizing: border-box;
  .swiper-container {
    // height: 600px;
    .swiper-wrapper {
      height: 600px;
      .swiper-slide {
        width: 100%;
        height: 60px;
      }
    }
    // .swiper-button-next:after,
    // .swiper-rtl .swiper-button-prev:after {
    //   content: 'next';
    //   color: #ffffff;
    //   z-index: 999999;
    // }
    // .swiper-button-prev:after,
    // .swiper-rtl .swiper-button-next:after {
    //   content: 'prev';
    //   color: #ffffff;
    //   z-index: 999999;
    // }
    // .swiper-button-hidden {
    //   // display: none;
    // }
  }
  .list-wrap {
    // margin-top: -16px;
  }
  // 公共样式
  .slide-item {
    width: 100%;
    // background: #bcf;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    &:before {
      content: '';
      margin-right: 6px;
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #00a5a1;
      border-radius: 2px;
      vertical-align: middle;
    }
    &:hover {
      color: #00a5a1;
    }
  }
}
</style>
