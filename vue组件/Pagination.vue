<!--
 * @Author: your name
 * @Date: 2021-07-09 10:43:12
 * @LastEditTime: 2021-07-14 11:47:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \athletics-synthesize-web\components\Pagination.vue
-->
<template>
  <div class="pagination">
    <el-pagination
      v-if="total > 0"
      prev-text="上一页"
      next-text="下一页"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      :current-page.sync="curpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      require: true,
      default: 0,
    },
    size: {
      // 每页显示条数
      type: Number,
      require: true,
      default: 10,
    },
    currentpage: {
      type: Number,
      require: true,
      default: 1,
    },
  },
  data() {
    return {
      curpage: 1,
    }
  },
  watch: {
    // 监听页数变化
    currentpage(newval, oldval) {
      this.curpage = newval
      // console.log('currentpage', newval, oldval)
    },
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.$emit('update:currentpage', this.curpage) // 传递页数变化时调用的方法
      this.$emit('change-page', val) // 传递当前页数
    },
  },
}
</script>

<style lang="less" scoped>
.pagination {
  margin-top: 60px;
  // background-color: #bfa;
  display: flex;
  height: 40px;
  justify-content: center;
  /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: @colorB;
    color: #fff;
  }
  /deep/ .el-pagination {
    button {
      border: 1px solid #808081;
      padding: 0 6px;
      background: 0 0;
      height: 26px;
      line-height: 26px;
      box-sizing: content-box;
      span {
        font-size: 14px;
        color: #666;
      }
    }
    .el-pager {
      li {
        min-width: 22px;
        width: 22px;
        height: 26px;
        line-height: 26px;
        background: #fff;
        box-sizing: border-box;
        border-radius: 0;
        color: #666;
        padding: 0;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}
</style>
