<template>
  <div>
    <button @click="handleDialogVisible">打开弹框</button>
    <BaseDialog
      v-if="dialogVisible"
      :isVisible.sync="dialogVisible"
    ></BaseDialog>
  </div>
</template>

<script>
    import BaseDialog from '@/components/currentSystem/base-dialog'

    export default {
        components: { BaseDialog },
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
