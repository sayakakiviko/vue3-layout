const useCommonHandler = {
  /**
   * 下载
   * @res 接口返回的数据流
   * @fileName {string} 要下载的附件的名称（含后缀名）
   */
  download(res, fileName) {
    let dotIndex = fileName.lastIndexOf('.'); //找到后缀名的.
    let name = fileName.substring(0, dotIndex); //文件名
    let type = fileName.substring(dotIndex + 1, fileName.length); //文件类型
    const types = {
      txt: 'text/plain;',
      zip: 'application/zip',
      pdf: 'application/pdf',
      xls: 'application/vnd.ms-excel;',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
      doc: 'application/msword;',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;',
    };

    const blob = new Blob([res], { type: types[fileName[1]] }); //生成下载链接
    const link = document.createElement('a'); //创建标签
    link.href = URL.createObjectURL(blob); //复制下载路径
    link.download = name + '.' + type; //下载的文件名
    document.body.appendChild(link); //插入dom树
    link.click(); //点击下载
    document.body.removeChild(link); //移出dom树
  },
  /**
   * 模糊搜索（前端分页用）
   * @tableData {array} 表格数据数组
   * @val {string} 搜索关键字字符串
   * @return 返回搜索结果
   */
  searchTableData(tableData, val) {
    let SearchTable = [];
    tableData.map((item) => {
      let count = 0;
      for (let k in item) {
        if (item[k] && k != 'oid' && k != '_token' && k != 'tenantid') {
          let searching = val.toLocaleLowerCase();
          let nowValue = item[k].toString().toLocaleLowerCase();
          if (nowValue.includes(searching)) {
            count++;
          }
        }
      }
      if (count) {
        SearchTable.push(item);
      }
    });
    return SearchTable;
  },
};
export default useCommonHandler;
