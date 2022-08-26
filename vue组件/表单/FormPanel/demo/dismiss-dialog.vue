<!--
 * @Author: Hongzf
 * @Date: 2022-08-05 21:05:06
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-08-25 16:23:42
 * @Description:
-->

<template>
  <div class="dismiss-dialog">
    <el-dialog
      :title="'员工'+dialogTitle"
      v-bind="$attrs"
      width="750px"
      center
      :close-on-click-modal="false"
      top="10vh"
      z-index="10000"
      :append-to-body="true"
      destroy-on-close
      v-on="$listeners"
    >
      <form-panel
        ref="formPanel"
        :form-config="formConfig"
        :dialog-status="type"
        :value="formData"
        :rules="rules"
      >
        <!-- 附件 -->
        <template #dismissApplication="scope">
          <Upload :upload-data.sync="uploadData" :file-info="scope.item.dismissApplication" />
        </template>
      </form-panel>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="medium"
          @click="handleConfirm"
        >提交</el-button>
        <el-button
          type="primary"
          :plain="true"
          size="medium"
          @click="close"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryStaffInfo, saveResignInfo, saveDismissInfo } from '@/api/staff-manage';
import { dissmissFormRules, dissmissFormConfig } from './dialog-config';

// import StaffDuty from '@/components/CurrentSystem/StaffDuty.vue'
// import Department from '@/components/CurrentSystem/Department.vue'
import Upload from './Upload.vue'
import formPanel from './FormPanel';
// import { queryTechnicalNameBySelect } from '@/api/select-02';

export default {
  components: { Upload, formPanel },
  props: {
    // 编辑信息
    editData: {
      type: Object,
      default: () => {}
    },
    // 弹窗类型
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formConfig: dissmissFormConfig(this),
      uploadData: {
        systemId: process.env.VUE_APP_SYSTEMID, // 写死
        fileName: '',
        fileType: '',
        uemUserId: '',
        type: '辞退申请表'
      },
      rules: dissmissFormRules, // 验证规则
      formData: {
        uemUserId: '',
        name: '',
        sex: '',
        entryDate: '', // 入职时间
        jobStatus: '', // 在职状态（0：试用员工 1：正式员工 2：离职员工）
        deptName: '', // 部门名称
        uemDeptId: '', // 入职部门
        staffDuty: '', // 岗位名称
        staffDutyId: '' // 入职岗位
        // 离职
        // leaveDate: '', // 离职时间
        // leaveReason: ''
        // 辞退
        // dismissDate: '', // 辞退时间
        // dismissReason: '',
        // dismissApplication: ''// 文件key
      }
    };
  },
  computed: {
    // 弹框标题
    dialogTitle() {
      // console.log('【 this.editData 】-246', this.type, this.editData);
      const titleInfo = {
        'quit': '离职',
        'dismiss': '辞退'
      }
      return titleInfo[this.type]// '编辑员工信息' : '新增用户';
    }
  },
  watch: {},
  created() {
    this.getDetailInfo()
    this.uploadData.uemUserId = this.editData.uemUserId
  },
  mounted() {
  },
  methods: {
    // 关闭弹框
    close() {
      this.$emit('update:visible', false);
      this.$refs['formPanel'].$refs['dataForm'].resetFields();
    },
    // 获取用户信息
    getDetailInfo() {
      queryStaffInfo({
        uemUserId: this.editData.uemUserId
      }).then(result => {
        const res = result
        for (const key in this.formData) {
          if (key === 'sex') {
            const sex = res[key]
            this.formData[key] = sex // === true ? true : (sex === false ? false : '')
          } else {
            this.formData[key] = res[key] || ''
          }
        }
      });
    },
    // 提交表单信息
    handleConfirm() {
      this.$refs['formPanel'].$refs['dataForm'].validate((valid) => {
        if (valid) {
          const funcInfo = {
            'quit': saveResignInfo,
            'dismiss': saveDismissInfo
          }
          const funcName = funcInfo[this.type]
          funcName(this.formData
          ).then(res => {
            this.$message.success(res.data);
            this.$emit('getTableData', '');
            this.close();
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.dismiss-dialog {
  // 底部按钮
  .dialog-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    .el-button--default.el-button--mini {
      min-width: 92px;
    }
  }
}
</style>
