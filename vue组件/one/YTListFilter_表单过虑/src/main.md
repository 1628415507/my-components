<!--
 * @Author: txt
 * @Date: 2021-02-05 14:33:31
 * @LastEditTime: 2021-02-19 11:23:45
 * @LastEditors: Please set LastEditors
 * @Description: 表格搜索栏组件封装
 * @FilePath: \admin\src\pages\test-page\components\ListFilter.vue
-->

# ListFilter 组件说明

| 参数       | 说明              | 类型     | 可选值                              | 必填 |
| ---------- | ----------------- | -------- | ----------------------------------- | ---- |
| formData   | 定义输入框的类型  | String   | input 、 select 、 date 、 dateTime | 是   |
| showMore   | 是否开启展开/收起 | Boolean  | -                                   | 否   |
| submit     | 查询              | Function | -                                   | 是   |
| rowSpan    | 一行几列          | Number   | -                                   | 否   |
| labelWidth | label 的宽度      | String   | -                                   | 否   |

## formData 字段定义

| 参数    | 说明                                 | 类型   | 可选值                                          | 必填 |
| ------- | ------------------------------------ | ------ | ----------------------------------------------- | ---- |
| type    | 定义输入框的类型                     | String | input 、 select 、 date 、 dateTime, dbInput    | 是   |
| options | 定义输入框的内容(暂时只支持一个对象) | String | label、type、propName、 placeholder、optionData | 是   |

</br>

- ## type 为 dateTime 时,options 中字段定义

</br>

| 参数             | 说明           | 类型    | 默认值   | 必填 |
| ---------------- | -------------- | ------- | -------- | ---- |
| placeholder      | 输入框提示语   | String  | 选择日期 | 否   |
| startPlaceholder | 输入框提示语   | String  | 开始日期 | 否   |
| endPlaceholder   | 输入框提示语   | String  | 结束日期 | 否   |
| rangeSeparator   | 中间的连接符   | String  | 至       | 否   |
| propName         | 输入框字段名称 | String  | -        | 是   |
| optionType       | 输入框类型     | String  | -        | 是   |
| clearable        | 是否可以清空   | Boolean | true     | 否   |

</br>

- ## type 为 dbInput 时,options 中字段定义
  | 参数        | 说明                                | 类型    | 默认值   | 必填 |
  | ----------- | ----------------------------------- | ------- | -------- | ---- |
  | label       | 输入框名称(\*注意：和 type 同级)    | String  | -        | 是   |
  | separator   | 中间的连接符 (\*注意：和 type 同级) | String  | -        | 否   |
  | placeholder | 输入框提示语                        | String  | 选择日期 | 否   |
  | propName    | 输入框字段名称                      | String  | -        | 是   |
  | clearable   | 是否可以清空                        | Boolean | true     | 否   |

</br>

## formData - options 字段定义

| 参数        | 说明           | 类型   | 默认值          | 必填 |
| ----------- | -------------- | ------ | --------------- | ---- |
| label       | 输入框名称     | String | -               | 是   |
| propName    | 输入框字段名称 | String | -               | 是   |
| placeholder | 输入框提示语   | String | 请选择 、请输入 | 否   |
| optionData  | 下拉框数据源   | Array  | -               | 否   |

</br>

## [* 注：propName 与返回值字段一致]

</br>

## formData - options - optionData 字段定义(type = "select"时使用)

| 参数  | 说明           | 类型   | 默认值           | 必填 |
| ----- | -------------- | ------ | ---------------- | ---- |
| id    | 输入框名称     | Number | -                | 否   |
| value | 输入框字段名称 | String | 和返回字段值关联 | 是   |
| label | 输入框提示语   | String | -                | 是   |

</br>

## slot 基本插槽

在该组件尽量在一个不具名插槽中完成

</br>

## Function submitForm(obj)

- `obj`: 返回值
- 返回值类型 `Object`

</br>

## Eg：

    formData: [
        {
            type: 'input',
            options: [
                {
                    label: '输入框',
                    propName: 'name',
                    placeholder: '请输入姓名'
                }
            ]
        },
        {
            type: 'select',
            options: [
                {
                    label: '下拉框',
                    propName: 'type',
                    optionData: this.$store.state.common.data
                }
            ]
        },
        {
            type: 'datetime',
            options: [
                {
                    label: '日期',
                    propName: 'date',
                    optionType: 'datetime',
                    placeholder: '请输入日期'
                }
            ]
        },
        {
          type: 'dbInput',
          label: '年龄',
          options: [
            {
              propName: 'age1',
              placeholder: '1'
            },
            {
              propName: 'age2',
              placeholder: '2'
            }
          ]
        },
    ]
