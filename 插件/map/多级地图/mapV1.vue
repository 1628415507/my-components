<template>
  <div
    class="map-wrap"
    v-loading="isLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.9)"
  >
    <!-- 按钮 -->
    <div class="button-list-wrap">
      <el-button
        :type="index === timeIndex ? 'primary' : ''"
        @click="timeIndex = index"
        size="mini"
        v-for="(item, index) in ['今日', '本月', '本年', '自定义']"
        :key="`button_${index}`"
        >{{ item }}</el-button
      >
      <el-date-picker
        v-if="timeIndex === TIME_STATUS.CUSTOM"
        v-model="timePick"
        class="date-picker-input"
        type="daterange"
        size="mini"
        range-separator="至"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-button
        type="primary"
        size="mini"
        @click="getMatchData"
        v-if="timeIndex === TIME_STATUS.CUSTOM"
        >确定</el-button
      >
    </div>
    <!-- 面包屑 -->
    <el-breadcrumb
      class="breadcrumb-wrap"
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="`breadcrumb${index}`"
        @click.native="reset(item, index)"
        >{{ item.data.name }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <!-- 右侧信息栏 -->
    <img
      class="info-button-wrap"
      src="@/assets/images/info.png"
      alt=""
      srcset=""
      @click="isShowInfo = !isShowInfo"
    />
    <!-- 右侧弹出信息 -->
    <div class="info-text-wrap" v-if="isShowInfo">
      <span
        class="info-text"
        v-for="item in areaData"
        :key="item.id"
      >
        {{ item.name }}:
        {{ item.value }}
        场
      </span>
    </div>
    <amap
      id="allmap"
      @update="update"
      @getData="updateData"
      ref="map"
      :form="form"
    ></amap>
    <!-- 右下角南海图例 -->
    <div class="example-wrap" v-show="breadcrumbList.length === 1">
      <img src="@/assets/images/explame.png" alt="" srcset="">
    </div>
  </div>
</template>

<script>
const TIME_STATUS = {
  DAY: 0,
  MONTH: 1,
  YEAR: 2,
  CUSTOM: 3,
}
const MAP_LEVEL = {
  COUNTRY: 0,
  PROVINCE: 1,
  CITY: 2,
}
// const _ = require('lodash')
import amap from '@/views/testmap/testmap'
export default {
  data() {
    return {
      isRenderMap: true,
      TIME_STATUS,
      MAP_LEVEL,
      timePick: [],
      breadcrumbList: [
        {
          data: {
            name: '中国',
          },
        },
      ],
      isShowInfo: false,
      timeIndex: -1,
      areaData: {},
      pointList: [],
      form: {
        cityCode: '',
        cityName: '',
        countryCode: '1',
        countryName: '中国',
        endDate: '',
        provinceCode: '',
        provinceName: '',
        startDate: '',
      },
      isLoading: false,
    }
  },
  components: {
    amap,
  },
  watch: {
    timeIndex() {
      if (this.timeIndex === TIME_STATUS.DAY) {
        let today = `${new Date().getFullYear()}-${
          (new Date().getMonth() + 1 < 10 ? '0' : '') +
          (new Date().getMonth() + 1)
        }-${new Date().getDate()}`
        this.form.startDate = today
        this.form.endDate = today
      } else if (this.timeIndex === TIME_STATUS.MONTH) {
        this.form = {
          ...this.form,
          ...this.getCurrentMonth(),
        }
      } else if (this.timeIndex === TIME_STATUS.YEAR) {
        this.form.startDate = `${new Date().getFullYear()}-01-01`
        this.form.endDate = `${new Date().getFullYear()}-12-31`
      } else if (this.timeIndex === TIME_STATUS.CUSTOM) {
        this.form.startDate = this.timePick[0]
        this.form.endDate = this.timePick[0]
      }
      this.reset(this.breadcrumbList[this.breadcrumbList.length - 1], this.breadcrumbList.length - 1)
    },
  },
  computed: {
    timeObj() {
      if (this.timeIndex === 0) {
        return {
          startDate: '',
          endDate: '',
        }
      }
      return {}
    },
  },
  methods: {
    // 获取本月信息
    getCurrentMonth() {
      let firstDate = new Date()
      let startDate =
        firstDate.getFullYear() +
        '-' +
        (firstDate.getMonth() + 1 < 10 ? '0' : '') +
        (firstDate.getMonth() + 1) +
        '-' +
        '01'
      //alert(firstDate.getFullYear()+"-"+((firstDate.getMonth()+1)<10?"0":"")+(firstDate.getMonth()+1)+"-"+"01");

      let date = new Date()
      let currentMonth = date.getMonth()
      let nextMonth = ++currentMonth
      let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
      let oneDay = 1000 * 60 * 60 * 24
      let lastDate = new Date(nextMonthFirstDay - oneDay)
      let endDate =
        lastDate.getFullYear() +
        '-' +
        (lastDate.getMonth() + 1 < 10 ? '0' : '') +
        (lastDate.getMonth() + 1) +
        '-' +
        (lastDate.getDate() < 10 ? '0' : '') +
        lastDate.getDate()
      return {
        startDate,
        endDate,
      }
    },
    // 初始化
    reset(params, index) {
      if (index === 0) {
        this.breadcrumbList = this.breadcrumbList.slice(0, 1)
        this.$nextTick(() => {
          this.$refs.map.renderCountry()
        })
      } else {
        this.breadcrumbList = this.breadcrumbList.slice(0, index)
        this.$refs.map.echartsMapClick(params)
      }
    },
    // 更新信息
    update(info) {
      if (this.breadcrumbList.length < 3) {
        this.breadcrumbList.push(info)
      }
    },
    updateData(data) {
      this.areaData = data
    }
  },
  mounted() {
    this.timeIndex = TIME_STATUS.MONTH
  },
}
</script>

<style lang="less" scoped>
/deep/ .el-loading-mask {
  z-index: 99999;
}
.map-wrap {
  position: relative;
  .info-button-wrap {
    position: absolute;
    top: 30px;
    right: 32px;
    z-index: 9999;
  }
  .info-text-wrap {
    position: absolute;
    top: 30px;
    right: 80px;
    z-index: 9999;
    width: 400px;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    box-shadow: 0px 2px 6px 0px rgba(0, 165, 161, 0.15);
    border-radius: 5px;
    .info-text {
      width: 50%;
      display: inline-block;
      font-size: 14px;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #333333;
      line-height: 30px;
    }
  }
  .button-list-wrap {
    position: absolute;
    top: 30px;
    left: 32px;
    z-index: 9999;
  }
  .date-picker-input {
    margin: 0 20px;
  }
  .breadcrumb-wrap {
    position: absolute;
    top: 80px;
    left: 52px;
    z-index: 9999;
    cursor: pointer;
  }
  .example-wrap {
    position: absolute;
    bottom: 30px;
    right: 132px;
    z-index: 9999;
    width: 200px;
    height: 50px;
    background: #fff;
    img{
      width: 70px;
    }
  }
}
#allmap {
  box-sizing: border-box;
  border: 32px solid #fff;
  // border-top: 100px solid #fff;
  border-radius: 12px 12px 0px 0px;
  width: 100%;
  margin-top: 40px;
  position: relative;
  background: #fff;
}
</style>
