/*
 * @Author: Hongzf
 * @Date: 2022-08-01 13:52:08
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-08-25 16:24:11
 * @Description:
 */
// 编辑
export const formRules = (_this) => {
  const validateTechnicalTitle = (rule, value, callback) => {
    if (!_this.formData.staffDutyId) {
      callback(new Error('请先选择入职岗位'));
    } else if (value === '') {
      callback(new Error('请选择岗位职称'));
    } else {
      callback();
    }
  };
  return {
    name: [
      {
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
      }
    ],
    idCard: [
      {
        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
        message: '身份证号格式错误',
        trigger: 'blur'
      }
    ],
    mobile: [
      {
        required: true,
        message: '请输入联系电话',
        trigger: 'blur'
      },
      {
        pattern: /^1(3|4|5|7|8|9)\d{9}$/,
        message: '手机号格式错误',
        trigger: 'blur'
      }
    ],
    sex: [
      {
        required: true,
        message: '性别不能为空',
        trigger: 'change'
      }
    ],
    email: [
      {
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: '电子邮箱格式错误',
        trigger: 'blur'
      }
    ],
    jobStatus: [
      {
        required: true,
        message: '在职状态不能为空',
        trigger: 'change'
      }
    ],
    seniority: [
      {
        required: true,
        message: '请输入工作年限',
        trigger: 'blur'
      },
      {
        pattern: /^[0-9]*$/,
        message: '请输入数字',
        trigger: 'blur'
      }
    ],
    entryDate: [
      {
        required: true,
        message: '请选择入职时间',
        trigger: 'change'
      }
    ],
    uemDeptId: [
      {
        required: true,
        message: '请选择入职部门',
        trigger: 'change'
      }
    ],
    staffDutyId: [
      {
        required: true,
        message: '请选择入职岗位',
        trigger: 'change'
      }
    ],
    technicalTitleId: [
      {
        required: true,
        validator: validateTechnicalTitle,
        trigger: 'change'
      }
    ],
    projectId: [
      {
        required: true,
        message: '请选择归属项目',
        trigger: 'change'
      }
    ]
  }
};

const commonRules = {
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    }
  ],
  sex: [
    {
      required: true,
      message: '性别不能为空',
      trigger: 'change'
    }
  ],
  entryDate: [
    {
      required: true,
      message: '请选择入职时间',
      trigger: 'change'
    }
  ],
  jobStatus: [
    {
      required: true,
      message: '在职状态不能为空',
      trigger: 'change'
    }
  ],
  deptName: [
    {
      required: true,
      message: '请选择入职部门',
      trigger: 'change'
    }
  ],
  staffDuty: [
    {
      required: true,
      message: '请选择入职岗位',
      trigger: 'change'
    }
  ]
}
// 转正
export const regularFormRules = {
  ...commonRules,
  offerDate: [
    {
      required: true,
      message: '请选择转正日期',
      trigger: 'change'
    }
  ],
  offerType: [{
    required: true,
    message: '请选择转正类型',
    trigger: 'change'
  }],
  faceScore: [
    {
      required: true,
      message: '请输入转员工答辩成绩',
      trigger: 'blur'
    }
  ],
  interviewerId: [
    {
      required: true,
      message: '请选择面谈人',
      trigger: 'change'
    }
  ],
  approver: [
    {
      required: true,
      message: '请选择审批人',
      trigger: 'change'
    }
  ]
}
// 离职、辞退
export const dissmissFormRules = {
  ...commonRules,
  // 离职
  leaveDate: [
    {
      required: true,
      message: '请选择离职日期',
      trigger: 'change'
    }
  ],
  leaveReason: [
    {
      required: true,
      message: '请输入离职原因',
      trigger: 'blur'
    }
  ],
  // 辞退
  dismissReason: [
    {
      required: true,
      message: '请输入辞退原因',
      trigger: 'blur'
    }
  ],
  dismissDate: [
    {
      required: true,
      message: '请选择辞退日期',
      trigger: 'change'
    }
  ]
};

export const dissmissFormConfig = (_this) => {
  return {
    ref: 'dataForm',
    inline: true,
    flexWrap: true,
    col: 12,
    labelWidth: '100px',
    // style: 'width: 100%;',
    formItemList: [
      {
        label: '姓名:',
        prop: 'name',
        type: 'input',
        placeholder: '请输入姓名',
        width: '180px',
        clearable: true
      },
      {
        label: '性别:',
        prop: 'sex',
        type: 'radio',
        radioLabel: 'label',
        radioValue: 'value',
        radioArr: [
          {
            value: false,
            disabled: false,
            label: '男'
          },
          {
            value: true,
            disabled: false,
            label: '女'
          }
        ]
      // changeSelect: (optionVal, item, index) => {
      //   console.log(optionVal, item, index);
      // }
      },
      {
        // col: 12,
        type: 'datePicker',
        subType: 'date',
        label: '入职时间:',
        prop: 'entryDate',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        placeholder: '请选择入职时间',
        width: '180px !important',
        clearable: true
      },
      {
        label: '在职状态:',
        prop: 'jobStatus',
        type: 'radio',
        radioLabel: 'label',
        radioValue: 'value',
        // 在职状态 （0：试用员工 1：正式员工 2：离职员工）
        radioArr: _this.$dict.getDictOptions('JOB_STATUS').filter(item => item.value.toString() === '0' || item.value.toString() === '1')
      // changeSelect: (optionVal, item, index) => {
      //   console.log(optionVal, item, index);
      // }
      },
      {
        label: '入职部门:',
        prop: 'deptName',
        type: 'input',
        placeholder: '请输入入职部门',
        width: '180px',
        disabled: true
      },
      {
        label: '入职岗位:',
        prop: 'staffDuty',
        type: 'input',
        placeholder: '请输入入职岗位',
        width: '180px',
        disabled: true
      },
      //  ====== 离职 Start =====
      {
        show: _this.type === 'quit',
        col: 24,
        label: '离职日期:',
        prop: 'leaveDate',
        type: 'datePicker',
        subType: 'date',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        placeholder: '请选择离职日期',
        width: '180px !important',
        clearable: true
      },
      {
        show: _this.type === 'quit',
        col: 24,
        label: '离职原因:',
        prop: 'leaveReason',
        type: 'textarea',
        placeholder: '请输入离职原因',
        width: '500px !important',
        clearable: true,

        autoSize: { minRows: 2, maxRows: 4 }
      },
      //  ====== 离职 End =====
      //  ====== 辞退 Start =====
      {
        show: _this.type === 'dismiss',
        col: 24,
        label: '辞退日期:',
        prop: 'dismissDate',
        type: 'datePicker',
        subType: 'date',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        placeholder: '请选择辞退日期',
        width: '180px !important',
        clearable: true
      },
      {
        show: _this.type === 'dismiss',
        col: 24,
        label: '辞退原因:',
        prop: 'dismissReason',
        type: 'textarea',
        placeholder: '输入辞退原因',
        width: '500px !important',
        clearable: true,
        autoSize: { minRows: 2, maxRows: 4 }
      },
      {
        show: _this.type === 'dismiss',
        col: 24,
        label: '附件:',
        prop: 'dismissApplication',
        type: 'customSlot'// 自定义插槽
      }
      //  ====== 辞退 End =====
    ]
  }
}
