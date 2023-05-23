<template>
  <div v-loading="loading" class="file-preview">
    <!-- 预览3 -->
    <div class="excel-view-container">
      <!-- 方式1：直接渲染 -->
      <div id="excelView" v-html="excelView" />
      <!-- 方式2：hot-table渲染 -->
      <!-- :data="hotSettings.data"  -->
      <!-- <hot-table ref="hot" :settings="hotSettings" /> -->
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx';
// import { HotTable } from '@handsontable/vue'
// import Handsontable from 'handsontable';
// import 'handsontable/dist/handsontable.full.css';
// import 'handsontable/languages/zh-CN'; // 引入中文语言包
import { downloadAttachmentFile } from '@/api/common.js';
export default {
  name: 'ExcelOfXLSX',
  // components: { HotTable },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      excelView: null,
      hotData: [],
      hotSettings: {
        startRows: 0,
        stretchH: 'all',
        // language: 'zh-CN',
        readOnly: true, // 表格只读
        data: this.hotData,
        // mergeCells: true, //
        mergeCells: [
          { row: 1, col: 1, rowspan: 3, colspan: 3 },
          { row: 3, col: 4, rowspan: 2, colspan: 2 },
          { row: 5, col: 6, rowspan: 3, colspan: 3 }
        ],
        cell: [
          { row: 0, col: 0, className: 'htCenter htMiddle' }, // 设置下标为0,0的单元格样式 水平居中、垂直居中
          { row: 5, col: 0, className: 'htCenter htMiddle' }
        ],
        colHeaders: true, // 显示列头数据（false/true/ 数组），默认值 false，设置 true 则按 A、B、C... 显示
        rowHeaders: true, // 显示行头数据（false/true/ 数组），默认值 false，设置 true 则按顺序 1、2、3... 显示
        manualColumnResize: true, // 列可拖拽 调大小
        manualRowResize: true, // 行可拖拽 调大小
        // height: 'calc(100vh - 107px)',
        autoColumnSize: {
          // keep 40% of columns in sync (the rest of columns: async)
          syncLimit: '40%',
          // when calculating column widths, use column headers
          useHeaders: true,
          // when calculating column widths, use 10 samples of the same length
          samplingRatio: 10,
          // when calculating column widths, allow duplicate samples
          allowSampleDuplicates: true
        }, // 当值为true且列宽未设置时，自适应列大小
        contextMenu: false, // 禁用右键菜单
        manualColumnMove: false, // 列可拖动
        manualRowMove: false, // 行可拖动
        // 关闭外部点击取消选中时间的行为
        outsideClickDeselects: false,
        // fillHandle: {
        //   direction: 'vertical',
        //   autoInsertRow: true
        // },
        // afterSelectionEnd: this.afterSelectionEnd,
        // bindRowsWithHeaders: 'strict',
        licenseKey: 'non-commercial-and-evaluation',
        className: 'htCenter', // 内容显示格式，剧中
        afterGetColHeader: function(col, th) {
          setTimeout(() => {
            if (col === -1) {
              const theads = th.parentNode.parentNode // 获取当前表头的thead对象
              const trs = theads.getElementsByTagName('tr') // 获取所有行
              const trCols1 = trs[0].getElementsByTagName('th') // 获取第一行所有列
              const trCols2 = trs[1].getElementsByTagName('th') // 获取第二行所有列
              if (trCols1.length === trCols2.length) {
                // 行号表头将第一行的底部边框去除掉，符合合并单元格样式
                // 此处不能执行rowSpan属性，否则出现第二行合表头数据错位
                trCols1[0].style.borderBottom = 'none'
                for (let i = 1; i < trCols1.length; i++) {
                  // 如果单元格不包含colSpan属性且不是隐藏的单元格，则表明需要合并行，否则，则表明不需要合并行
                  if (!trCols1[i].getAttribute('colSpan') && trCols1[i].className !== 'hiddenHeader') {
                    trCols1[i].rowSpan = 2
                    trCols1[i].style.verticalAlign = 'middle'
                    trCols1[i].style.height = '64px'
                    // 将第二行表格隐藏，并将第一行的底部边框去除
                    trCols2[i].className = 'hiddenHeader'
                    trCols1[i].style.borderBottom = 'none'
                  }
                }
              }
            }
          }, 100)
        }
      }
    };
  },
  mounted() {
    this.getFileStream(this.info);
    this.$refs.hot.hotInstance.updateSettings(this.hotSettings);
  },
  methods: {
    // 预览
    getFileStream(item) {
      this.loading = true
      console.log('【getFileStream- item 】-95', item);
      downloadAttachmentFile({ attachmentManageId: item.attachmentManageId })
        .then(res => {
          if (!res) {
            return false;
          }
          this.xlsxPreview(res, item);
        })
        .finally(() => {
          this.loading = false
        });
    },
    xlsxPreview(response, item) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(response); // 将文件对象读取为arraybuffer类型的数据
      reader.onload = event => {
        // 方式一：直接渲染
        this.renderExcelView(event.target.result)
        // 方式2：hot-fix渲染
        const uint8Array = new Uint8Array(event.target.result);
        const workbook = XLSX.read(uint8Array, { type: 'array' });// 解析数据
        // const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 'A', raw: true, defval: ' ' });
        const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 'A', raw: true, defval: ' ' });
        const hotMergedCells = this.getHotMergedCells(workbook);
        // const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: '1' });
        // sheet_to_json 的 第二個參數裏面的 header，能夠傳數字，也能夠轉 'A',
        // 兩個的主要區別在於轉化出來的表第一行若是是空行會不會正常顯示，
        // 傳 'A' 會正常顯示，傳數字的話，若是表格的第一行有空白單元格，表格會錯亂。
        // this.hotSettings.mergeCells = hotMergedCells[workbook.SheetNames[0]];// [{ row: 0, col: 0, rowspan: 1, colspan: 7 }] // hotMergedCells
        // this.mergeArrSubmit = JSON.parse(JSON.stringify(this.hotRef.getPlugin('mergeCells').mergedCellsCollection.mergedCells));
        console.log('【 excelData 】-70', excelData);
        console.log('【 hotMergedCells 】-85', hotMergedCells)
        console.log('【 this.$refs.hot 】-86', this.$refs.hot)
        // this.$nextTick(() => {
        this.$refs.hot.hotInstance.loadData(excelData)
        // this.$refs.hot.hotInstance.updateSettings(this.hotSettings);
        // })
      };
    },
    getHotMergedCells(workbook) {
      const sheets = workbook.Sheets;
      const result = {};
      for (const name in sheets) {
        const sheet = sheets[name];
        const rawArr = sheet['!merges'];
        result[name] = [];
        for (const i in rawArr) {
          const obj = rawArr[i];
          const colspan = obj.e.c - obj.s.c + 1;
          const rowspan = obj.e.r - obj.s.r + 1;
          const handledObj = {
            row: obj.s.r,
            col: obj.s.c,
            rowspan: rowspan,
            colspan: colspan
          }
          result[name].push(handledObj);
        }
      }
      return result;
    },
    // 方式一：直接渲染
    renderExcelView(res) {
      const uint8Array = new Uint8Array(res);
      const workbook = XLSX.read(uint8Array, { type: 'array' });// 解析数据
      const sheetNames = workbook.SheetNames; // 工作表名称集合
      const worksheet = workbook.Sheets[sheetNames[0]];
      this.excelView = XLSX.utils.sheet_to_html(worksheet);
      console.log('【  this.excelView 】-66', this.excelView);
      this.$nextTick(() => {
        // DOM加载完毕后执行，解决HTMLConnection有内容但是length为0问题。
        this.setStyle4ExcelHtml();
      });
    },
    // 方式一：直接渲染-设置Excel转成HTML后的样式
    setStyle4ExcelHtml() {
      const excelViewDOM = document.getElementById('excelView');
      if (excelViewDOM) {
        const excelViewTDNodes = excelViewDOM.getElementsByTagName('td'); // 获取的是HTMLConnection
        if (excelViewTDNodes) {
          const excelViewTDArr = Array.prototype.slice.call(excelViewTDNodes);
          for (const i in excelViewTDArr) {
            const id = excelViewTDArr[i].id; // 默认生成的id格式为sjs-A1、sjs-A2......
            if (id) {
              const idNum = id.replace(/[^0-9]/gi, ''); // 提取id中的数字，即行号
              if (idNum && (idNum === '1' || idNum === 1)) {
                // 第一行标题行
                excelViewTDArr[i].classList.add('class4Title');
              }
              if (idNum && (idNum === '2' || idNum === 2)) {
                // 第二行表头行
                excelViewTDArr[i].classList.add('class4TableTh');
              }
            }
          }
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
/deep/ table {
  max-width: 100% !important;
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  text-align: center !important;
  border: 0px !important;
}

/deep/ table tr td {
  /* border: 1px solid gray !important; */
  border-right: 1px solid gray !important;
  border-bottom: 1px solid gray !important;
}
/**整体样式 */
/deep/ .excel-view-container {
  background-color: #ffffff;
}
/**标题样式 */
/deep/ .class4Title {
  font-size: 22px !important;
  font-weight: bold !important;
  padding: 10px !important;
}
/**表格表头样式 */
/deep/ .class4TableTh {
  /* font-size: 14px !important; */
  font-weight: bold !important;
  padding: 2px !important;
  background-color: #efe4b0 !important;
}
</style>
