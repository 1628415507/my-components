<!--
 * @Description: 编辑表格DEMO
 * @Date: 2022-12-20 09:50:05
 * @LastEditTime: 2023-05-22 09:40:30
-->
<template>
  <div class="edit-table">
    <!-- <el-form
      ref="tableFormRef"
      :model="formData"
      :inline="true"
      class="form-wrap"
      label-position="right"
      label-width="100px"
      size="small"
      :disabled="provideInfo.productionLineAuditStatus===2"
    > -->
    <!-- 工序明细 -->
    <div v-if="!readonly" class="info-wrap">
      <div class="top-btn">
        <el-button v-if="mode!=='examine'" type="primary" size="small" @click="addRow">添加行</el-button>
      </div>
    </div>
    <div class="table-wrap" :class="{examine:mode==='examine'}">
      <!-- 编辑表格 -->
      <TableFormPanel
        ref="tableFormPanelRef"
        :value="formData"
        table-prop="tableData"
        :columns="tableFormColumns"
        :rules="formRules"
        :table-config="tableConfig"
        :operates="tableFormOperates"
        :readonly="readonly"
        :list-loading="listLoading"
        :disabled="provideInfo.productionLineAuditStatus===2"
        column-min-width="120px"
      >
        <template #dictItemConfigId="scope">
          <el-select
            v-model="formData.tableData[scope.index].dictItemConfigId"
            clearable
            placeholder=" "
            style="width:100px"
            @change="handleCarbonNameChange($event,scope.index)"
          >
            <el-option
              v-for="item in (carbonResourceNameListInfo[scope.row.key]||[])"
              :key="item.id"
              :label="item.configName"
              :value="item.id"
            />
          </el-select>
        </template>
        <template #carbonFactor="scope">
          <span
            style="display:inline-block;minWidth:100px"
            class="colorTheme pointer"
            @click="openDialogCarbon(scope.index)">{{ formData.tableData[scope.index].carbonFactor || '选择碳因子' }}</span>
        </template>
        <template #opt>
          <el-button type="text"> 删除行 </el-button>
        </template>
      </TableFormPanel>
    </div>
    <!-- </el-form> -->
    <dialog-carbon ref="dialogCarbon" @submit="handleCarbonSubmit" />

  </div>
</template>
<script>
import { tableConfig, formColumns, outsourcingFormColumns, tableFormOperates } from './config.js'
import DialogCarbon from '@/views/carbon-monitor-manage/component/DialogCarbon.vue'
import { getFilterItem } from '@/utils/util.js';
import { queryCarbonName, queryCarbonUnit } from '@/api/carbon-monitor-manage/basic-product-info.js'
import { queryCarbonList } from '@/api/common.js'
import { validateFloat, validateCarbonUnit } from '@/utils/validate.js'
import { floatMulByArgument, isJSON, floatInputChange, calculateCarbonTransformUnit } from '@/utils/calculate.js';

export default {
  name: 'EditTable',
  inject: ['getProvideInfo'],
  components: { DialogCarbon },
  props: {
    info: {
      type: Object,
      default: () => {},
      require: true
    },
    list: {
      type: Array,
      default: () => [],
      require: true
    },
    mode: {
      type: String,
      default: ''
    },
    tabName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableFormOperates: tableFormOperates(this),
      OUT_SOURCE: 1,
      carbonResourceNameListInfo: {}, // 碳源名称下拉信息
      // 表单
      formData: {
        // processName: '拉丝退火',
        // tableData: [
        //   { key: '1', dictItemId: '' },
        //   { key: '3', dictItemId: '1' }
        // ]
      },
      // 表单验证
      formRules: {
        carbonFactor: [// 碳因子
          { required: true, message: '请选择', trigger: ['change', 'blur'] }
        ],
        carbonFactorUnit: [
          { validator: (rule, value, callback) => this.validateCarbonUnitMethod(rule, value, callback, this.formData.tableData[this.curRowIndex]), trigger: 'blur' }
        ],
        dictItemId: [// 碳源类型
          { required: true, message: '请选择', trigger: ['change', 'blur'] }
        ],
        dictItemConfigId: [ // 碳源名称
          { required: true, message: '请选择', trigger: ['change', 'blur'] }
        ],
        workmanshipDetailValue: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] },
          { validator: validateFloat, trigger: ['blur', 'change'] }
        ],
        directPickingDeplete: [
          // { required: true, message: '请输入', trigger: ['blur', 'change'] },
          { validator: validateFloat, trigger: ['blur', 'change'] }
        ],
        unitCarbonValue: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] },
          { validator: validateFloat, trigger: ['blur', 'change'] }
        ],
        workmanshipDetailCarbonValue: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] },
          { validator: validateFloat, trigger: ['blur', 'change'] }
        ]
      },
      // 表格
      curRowIndex: 0,
      listLoading: false,
      tableConfig,
      carbonResourceTypeList: []
    };
  },
  computed: {
    // 基本信息
    provideInfo() {
      const info = this.getProvideInfo()
      return info
    },
    // 表格只读
    readonly() {
      return this.provideInfo.readonly
    },
    // 产品基本单位
    materialUnit() {
      const info = this.getProvideInfo()
      return info.materialUnit
    },
    productId() {
      return this.$route.query.id
    },
    tableFormColumns() {
      if (this.info.isOutsourcedGeneration === this.OUT_SOURCE) {
        console.log('【 委外生产 】-350', this.info.isOutsourcedGeneration)
        return outsourcingFormColumns(this)
      } else {
        const curColumns = formColumns(this)
        curColumns[0].options = this.carbonResourceTypeList
        return curColumns
      }
    }
  },
  watch: {
    'formData.tableData': {
      deep: true,
      handler(newVal, oldVal) {
        this.$emit('update:list', newVal)
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    floatInputChange,
    // 验证同一工序，同一碳源类型、碳源名称、单位产品平均用量、碳因子，完全相同设定，完全相同设定时文字提示且无法保存。
    validCarbonUnique() {
      // console.log('【 validCarbonUnique 】-355')
      // const indexArr = []
      const tableData = this.formData.tableData
      const isRepeat = tableData.some((originItem, originIndex, arr) => {
        const targetIndex = arr.findIndex(targetItem => {
          // 同一碳源类型
          const dictItemIdValid = (targetItem.dictItemId && originItem.dictItemId && (targetItem.dictItemId === originItem.dictItemId))
          // 同一碳源名称
          const dictItemConfigIdValid = (targetItem.dictItemConfigId && originItem.dictItemConfigId && (targetItem.dictItemConfigId === originItem.dictItemConfigId))
          // 同一单位产品平均用量
          const workmanshipDetailValueValid = (targetItem.workmanshipDetailValue && originItem.workmanshipDetailValue && (parseFloat(targetItem.workmanshipDetailValue) === parseFloat(originItem.workmanshipDetailValue)))
          // 同一碳因子
          const cbmFactorIdValid = (targetItem.cbmFactorId && originItem.cbmFactorId && (targetItem.cbmFactorId === originItem.cbmFactorId))
          // console.log('【 dictItemIdValid 】-364', dictItemIdValid, dictItemConfigIdValid, workmanshipDetailValueValid, cbmFactorIdValid)
          return dictItemIdValid && dictItemConfigIdValid && workmanshipDetailValueValid && cbmFactorIdValid
        })
        // if (targetIndex !== originIndex) {
        //   indexArr.push(originIndex + 1)
        //   indexArr.push(targetIndex + 1)
        // }
        // console.log('【 targetIndex 】-362', targetIndex)
        return (targetIndex !== -1) && (targetIndex !== originIndex)
      });
      if (isRepeat) {
        // this.$message.error(indexArr.join(',') + '碳源数据重复，请重新编辑')
        this.$message.error('碳源数据重复，请重新编辑')
        return false
      } else {
        return true
      }
    },
    handleInputBlur(value, index) {
      if (!this.validCarbonUnique()) {
        this.setTableItem(index, 'workmanshipDetailValue', '') //
      }
    },
    handleInputChange(value, index) {
      this.getCarbonValue(index)
    },
    handleChange(value, index) {
      console.log('【 value, index 】-352', value, index)
      this.formData.tableData[index].workmanshipDetailValue = this.$util.getNum(value.replace(/[^0-9.]/g, '')).toFixed(6) // 失焦时自动补齐位数
    },
    validateCarbonUnitMethod(rule, value, callback, row) {
      const carbonTypeItem = getFilterItem(this.carbonResourceTypeList, 'id', row.dictItemId)
      const carbonType = carbonTypeItem.itemRemark ? carbonTypeItem.itemRemark.toString() : ''
      if (row.densityUnit) {
        return validateCarbonUnit(rule, value, callback, { unitArr: [row.densityUnit.split('/')[0]], factorUnit: value, emissionUnit: 'kg', isGas: carbonType === '1' })
      } else {
        return validateCarbonUnit(rule, value, callback, { unitArr: [row.workmanshipDetailUnit ? row.workmanshipDetailUnit.split('/')[0] : ''], factorUnit: value, emissionUnit: 'kg', isGas: carbonType === '1' })
      }
    },
    // 初始化数据
    async initData() {
      // 初始化-表格数据
      const list = this.list
      const arr = list && list.length ? list.map(item => {
        return {
          ...item,
          key: item.workmanshipDetailId
        }
      }) : []
      this.$set(this.formData, 'tableData', arr || []); // 设置表格数据
      // 初始化-碳源类型下拉
      const carbonListRes = await queryCarbonList()
      this.carbonResourceTypeList = carbonListRes.resultValue || []
      // 初始化-碳源名称下拉
      this.formData.tableData.forEach(async(item, index) => {
        const carbonTypeItem = getFilterItem(this.carbonResourceTypeList, 'id', item.dictItemId)
        this.setCarbonNameList(carbonTypeItem.id, item.key)
        if (this.info.isOutsourcedGeneration === this.OUT_SOURCE) {
          item.carbonResource = this.$dict.getDictNameByCode('CARBON_DATA_SOURCE', item.dictItemId, 'id')
        }
        if (item.carbonResource === '温室气体' || item.carbonResource === '燃料') {
          const carbonResourceRemark = this.$dict.getDictNameByCode('1201', item.dictItemConfigId, 'id', 'configRemark')
          if (isJSON(carbonResourceRemark)) {
            const remarkObj = JSON.parse(carbonResourceRemark)
            this.setTableItem(index, 'workmanshipDetailDensity', remarkObj.carbonSourceDensity) // // TODO:设置密度
            this.setTableItem(index, 'densityUnit', remarkObj.densityUnit) // // TODO:设置密度单位
          }
        }
      })
    },
    // 设置碳源名称下拉
    async setCarbonNameList(itemId, key) {
      const res = itemId ? await queryCarbonName(itemId) : {}
      this.$set(this.carbonResourceNameListInfo, key, res.resultValue || []);
    },
    // 设置表格项数据
    setTableItem(index, key, val = '') {
      this.$set(this.formData.tableData[index], key, val);
    },
    // 计算碳排量
    getCarbonValue(index) {
      // 单位转换后的比率
      let rate
      const tableItem = this.formData.tableData[index]
      let prodVal = this.$util.getNum(tableItem.workmanshipDetailValue) // 单位产品平均用量
      const directPickingDeplete = this.$util.getNum(tableItem.directPickingDeplete) // 单位产品平均用量
      const density = this.$util.getNum(tableItem.workmanshipDetailDensity)// 气体密度
      const carbonFactor = this.$util.getNum(tableItem.carbonFactor)// 碳因子
      // const gwp = this.$util.getNum(tableItem.workmanshipDetailGwpValue)// GWP
      const carbonTypeItem = getFilterItem(this.carbonResourceTypeList, 'id', tableItem.dictItemId)
      const carbonType = carbonTypeItem.itemRemark ? carbonTypeItem.itemRemark.toString() : ''

      const carbonFactorUnit = tableItem.carbonFactorUnit// 碳因子单位
      const prefixWorkmanshipDetailUnit = tableItem.workmanshipDetailUnit ? tableItem.workmanshipDetailUnit.split('/')[0] : ''// 计量单位
      if (tableItem.densityUnit) {
        rate = calculateCarbonTransformUnit([tableItem.densityUnit.split('/')[0]], carbonFactorUnit, 'kg', carbonType === '1')
      } else {
        rate = calculateCarbonTransformUnit([prefixWorkmanshipDetailUnit], carbonFactorUnit, 'kg', carbonType === '1')
      }
      if (!rate) {
        this.setTableItem(index, 'workmanshipDetailCarbonValue', 0)
        this.$emit('getTotalCarbonValue'); // 更新外部总碳排量
        return
      }
      let val = 0
      if (directPickingDeplete) {
        prodVal = directPickingDeplete
      }
      // 温室气体1：(单位产品平均用量 * 气体密度 * 碳因子 = 碳排量)
      if (carbonType === '1' && prodVal && density && carbonFactor) {
        // val = floatMul(floatMul(prodVal, density), carbonFactor)
        val = floatMulByArgument(prodVal, density, carbonFactor, rate)
      }
      // 燃油2：( 单位产品平均用量 * 燃油密度* 碳因子 = 碳排量)
      if (carbonType === '2' && prodVal && density && carbonFactor) {
        // val = floatMul(floatMul(prodVal, density), carbonFactor)
        val = floatMulByArgument(prodVal, density, carbonFactor, rate)
      }
      // 能源3或者水4: (单位产品平均用量  * 碳因子（上下游）)
      if ((carbonType === '3' || carbonType === '4') && prodVal && carbonFactor) {
        // val = floatMul(prodVal, carbonFactor)
        val = floatMulByArgument(prodVal, carbonFactor, rate)
      }
      this.setTableItem(index, 'workmanshipDetailCarbonValue', val)
      this.$emit('getTotalCarbonValue'); // 更新外部总碳排量
    },
    // 选择碳源类型
    handleCarbonTypeChange(index) {
      // 重置碳因子信息
      this.setTableItem(index, 'cbmFactorId', '') //
      this.setTableItem(index, 'carbonFactor', '') // 设置-碳因子
      this.setTableItem(index, 'factoryLevelThird', '') // 设置-碳因子名称
      this.setTableItem(index, 'carbonFactorUnit', '') // 设置-碳因子单位
      this.setTableItem(index, 'dictItemConfigId', '') // 重置碳源名称
      const tableItem = this.formData.tableData[index]
      const carbonTypeItem = getFilterItem(this.carbonResourceTypeList, 'id', tableItem.dictItemId)
      this.setCarbonNameList(carbonTypeItem.id, tableItem.key)// 设置碳源名称下拉
      const isGasOrFuel = carbonTypeItem.itemRemark && (carbonTypeItem.itemRemark.toString() === '1' || carbonTypeItem.itemRemark.toString() === '2')// 是否是气体或者燃料
      // console.log('【 isGasOrFuel 】-361', isGasOrFuel)
      // 不是温室气体或者燃料就清空碳源密度和温室气体对应GWP值
      this.setTableItem(index, 'isGasOrFuel', isGasOrFuel) // 清空-碳源密度(kg)
      if (!isGasOrFuel) {
        this.setTableItem(index, 'workmanshipDetailDensity', '') // 清空-碳源密度(kg)
        this.setTableItem(index, 'densityUnit', '') // 清空-密度单位(kg)
      }
      this.setWorkmanshipDetailUnit(carbonTypeItem.itemCode, index)// 设置计量单位
    },
    // 设置计量单位
    async  setWorkmanshipDetailUnit(code, index) {
      const carbonUnit = code ? await queryCarbonUnit(code) : {}
      const carbonUnitItem = carbonUnit && carbonUnit.resultValue && carbonUnit.resultValue.length ? carbonUnit.resultValue[0] : {}
      const workmanshipDetailUnit = `${carbonUnitItem.uomNameEn || '- '}/${this.materialUnit}`// 设置计量单位
      this.setTableItem(index, 'workmanshipDetailUnit', workmanshipDetailUnit)
    },
    // 选择碳源名称
    handleCarbonNameChange(val, index) {
      if (!val) {
        this.setTableItem(index, 'workmanshipDetailDensity', '') // 清空密度
        this.setTableItem(index, 'densityUnit', '') // 清空密度单位
        this.getCarbonValue(index)// 计算碳排量
      } else {
        // 验证碳源唯一性
        const carbonUniqueValid = this.validCarbonUnique()
        if (!carbonUniqueValid) {
          this.setTableItem(index, 'dictItemConfigId', '') //
          return false
        }
        // 设置数据
        const tableItem = this.formData.tableData[index]
        // const carbonNameItem = getFilterItem(this.carbonResourceNameListInfo[tableItem.key], 'id', tableItem.dictItemConfigId)
        const isGasOrFuel = tableItem.isGasOrFuel
        if (isGasOrFuel) {
          const arr = this.carbonResourceNameListInfo[tableItem.key] || []
          const find = arr.find((item) => {
            return item.id === val
          }) || {}
          const configRemark = find.configRemark
          // 判断备注字段是否是json字符串，如果是，进行解析赋值
          if (isJSON(configRemark)) {
            const remarkObj = JSON.parse(configRemark)
            this.setTableItem(index, 'workmanshipDetailDensity', remarkObj.carbonSourceDensity) // // TODO:设置密度
            this.setTableItem(index, 'densityUnit', remarkObj.densityUnit) // // TODO:设置密度单位
          }
        }
        this.getCarbonValue(index)// 计算碳排量
      }
    },
    // 打开弹窗
    openDialogCarbon(index) {
      this.curRowIndex = index
      const tableItem = this.formData.tableData[index]
      if (!tableItem.dictItemId) {
        this.$message.error('请先选择碳源类型')
        return
      }
      const carbonTypeItem = getFilterItem(this.carbonResourceTypeList, 'id', tableItem.dictItemId)
      const carbonType = carbonTypeItem.itemRemark ? carbonTypeItem.itemRemark.toString() : ''
      const isGas = carbonType === '1'
      this.$refs.dialogCarbon.open(isGas)
    },
    // 选择碳因子
    handleCarbonSubmit(item) {
      console.log('【 item 】-482', item)
      this.setTableItem(this.curRowIndex, 'cbmFactorId', item.factorId) // 设置-碳因子记录Id
      // 验证碳源唯一性
      const carbonUniqueValid = this.validCarbonUnique()
      if (!carbonUniqueValid) {
        this.setTableItem(this.curRowIndex, 'cbmFactorId', '') //
        this.setTableItem(this.curRowIndex, 'carbonFactor', '') // 设置-碳因子
        this.setTableItem(this.curRowIndex, 'factoryLevelThird', '') // 设置-碳因子名称
        this.setTableItem(this.curRowIndex, 'carbonFactorUnit', '') // 设置-碳因子单位
        this.$refs.tableFormRef.validateField(`tableData[${this.curRowIndex}].carbonFactor`, () => {})
        return false
      }
      this.setTableItem(this.curRowIndex, 'carbonFactor', this.$util.getNum(item.carbonValue)) // 设置-碳因子
      this.setTableItem(this.curRowIndex, 'factoryLevelThird', item.factoryLevelThird) // 设置-碳因子名称
      this.setTableItem(this.curRowIndex, 'carbonFactorUnit', item.emissionsUnit) // 设置-碳因子单位
      this.getCarbonValue(this.curRowIndex)// 计算碳排量
      this.$nextTick(() => {
        this.$refs.tableFormRef.validateField(`tableData[${this.curRowIndex}].carbonFactor`, () => {})
        this.$refs.tableFormRef.validateField(`tableData[${this.curRowIndex}].carbonFactorUnit`, () => {})
      })
    },
    // 添加行
    addRow() {
      // 委外生产
      if (this.info.isOutsourcedGeneration === this.OUT_SOURCE) {
        this.formData.tableData.unshift({
          key: Math.random(),
          dictItemId: '',
          workmanshipDetailCarbonValue: '',
          workmanshipDetailRemark: '',
          // 其他值默认设置为0
          dictItemConfigId: 0,
          workmanshipDetailValue: 0,
          workmanshipDetailUnit: 0,
          carbonFactor: 0,
          cbmFactorId: null,
          carbonFactorUnit: 0,
          workmanshipDetailDensity: 0,
          densityUnit: 0,
          directPickingDeplete: 0
        });
      } else {
        this.formData.tableData.unshift({
          key: Math.random(),
          dictItemId: ''
        });
      }
      // this.validateTableForm()
    },
    // 删除行
    deleteRow(index) {
      this.formData.tableData.splice(index, 1)
      this.$emit('getTotalCarbonValue'); // 更新外部总碳排量
    },
    // 验证表格(父组件调用)
    validateTableForm() {
      let isTableFormValid = false
      this.$refs['tableFormPanelRef'].$refs['tableFormRef'].validate(valid => {
        isTableFormValid = valid
      })
      const carbonUniqueValid = this.validCarbonUnique()
      const validInfo = {
        tabName: this.tabName,
        valid: isTableFormValid && carbonUniqueValid
        // carbonUniqueValid
      }
      return validInfo
    }
  }
};
</script>
<style lang="scss" scoped>
.table-wrap{
  &.examine{
    pointer-events: none;
    cursor:not-allowed ;
  }
   // 表单项处理
  .table-form-item {
    margin: 0 auto !important;
    margin-bottom: 18px !important;
  }
}
.edit-table {
  width: 100%;
  .top-btn{
    margin-bottom:10px ;
  }
  .footer-btn{
    display: flex;
    justify-content: center;
  }
}
</style>
