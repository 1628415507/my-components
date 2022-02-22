<!--
 * @Author: Hongzf
 * @Date: 2021-09-28 16:05:21
 * @LastEditTime: 2021-09-28 16:39:40
 * @LastEditors: Hongzf
 * @Description: In User Settings Edit
 * @FilePath: \office-material-web\src\views\procurementManage\orderManage\components\editPage.vue
-->
<template>
  <div>
    <button @click="handleDialogVisible">添加物资</button>
    <MaterialList
      v-if="dialogVisible"
      :isVisible.sync="dialogVisible"
    ></MaterialList>
  </div>
</template>

<script>
    import MaterialList from '@/components/currentSystem/MaterialList'

    export default {
        components: { MaterialList },
        data () {
            return {
                dialogVisible: false
            }
        },
        methods: {
            handleDialogVisible () {
                this.dialogVisible = true
            }
        }
    }
</script>

<style>
</style>
