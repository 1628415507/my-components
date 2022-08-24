<!--
 * @Author: Hongzhifeng
 * @Date: 2022-04-14 15:27:50
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-04-25 16:53:38
 * @Description: 递归表单
-->

<template>
  <div class="tree-item">
    <el-form :ref="formRef" :model="formData" :rules="rules" size="mini" label-width="110px" :inline="true">
      <div v-for="(questionItem,index) in formData.questionData" :key="index">
        <el-row :gutter="0">
          <!-- 问题 -->
          <el-col :span="8">
            <el-form-item :label="`${getSort(index+1)}.问题：`" :prop="`questionData[${index}].name`" :rules="rules.name">
              <el-input
                v-model="questionItem.name"
                @blur="checkQuestion(questionItem)"
                :maxlength="32"
                placeholder="请输入问题内容"
                clearable
                :style="{width: '240px'}"
              ></el-input>
            </el-form-item>
            <div v-if="formData.questionData.length>1||level>1" class="icon-box" @click="delQuestion(formData.questionData,index)">
              <i class="el-icon-remove"></i>
            </div>
          </el-col>
          <el-col :span="11">
            <el-form-item label="关联标签：" :prop="`questionData[${index}].lable`" :rules="rules.lable">
              <el-select v-model="questionItem.lable" placeholder="请选择" clearable>
                <el-option v-for="(tagItem, index) in questionTagOptions" :key="index" :label="tagItem.label" :value="tagItem.value"></el-option>
              </el-select>
              <span class="defaultColor opt-txt">管理标签</span>
            </el-form-item>
          </el-col>
          <!-- 必填项 -->
          <el-col :span="7">
            <el-form-item label="必填项：" :prop="`questionData[${index}].required`" :rules="rules.required">
              <DictionarySelect :dicName="'YES_OR_NO'" :defaultVal.sync="questionItem.required" />
            </el-form-item>
          </el-col>
          <!-- 选择类型 -->
          <el-col :span="10">
            <el-form-item label-width="1px" label :prop="`questionData[${index}].multipleChoice`" :rules="rules.multipleChoice">
              <el-radio-group v-model="questionItem.multipleChoice" size="medium" @change="changeSelectType(questionItem)">
                <el-radio
                  v-for="(typeItem) in selectTypeOptions"
                  :key="typeItem.labelName"
                  :label="typeItem.labelValue"
                >{{typeItem.labelName}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- 选项行 +++ -->
          <el-col :span="24">
            <el-form-item
              :label="questionItem.multipleChoice==1?'单选项：':'多选项：'"
              :prop="`questionData[${index}].questionOptions`"
              :rules="rules.questionOptions"
            >
              <div v-for="(optionsItem,optionsIndex) in questionItem.questionOptions" :key="optionsIndex" class="option-item">
                <el-form-item
                  label
                  label-width="0px"
                  :prop="`questionData[${index}].questionOptions[${optionsIndex}].optionName`"
                  :rules="rules.optionName"
                >
                  <el-input
                    v-model="optionsItem.optionName"
                    @blur="checkAnswer(optionsItem)"
                    :maxlength="20"
                    :placeholder="`请输入${questionItem.multipleChoice==1?'单选项':'多选项'}内容`"
                    :style="{width: '100%'}"
                    clearable
                  ></el-input>
                </el-form-item>
                <div class="icon-wrap">
                  <div @click="addAnswer(questionItem.questionOptions,optionsIndex)" class="icon-box" style="color:#409EFF">
                    <i class="el-icon-circle-plus-outline"></i>
                  </div>
                  <div
                    v-if="questionItem.questionOptions.length>1"
                    @click="delAnswer(questionItem.questionOptions,optionsIndex)"
                    class="icon-box"
                  >
                    <i class="el-icon-remove-outline"></i>
                  </div>
                </div>
                <!-- 是否有下级问题(三级以内&&单选类型才显示) -->
                <el-form-item
                  v-if="level<3 && questionItem.multipleChoice==1"
                  label="是否有下级问题："
                  :prop="`questionData[${index}].questionOptions[${optionsIndex}].isChild`"
                  label-width="125px"
                >
                  <el-select v-model="optionsItem.isChild" placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in YES_OR_NO" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <!-- 添加下级问题(三级以内&&单选类型&&显示添加下级问题 才显示) -->
                <el-button
                  v-if="level<3 && questionItem.multipleChoice==1 && optionsItem.isChild"
                  @click="addSubQuestion(questionItem,optionsItem,optionsIndex)"
                  size="mini"
                >添加下级问题</el-button>
              </div>
            </el-form-item>
          </el-col>
          <!-- 单选项 --- -->
        </el-row>
        <!-- 递归调用（最多三级） -->
        <div v-if="level<3 && getSubData(questionItem).length" class="item-childen">
          <my-tree
            v-ant-ref="(dom) => setChildrenRef('nestedComponents', dom)"
            :formRef="`${formRef}${level+1}${index+1}`"
            :treeData="getSubData(questionItem)"
            :questionnaireModules="moduleList"
            :level="level+1"
            :sort="getSort(index+1)"
          ></my-tree>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
    import DictionarySelect from '@/components/public/dictionarySelect'
    import { questionTemp, questionRules } from '../data'
    export default {
        name: 'myTree',
        inject: {
            nestedComponentsed: {
                from: 'nestedComponents',
                default: []
            },
            setChildrenRef: {
                default: () => {}
            },
            getParentRef: {
                from: 'getRef',
                default: () => {}
            },
            getParentChildrenRef: {
                from: 'getChildrenRef',
                default: () => {}
            }
        },
        props: {
            formRef: {
                type: String,
                default: ''
            },
            treeData: {
                type: Array,
                default: () => []
            },
            questionnaireModules: {
                type: Array,
                default: () => []
            },
            level: {
                type: Number,
                default: 1 // 递归层级
            },
            sort: {
                type: String,
                default: ''
            }
        },
        components: {
            DictionarySelect
        },
        data () {
            return {
                moduleList: [], // this.modulesData,
                questionTemp,
                limit: 6,
                rules: questionRules, // 验证规则
                formData: {
                    questionData: []
                },
                questionTagOptions: [
                    {
                        label: '个人期望',
                        value: '1'
                    },
                    {
                        label: '运动目标',
                        value: '2'
                    }
                ],
                selectTypeOptions: this.$session.get('dict').MULTIPLCE_CHOICE,
                YES_OR_NO: [
                    {
                        label: '是',
                        value: true
                    },
                    {
                        label: '否',
                        value: false
                    }
                ]
            }
        },
        computed: {
            // curLevel: function () {
            //     return this.level
            // }
        },
        watch: {
            treeData: {
                handler (newValue, oldValue) {
                    this.formData.questionData = newValue
                },
                deep: true
                // immediate: true
            },
            questionnaireModules: {
                handler (newValue, oldValue) {
                    // console.log('【 newValue 】-179', newValue)
                    this.moduleList = newValue
                },
                deep: true
                // immediate: true
            }
        },
        methods: {
            // 数组扁平化
            flattening (arr, type = '') {
                // console.log('【 arr 】-260', arr)
                let list = [] // 创建空数组接收数组
                // 判断传进来的arr是否为数组
                if (arr instanceof Array) {
                    // 如果是则遍历这个数组
                    arr.forEach(questionItem => {
                        // 问题扁平化
                        type === 'question' && list.push(questionItem) // 当前项也算一个问题
                        // 选项扁平化
                        type === 'option' &&
                            questionItem.questionOptions.forEach(optionsItem => {
                                list.push(optionsItem) // 当前项也有答案
                            })
                        const children = this.getSubData(questionItem)
                        // 递归调用
                        if (children.length) {
                            list = list.concat(this.flattening(children, type))
                        }
                    })
                } else {
                    list.push(arr) // 如果不是数组则直接放进list
                }
                return list
            },
            // 判断在模块中的问题是否唯一
            checkQuestion (questionItem) {
                const questionName = questionItem.name
                let treeList = []
                this.moduleList.forEach(moduleItem => {
                    treeList = [...treeList, ...moduleItem.moduleQuestions]
                })
                const flatteningArr = this.flattening(treeList, 'question')
                const count = flatteningArr.filter(item => {
                    return questionName && item.name === questionName
                }).length
                // 存在相同值
                if (count > 1) {
                    this.$message.error('当前问题已存在')
                    questionItem.name = ''
                }
            },
            // 判断在模块中的答案是否唯一
            checkAnswer (optionsItem) {
                const optionName = optionsItem.optionName
                let treeList = []
                this.moduleList.forEach(moduleItem => {
                    treeList = [...treeList, ...moduleItem.moduleQuestions]
                })
                const flatteningArr = this.flattening(treeList, 'option')
                const count = flatteningArr.filter(optionsItem => {
                    return optionName && optionsItem.optionName === optionName
                }).length
                // 存在相同值
                if (count > 1) {
                    this.$message.error('当前答案已存在')
                    optionsItem.optionName = ''
                }
            },
            // 判断是否超过限制
            getIsLimit (list) {
                const limit = this.limit
                const count = list.filter(item => {
                    return item.multipleChoice === 1
                }).length
                if (count < limit) {
                    return true
                } else {
                    this.$message.error(`单选问题最多可添加${limit}条`)
                    return false
                }
            },
            // 获取当前标签序号
            getSort (index) {
                if (this.level === 1) {
                    return index.toString()
                } else {
                    return `${this.sort}-${index}`
                }
            },
            // 选项类型
            changeSelectType (questionItem) {
                const multipleChoice = questionItem.multipleChoice
                const count = this.formData.questionData.filter(item => {
                    return item.multipleChoice === 1
                }).length
                // 单选时判断是否超过限制
                if (multipleChoice === 1 && count > this.limit) {
                    this.$message.error(`单选问题最多可添加${this.limit}条`)
                    questionItem.multipleChoice = 2
                } else {
                    // 为多选时清空下级问题
                    questionItem.questionOptions.forEach(item => {
                        item.moduleQuestionList = []
                    })
                }
            },
            // 获取下级问题数据
            getSubData (questionItem) {
                let children = []
                const questionOptions = questionItem.questionOptions
                questionOptions.forEach(item => {
                    children = [...children, ...item.moduleQuestionList] // children.concat(item.moduleQuestionList) // item.children
                })
                return children
            },
            // 删除问题
            delQuestion (item, index) {
                this.$confirm('确认删除该问题？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    item.splice(index, 1)
                })
            },
            // 添加下级问题
            addSubQuestion (questionItem, optionsItem, optionsIndex) {
                const children = this.getSubData(questionItem)
                if (this.getIsLimit(children)) {
                    const questionTemp = JSON.parse(JSON.stringify(this.questionTemp))
                    optionsItem.moduleQuestionList.push(questionTemp)
                    // this.$set('optionsItem', 'children', questionTemp)
                }
            },
            // 添加答案
            addAnswer (questionOptions, optionsIndex) {
                if (questionOptions.length >= 10) {
                    this.$message.error('最多可添加10条答案')
                    return false
                } else {
                    const optionTemp = {
                        optionName: '',
                        isChild: '',
                        moduleQuestionList: []
                    }
                    questionOptions.splice(optionsIndex + 1, 0, optionTemp) // 拼接函数(索引位置, 要删除元素的数量, 插入元素)
                }
            },
            // 删除答案
            delAnswer (questionOptions, optionsIndex) {
                questionOptions.splice(optionsIndex, 1)
            },
            // async validForm () {
            //     console.log('【调了 】-337')
            //     // console.log('【 this.$refs.childForm 】-339', this.$refs.childForm)
            //     try {
            //         // this.$refs.childForm.validate()
            //         return await this.$refs[this.formRef].validate()
            //         //  return this.$refs.formRef.validate(valid => {
            //         //     if (!valid) return false
            //         //     return true
            //         // // TODO 提交表单
            //         // })
            //     } catch (err) {
            //         return false
            //     }
            // }
            validForm () {
                // try {
                // this.$refs[this.formRef].validate()
                let flag = false
                this.$refs[this.formRef].validate(valid => {
                    if (!valid) {
                        flag = false
                        return false
                    }
                    flag = true
                    // TODO 提交表单
                })
                return flag
                // } catch (err) {
                //     return false
                // }
            }
        },
        created () {
            this.formData.questionData = this.treeData
        },
        mounted () {
            console.log('【formRef】-383', this.formRef)
            // this.nestedComponentsed.forEach(item => {
            //     console.log('【 item 】-376', item)
            // })
            // console.log('【  moduleList-280', this.moduleList)
        }
    }
</script>

<style lang="less" scoped>
  .tree-item {
      display: block;
      // background: #bfc;
      .icon-wrap {
          display: inline-block;
          width: 70px;
      }
      .icon-box {
          margin-right: 5px;
          display: inline-block;
          line-height: 30px;
          font-size: 17px;
          color: red;
          cursor: pointer;
      }
      .option-item {
          margin-bottom: 5px;
      }
      .opt-txt {
          margin-left: 10px;
      }
      .item-childen {
          display: block;
          padding-left: 75px;
          // background: #bcf;
      }
  }
</style>
