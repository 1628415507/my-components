<!--
 * @Author: chenjianxin
 * @Date: 2020-07-22 14:43:55
 * @LastEditTime : 2021-12-10 10:55:49
 * @LastEditors  : yemaozi
 * @Description: 翻页
 * @FilePath     : \basic-info\src\components\one\YTPagination\src\main.vue
-->
<template>
  <div class="pagination">
    <el-pagination
      :page-size="pageData.pageSize"
      :page-sizes="DEV_CONFIG.DEFAULT_PAGE_SIZES || [10, 20, 30, 50, 100]"
      :current-page="pageData.pageIndex"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="setPageSize"
      @prev-click="setPageIndex"
      @next-click="setPageIndex"
      @current-change="setPageIndex"
      :total="pageData.total"
    >
    </el-pagination>
  </div>
</template>
<script>
import DEV_CONFIG from '@/config'

export default {
  name: 'YTPagination',
  data() {
    return {
      DEV_CONFIG
    }
  },
  props: {
    pageData: {
      require: true,
      type: Object
    }
  },
  methods: {
    setPageSize(pageSize) {
      this.$emit('sizeChange', pageSize)
    },
    setPageIndex(pageIndex) {
      this.$emit('indexChange', pageIndex)
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination {
  text-align: right;
  height: 60px;
  padding-top: 15px;
}
</style>
