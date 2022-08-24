/*
 * @Author: Hongzf
 * @Date: 2022-08-02 10:15:04
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-08-24 11:05:19
 * @Description:
 */

export const filterConfig = _this => {
  return {
    inline: false,
    gutter: 3, // 栅格的间隔
    col: 6, // 栅格的格数
    operateCol: 24,
    labelWidth: '100px',
    filterList: [
      {
        type: 'select',
        label: '用户类型',
        prop: 'userType',
        width: '200px',
        placeholder: '请选择用户类型',
        col: 8,
        optionLabel: 'label',
        optionValue: 'value',
        optionKey: 'value',
        options: _this.$dict.getDictOptions('USER_TYPE_CN'),
        changeSelect: optionVal => {
          _this.filterForm.userType = optionVal || 1;
          _this.handleUserTypeChange(optionVal)
        }
      },
      {
        type: 'input',
        label: '标题',
        prop: 'taskTitle',
        width: '200px',
        clearable: true,
        placeholder: '请输入标题',
        col: 8
      },
      {
        type: 'select',
        label: '任务状态',
        prop: 'status',
        width: '200px',
        clearable: true,
        placeholder: '请选择任务状态',
        col: 8,
        optionLabel: 'label',
        optionValue: 'value',
        optionKey: 'value',
        options: [
          { value: '', label: '全部' },
          ..._this.$dict.getDictOptions('MY_TASK_STATUS')
        ],
        changeSelect: optionVal => {
          _this.filterForm.status = optionVal;
        }
      }
    ],
    operates: [
      {
        type: 'primary',
        buttonLabel: '查询',
        btnType: 'primary',
        method: () => {
          _this.handleQuery();
        }
      }
      // {
      //   type: 'primary',
      //   buttonLabel: '重置',
      //   btnType: 'primary',
      //   plain: true,
      //   method: () => {
      //     _this.resetQueryForm(_this.filterForm);
      //   }
      // }
    ]
  };
};

// table 的配置参数
export const tableConfig = {
  border: true,
  stripe: true, // 是否为斑马纹 table
  loading: false, // 是否添加表格loading加载动画
  highlightCurrentRow: true, // 是否支持当前行高亮显示
  mutiSelect: false, // 是否支持列表项选中功能
  indexShow: true,
  pagination: true,
  height: '350px'
};

// 表格列
export const columns = _this => {
  return [
    {
      prop: 'taskTitle',
      label: '任务标题',
      customSlot: true // 自定义插槽
      // render: (h, ctx) => {
      //   // console.log('【 h, ctx 】-121', h, ctx)
      //   return h(
      //     'el-button',
      //     {
      //       props: {
      //         type: 'text',
      //         size: 'small'
      //         // ghost: true
      //       },
      //       on: {
      //         click: () => {
      //           _this.handleOpen(ctx.row, 'edit');
      //         }
      //       }
      //     },
      //     ctx.row.taskTitle// 文本值
      //   );
      // }
    },
    {
      prop: 'taskType',
      label: '任务类型'
    },
    {
      prop: 'publishDate',
      label: '发布日期'
    },
    {
      prop: 'planEndDate',
      label: '计划完成日期',
      width: '120px'
    },
    {
      prop: 'dispatchersName',
      label: '任务创建人',
      width: '120px'
    },
    {
      prop: 'status',
      label: '任务状态',
      formatter: (row, column) => {
        return _this.$dict.getDictNameByCode('MY_TASK_STATUS', row.status)
      }
    },
    {
      prop: 'endDate',
      label: '完成时间'
    }
  ];
};

export const operates = _this => {
  return {
    list: [
      { show: false }
    ],
    fixed: false,
    width: 200
  };
};
