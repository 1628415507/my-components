/*
 * @Description:
 * @Date: 2023-01-31 10:58:23
 * @LastEditors: Hongzf
 * @LastEditTime: 2023-05-23 15:57:17
 */

// 表格表单
export const formColumns = _this => {
  return [
    {
      type: 'select',
      required: true,
      prop: 'dictItemId',
      nameProp: 'carbonResource',
      label: '碳源类型',
      optionLabel: 'itemName',
      optionValue: 'id',
      optionKey: 'id',
      options: [],
      changeSelect: (val, row, rowIndex) => {
        _this.handleCarbonTypeChange(rowIndex)
      }
    },
    {
      type: 'customSlot',
      required: true,
      prop: 'dictItemConfigId',
      nameProp: 'carbonResourceName',
      label: '碳源名称'
    },
    {
      type: 'input',
      prop: 'workmanshipDetailValue',
      label: '单位产品平均用量',
      required: true,
      maxlength: 15,
      columnMinWidth: '150px',
      blur: (val, row, rowIndex) => {
        _this.handleInputBlur(val, rowIndex)
      },
      change: (val, row, rowIndex) => {
        _this.handleInputChange(val, rowIndex)
      },
      input: (val, row, rowIndex) => {
        _this.floatInputChange(val, _this.formData.tableData[rowIndex], 'workmanshipDetailValue')
      },
      hidden: () => {
        const type = _this.provideInfo.productionLineAuditFlag
        return type.toString() !== '1'
      }
    },
    {
      type: 'input',
      prop: 'directPickingDeplete',
      label: '直采消耗量', // 直采法显示
      maxlength: 15,
      change: (val, row, rowIndex) => {
        _this.handleInputChange(val, rowIndex)
      },
      input: (val, row, rowIndex) => {
        _this.floatInputChange(val, _this.formData.tableData[rowIndex], 'directPickingDeplete')
      },
      hidden: () => {
        const type = _this.provideInfo.productionLineAuditFlag
        return type.toString() === '1'// ? averageColumns(this) : directColumns(this)
      }
    },
    {
      type: 'input',
      prop: 'workmanshipDetailUnit',
      label: '计量单位',
      columnMinWidth: '140px',
      required: true,
      disabled: true
    },
    {
      type: 'customSlot',
      required: true,
      prop: 'carbonFactor',
      label: '碳因子',
      tipShow: true,
      tipContent: '当碳源类型选择温室气体时，碳因子对应GWP-100值'
    },
    {
      type: 'input',
      prop: 'carbonFactorUnit',
      label: '碳因子单位',
      columnMinWidth: '200px',
      required: true,
      disabled: true,
      // 1.
      // rules: [{ validator: (rule, value, callback) => _this.validateCarbonUnitMethod(rule, value, callback, _this.formData.tableData[0]), trigger: ['blur', 'change'] }]
      // 2.
      rules: (row, rowIndex) => {
        return [{ validator: (rule, value, callback) => _this.validateCarbonUnitMethod(rule, value, callback, _this.formData.tableData[rowIndex]), trigger: ['blur', 'change'] }]
      }
      // 3.
      // rules: (rule, value, callback, row, rowIndex) => {
      //   _this.validateCarbonUnitMethod(rule, value, callback, row)
      // },
    },
    {
      type: 'input',
      prop: 'workmanshipDetailDensity',
      label: '碳源密度',
      required: true,
      disabled: true
    },
    {
      type: 'input',
      prop: 'densityUnit',
      label: '密度单位',
      columnMinWidth: '140px',
      required: true,
      disabled: true
    },
    {
      type: 'input',
      prop: 'workmanshipDetailCarbonValue',
      label: `功能单位碳排放量(kgCO2e${_this.provideInfo.productionLineAuditFlag === '2' ? '' : '/' + _this.materialUnit})`,
      maxlength: 15,
      columnMinWidth: '240px',
      disabled: true
    },
    {
      type: 'input',
      prop: 'workmanshipDetailRemark',
      label: '备注',
      maxlength: 40
    }
  ]
}
// 表格表单
export const outsourcingFormColumns = _this => {
  return [
    {
      type: 'select',
      required: true,
      prop: 'dictItemId',
      // nameProp: 'carbonResource',
      label: '碳排数据来源',
      optionLabel: 'configName',
      optionValue: 'id',
      optionKey: 'id',
      options: _this.$dict.getDictOptions('CARBON_DATA_SOURCE')
    },
    {
      type: 'input',
      required: true,
      prop: 'workmanshipDetailCarbonValue',
      label: `功能单位碳排放量(kgCO2e${_this.provideInfo.productionLineAuditFlag === '2' ? '' : '/' + _this.materialUnit})`,
      maxlength: 15,
      columnMinWidth: '160px',
      input: (val, row, rowIndex) => {
        _this.floatInputChange(val, _this.formData.tableData[rowIndex], 'workmanshipDetailCarbonValue')
      }
    },
    {
      type: 'input',
      prop: 'workmanshipDetailRemark',
      label: '备注',
      maxlength: 40
    }
  ]
}
// table 的配置参数
export const tableConfig = {
  border: true,
  stripe: false, // 是否为斑马纹 table
  loading: false, // 是否添加表格loading加载动画
  highlightCurrentRow: true, // 是否支持当前行高亮显示
  mutiSelect: false, // 是否支持列表项选中功能
  indexShow: true,
  pagination: false,
  height: '250px'// _this.readonly ? '230px' :
  // maxHeight: '300px'// _this.readonly ? '230px' :
}

export const tableFormOperates = _this => {
  return {
    // show: false,
    fixed: 'right',
    width: 70,
    // 列操作按钮
    list: [
      {
        id: 'del',
        label: '删除行',
        type: 'text',
        class: 'colorRedLight',
        show: true,
        disabled: false,
        method: (row, index) => {
          // console.log('【 row, index 】-101', row, index)
          _this.deleteRow(index);
        }
      }
    ]
  };
};
