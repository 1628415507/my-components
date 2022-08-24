<template>
  <span id="elTable">
    <el-table
      :data="tableData"
      :height="tableHeight"
      :header-cell-style="headerCalss"
      border
      ref="table"
      size="mini"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
      @row-dblclick="handleRowDbclick">
      <el-table-column type="selection" width="55" v-if="isCheckout"></el-table-column>
      <el-table-column type="index" fixed="left" label="序号" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.name"
        header-align="center"
        align="center"
        :fixed="item.type === 'button'&&'right'"
        :width="item.width">
          <template slot-scope="scope">
            <div v-if="item.type !== 'button'">

              <!-- 表格数据有数组，即需要特殊判断遍历 -->
              <div v-if="item.children">
                <span v-for="(childrenData,index) in scope.row[item.prop]" :key="index">
                  {{childrenData[item.children.prop]}}
                </span>
              </div>
              <div v-if="!item.children">
                <!-- 表格数据需要通过状态转化name -->
                <div v-if="item.data">
                  {{item.data.filter(val=>{
                    if (isNaN(val['valueType'])&&val['valueType']!==0){ // type不是数字
                      return val['valueType'] === scope.row[item.prop]
                    } else { //type为数字
                      return Number(val['valueType']) === Number(scope.row[item.prop]||scope.row[item.prop]===''||'1')
                    }
                  })[0] ? item.data.filter(val=>{
                    if (isNaN(val['valueType'])&&val['valueType']!==0){ // type不是数字
                      return val['valueType'] === scope.row[item.prop]
                    } else { //type为数字
                      return Number(val['valueType']) === Number(scope.row[item.prop]||scope.row[item.prop]===''||'1')
                    }
                  })[0].valueName
                  : ''}}
                </div>
                <div v-if="!item.data">
                  <!-- template 需要多个字段拼接填入一个单元格 -->
                  <div v-if="item.template">
                    <!-- <span v-for="(tem, key) in item.template" :key="key">
                      {{ tem.label + scope.row[tem.prop]}}
                    </span> -->
                    <span>
                      {{ scope.row[item.template[0].prop]}}
                    </span>
                      {{item.template[0].label}}
                    <span>
                      {{ scope.row[item.template[1].prop]}}
                    </span>
                  </div>
                  <div v-if="!item.template">
                    {{scope.row[item.prop]}}
                  </div>
                </div>
              </div>
            </div>
            <img width="100%" style="width:50px" v-if="item.type === 'image'" :src="scope.row.photo" alt="">
            <div v-if="item.type === 'tag'">
              <el-tag effect="dark" type="success" v-for="(item,index) in scope.row.athleteSportList" :key="index">{{item.subSportName}}</el-tag>
            </div>

            <span v-if="item.type === 'button'">
              <span v-for="(info,index) in buttons" :key="index" >
                <!-- todo: 添加按钮权限判断  &&info.isPer -->
                <el-button size="mini"
                  :type="info.class"
                  :disabled="showDisabled(scope.row[info.disabled])"
                  v-show="showBtn(scope.row[info.isShow])"
                  v-if="info.type === 'button'"
                  @click="handleClick(info.name,scope.row)">
                  {{info.name}}
                </el-button>
                <el-upload
                  v-if="info.type === 'file'"
                  class="upload-demo"
                  name="files"
                  :headers="header"
                  :show-file-list="false"
                  :action="info.actionUrl"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  >
                  <el-button size="mini" type="primary">上传</el-button>
                </el-upload>
              </span>
            </span>
          </template>
      </el-table-column>
    </el-table>
  </span>
</template>
<script>
/**
 * tableData: 数组   表格数据
 * columns: 数组  表头数据
 * type: button: 点击按钮   image:图片  file:上传文件  tag
 * isCheckout  treu:表格有复选框  false: 表格无复选框
 * tableDefaultId: 表格默认选中行
*/
import mixin from '@/mixin'
// import $session from 'utils/session'
export default {
  mixins: [mixin],
  // props: ['tableData','columns', 'buttons','height','isCheckout'],
  props: {
    tableData: {},
    columns: {},
    buttons: {},
    height: {},
    isCheckout: {
      default: true
    },
    useDefault: '',
    temData: true,
    tableDefaultId: {}
  },
  data () {
    return {
      headerCalss: {
        background: '#F1F5FA',
        color: '#212053'
      },
      tableHeight: null,
      header: {
        // Authorization: 'Bearer ' + $session.get('token')
      }
    }
  },
  watch: {
    height () {
      if (this.height) {
        this.tableHeight = this.height
      } else {
        this.tableHeight = this.getTableHeight(1.8 ,'.top' , '.footer-btn', null, null)
      }
    },
    tableData () {
      if (this.useDefault) {
        this.$nextTick(res => {
        this.tableDefaultId && this.tableDefaultId.forEach(ids => {
          this.$refs.table.toggleRowSelection(this.tableData.find((data,index) => {
              return data.storageCode === ids
            }), true) // 设置默认选中
          })
        })
      }
    }
  },
  methods: {
    showBtn (isShow) {
      if (isShow === '1' || isShow === undefined || isShow === '未出库' || isShow === '未入库' || isShow === 'checkState1') {
        return true
      } else if (isShow === '2' || isShow === '3') {
        return false
      }
    },
    showDisabled (isDisabled) {
      if (isDisabled === true || isDisabled === 'checkState1' || isDisabled === 'checkState3') {
        return true
      } else if (isDisabled === 'checkState2' || isDisabled === false || isDisabled === undefined) {
        return false
      }
      // if (isDisabled === true || isDisabled === 'checkState1' || isDisabled === 'checkState2' || isDisabled === 'checkState4') {
      //   return true
      // } else if (isDisabled === 'checkState3' || isDisabled === false || isDisabled === undefined) {
      //   return false
      // }
    },
    handleSelectionChange (rows) {
      console.log(rows, 'ttttt')
      this.$emit('getRowsData', rows)
    },
    handleRowDbclick (rows) { // 某一行被双击触发的事件
      this.$emit('handleRowDbclick', rows)
    },
    handleClick (type,row) {
      this.$emit('handleCallback', type,row)
    },
    uploadSuccess (data) { // 上传成功
      this.$emit('handleUploadCallback', data)
    },
    uploadError (data) {
      this.$emit('handleUploadCallback', data)
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    }
  },
  mounted () {
    if (this.height) {
      this.tableHeight = this.height
    } else {
      this.tableHeight = this.getTableHeight(1.8 ,'.top' , '.footer-btn', null, null)
    }
    console.log('表格数据', this.tableData)
    console.log('默认选中行--', this.tableDefaultId)
  }
}
</script>
<style scoped>
  .upload-demo {
    display: inline-block;
    margin-right: 3px
  }
</style>
<style>
  #elTable .el-tag {
    color: #fff;
    background-color: #409EFF!important;
    cursor: default
  }
  .el-table .odd-row {
    background: #F1F5FA!important;
  }

  .el-table .even-row {
    background: #fff!important;
  }
  /* .el-table .hover-row {
    background: #FAF4DE!important
  } */
</style>
