<!--
 * @Author: Hongzhifeng
 * @Date: 2022-04-30 16:27:57
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-05-07 14:21:37
 * @Description: 横向轮播
-->

<template>
  <div class="swiper-page">
    <div v-swiper:mySwiper="swiperOption" class="swiper-container">
      <div
        :class="[
          'swiper-wrapper',
          videoList && videoList.length ? '' : 'no-data',
        ]"
      >
        <div
          v-for="(item, index) in videoList"
          :key="index"
          class="swiper-slide"
        >
          <div class="slide-item">
            <div class="video-wrap">
              <video
                :src="item.filePath"
                class="video"
                width="303px"
                height="200px"
                controls="controls"
              >
                您的浏览器不支持视频播放
              </video>
              <div class="mask">
                <el-image
                  class="img"
                  :src="require('@/assets/images/play-icon.png')"
                  @click="handleFormVisible(item)"
                ></el-image>
              </div>
            </div>
            <div :title="item.fileName" class="item-title">
              {{ item.fileName }}
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-style"></div>
      <div slot="button-prev" class="swiper-button-prev"></div>
      <div
        slot="button-next"
        class="swiper-button-next swiper-button-hidden"
      ></div>
    </div>
    <!-- 弹框 -->
    <VideoPlay
      v-if="dialogVisible"
      :isVisible.sync="dialogVisible"
      :title="title"
      :editData="editData"
    ></VideoPlay>
  </div>
</template>

<script>
import VideoPlay from '@/components/videoplay-dialog'
export default {
  components: { VideoPlay },

  props: {
    isVisible: {
      type: Boolean,
    },
    videoList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      editData: {},
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          bulletClass: 'my-bullet-swiper', // 自定义设置默认类名
          bulletActiveClass: 'my-bullet-active-swiper', // 自定义滑块活跃类名
          clickable: true, // 点击当前滑块切换到对应的轮播图片
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hiddenClass: 'swiper-button-hidden', //隐藏按钮
        },
        // autoplay: {
        //   delay: 2000,
        // },
        autoplay: false, //设置为true启动自动切换，并使用默认的切换设置。
        paginationClickable: true,
        speed: 800,
        // loop: true,
        observer: true,
        observeParents: true,
        autoplayDisableOnInteraction: true, //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
        slidesPerView: 'auto', //设置slider容器能够同时显示的slides数量(carousel模式)。
        slidesPerGroup: 4, //一次循环四个、在carousel mode下定义slides的数量多少为一组。
        loopedSlides: 1,
        loopFillGroupWithBlank: true, //在loop 模式下，将用空白slide 填充slide 数量不足的组。需要与  slidesPerGroup 一起使用。
      },
    }
  },
  computed: {
  },
  mounted() {},
  methods: {
    handleFormVisible(item) {
      this.editData = item
      this.dialogVisible = true
    },
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.swiper-page {
  overflow: hidden;
  width: calc(100% - 108px);
  // margin: 0 50px;
  // width: calc(100% - 110px);
  margin: 0 70px;
  box-sizing: border-box;
  z-index: 100;
  .swiper-container {
    .swiper-wrapper {
      min-height: 200px;
      .swiper-slide {
        width: 303px;
        margin-right: 30px;
        .slide-item {
          width: 303px;
          // cursor: pointer;
          .video-wrap {
            width: 303px;
            height: 200px;
            position: relative;
            video::-webkit-media-controls-enclosure {
              display: none;
            }
            .mask {
              position: absolute;
              top: 0;
              left: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              border-radius: 8px;
              background: rgba(0, 0, 0, 0.1);
              .img {
                cursor: pointer;
              }
            }
            .video {
              position: relative;
              // z-index: 100000;
              width: 100%;
              height: 100%;
              border-radius: 8px;
              background: #f1f3f4;
            }
          }
          .item-title {
            margin-top: 20px;
            height: 20px;
            font-size: 16px;
            font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 1px;
            width: 100%;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .swiper-button-next:after,
    .swiper-rtl .swiper-button-prev:after {
      content: 'next';
      color: #ffffff;
      z-index: 999999;
    }
    .swiper-button-prev:after,
    .swiper-rtl .swiper-button-next:after {
      content: 'prev';
      color: #ffffff;
      z-index: 999999;
    }
    .swiper-button-hidden {
      // display: none;
    }
  }
}
</style>
