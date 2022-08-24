<template>
  <div class="tree-item">
    <div v-for="item in treeData" :key="item.id">
      <hr />
      <div class="item-title">
        {{ item.name }}
        <div>
          <el-radio v-model="radio" label="label"></el-radio>
        </div>
        <div>
          <el-input v-model="aa" placeholder=""></el-input>
        </div>
      </div>
      <div v-if="item.children && item.children.length" class="item-childen">
        <my-tree :treeData="item.children"></my-tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "myTree",
  props: {
    treeData: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-item {
  .item-title {
    padding: 4px 8px;
  }
  .item-childen {
    padding-left: 20px;
  }
}
</style>

作者：前端阿飞 链接：https://juejin.cn/post/7056922161788747789 来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
