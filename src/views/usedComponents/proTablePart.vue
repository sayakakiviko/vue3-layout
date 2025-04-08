<template>
  <div class="page-wrap">
    <h2 style="margin-bottom: 20px">表格1 - 接口获取表格数据</h2>
    <!--表格-->
    <div v-loading="loading">
      <ProTable
        border
        isSetting
        rowKey="number"
        ref="proTable"
        tableName="demo"
        :height="400"
        :tableData
        :tableColumns
        :allTableColumns="allColumns"
        :pagination="page"
        @pageChange="pageChange"
        @radioChange="radioChange"
        @confirmSetting="confirmSetting"
      >
        <template #header_age>
          <el-button type="primary">年龄T</el-button>
        </template>

        <template #expand>展开的插槽的内容</template>
        <template #number="scope">
          <el-link type="primary">{{ scope.row.number }}</el-link>
        </template>
        <template #name="scope">
          <el-input
            v-if="scope.row.status === 'edit'"
            v-model.trim="scope.row.name"
            placeholder="请输入"
          />
          <span v-else>{{ scope.row.name }}</span>
        </template>
        <template #handle="scope">
          <el-space>
            <el-link type="primary" @click="changeTableData(scope.row)">编辑</el-link>
            <el-link type="danger">删除</el-link>
          </el-space>
        </template>
      </ProTable>
    </div>

    <h2 style="margin-bottom: 20px">表格2 - 本地mock数据（前端分页）</h2>
    <ProTable
      border
      isSetting
      isSearch
      rowKey="number"
      tableName="demo2"
      :allTableColumns="allColumns"
      :tableData="tableData2"
      :tableColumns="tableColumns2"
      :pagination="page2"
      @dragSort="dragSort"
      @selectionChange="selectionChange"
      @confirmSetting="confirmSetting"
    >
      <template #number="scope">
        <el-link type="primary">{{ scope.row.number }}</el-link>
      </template>
      <template #name="scope">
        <el-input
          v-if="scope.row.status === 'edit'"
          v-model.trim="scope.row.name"
          placeholder="请输入"
          style="width: 96%"
        />
        <span v-else>{{ scope.row.name }}</span>
      </template>
      <template #handle="scope">
        <el-space>
          <el-link type="primary" @click="changeTableData(scope.row)">编辑</el-link>
          <el-link type="danger">删除</el-link>
        </el-space>
      </template>
    </ProTable>
  </div>
</template>

<script setup>
const proTable = ref(null); //表格ref
const loading = ref(false);
const requestApi = ref(window.$api.demo.getList);
const allColumns = ref([]); //全部的列
const tableColumns = ref([
  // {
  //   type: 'selection', //与单选互斥
  //   label: '复选',
  // },
  {
    type: 'radio', //与复选互斥
    label: '单选',
    align: 'center',
    width: 55,
  },
  // {
  //   type: 'drag',
  //   label: 'drag',
  //   width: 60,
  // },
  // {
  //   type: 'expand',
  //   label: '',
  // },
  //树状表格不建议使用序号
  {
    type: 'index',
    label: '序号',
    width: 70,
  },
  {
    prop: 'number',
    label: '编号',
    filter: 'input',
  },
  {
    prop: 'name',
    label: '姓名',
    filter: 'select',
    search: true, //该列是否可在顶部搜索框搜索出来（前端分页用）
    // width: 800,
    // fixed: true,
  },
  // {
  //   prop: 'age',
  //   label: '年龄',
  // },
  {
    prop: 'time',
    label: '创建时间',
    filter: 'date',
  },
  {
    prop: 'handle',
    label: '操作',
    fixed: 'right',
    width: 200,
  },
]);
const tableData = ref([]);
const page = reactive({
  pageNum: 1, //当前页
  pageSize: 10, //每页数
  total: 0, //数据总量
});

const tableColumns2 = ref([
  {
    type: 'selection', //与单选互斥
    label: '复选',
    reserveSelection: true, //数据刷新后是否保留选中项
  },
  // {
  //   type: 'radio', //与复选互斥
  //   label: '单选',
  //   align: 'center',
  //   width: 55,
  // },
  // {
  //   type: 'expand',
  //   label: '',
  // },
  {
    type: 'drag',
    label: 'drag',
    width: 60,
  },
  //树状表格不建议使用序号
  // {
  //   type: 'index',
  //   label: '序号',
  //   width: 70,
  // },
  {
    prop: 'number',
    label: '编号',
    filter: 'input',
  },
  {
    prop: 'name',
    label: '姓名',
    filter: 'select',
    search: true, //该列是否可在顶部搜索框搜索出来（前端分页用）
    // width: 800,
    // fixed: true,
  },
  {
    prop: 'age',
    label: '年龄',
  },
  {
    prop: 'time',
    label: '创建时间',
    filter: 'date',
  },
  {
    prop: 'handle',
    label: '操作',
    fixed: 'right',
    width: 200,
  },
]);
const tableData2 = ref([]);
const page2 = reactive({
  pageNum: 1, //当前页
  pageSize: 10, //每页数
  total: 21, //数据总量
  fullData: true, //全量数据返回
});
tableData2.value = [
  {
    number: '001',
    name: '张三',
    age: 18,
    // idCard: 18,
    // email: '595875750@qq.com',
    // address: '武汉',
    time: '2023-12-01',
    status: 'normal',
    // children: [
    //   {
    //     number: '002',
    //     name: '王五',
    //     age: 19,
    //     time: '2023-12-01',
    //     children: [
    //       {
    //         number: '005',
    //         name: '老六',
    //         age: 20,
    //         time: '2023-12-01',
    //         children: [],
    //       },
    //     ],
    //   },
    //   {
    //     number: '003',
    //     name: '狗蛋',
    //     age: 20,
    //     time: '2023-12-01',
    //     children: [],
    //   },
    // ],
  },
];
for (let i = 0; i < 18; i++) {
  tableData2.value.push({
    number: i,
    name: '李四',
    age: 20,
    time: '2023-12-04',
    status: 'normal',
  });
}
tableData2.value.push(
  {
    number: 25,
    name: '王五',
    age: 25,
    time: '2023-12-05',
    status: 'edit',
  },
  {
    number: 26,
    name: '老六',
    age: 26,
    time: '2023-12-06',
    status: 'normal',
  },
);

onMounted(() => {
  // console.log(proTable.value.element.stripe); //直接使用element表格的属性、方法
  getColumns();
  getData();
});

/**
 * 获取全部表头
 * */
const getColumns = () => {
  window.$api.demo.getColumns({ tableName: 'demo', userName: '' }).then((res) => {
    allColumns.value = res.data;
    //动态列设置筛选
    allColumns.value.map((item) => {
      item.prop === 'age' && (item.filter = 'select');
    });
  });
};
/**
 * 获取表格数据
 * */
const getData = () => {
  loading.value = true;
  window.$api.demo
    .getList({ id: 12, currentPage: page.pageNum })
    .then((res) => {
      tableData.value = res.data.list;
      page.total = res.data.total;
      // page.fullData = res.data.list.length === res.data.total; //是否全量数据返回
      // loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};
/**
 * 修改表格数据
 * @row {object} 修改的行
 * */
const changeTableData = (row) => {
  row.status = 'edit';
};
/**
 * 表格1分页（表格2为前端分页已做内部处理无需外部定义）
 * @pageNum {number} 页码
 * @pageSize {number} 每页显示数
 * */
const pageChange = (pageNum, pageSize) => {
  page.pageNum = pageNum;
  page.pageSize = pageSize;
  getData();
};
// const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
//   if (columnIndex === 3) {
//     if (rowIndex === 0) {
//       return {
//         rowspan: 1,
//         colspan: 1,
//       };
//     } else if (rowIndex === 1) {
//       return {
//         rowspan: 9,
//         colspan: 1,
//       };
//     } else {
//       return {
//         rowspan: 0,
//         colspan: 0,
//       };
//     }
//   }
// };
/**
 * 表格拖拽
 * @indexObj {object} 拖拽的数据的新旧下标
 * */
const dragSort = (indexObj) => {
  let oldIndex = indexObj.oldIndex + page2.pageSize * (page2.pageNum - 1); //拖拽元素的拖拽前的位置
  let newIndex = indexObj.newIndex + page2.pageSize * (page2.pageNum - 1); //拖拽元素的拖拽后的位置

  //元素交换位置
  function swapArrayElements(arr, index1, index2) {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
  }
  swapArrayElements(tableData2.value, oldIndex, newIndex);
};
/**
 * 表格复选框勾选
 * @list {array} 选择的数据
 * */
const selectionChange = (list) => {
  console.log(list);
};
/**
 * 表格单选
 * @val {string} 选择的数据
 * */
const radioChange = (val) => {
  console.log(val);
};
/**
 * 确认动态设置表头
 * @columns {array} 动态设置的列
 * */
const confirmSetting = (columns) => {
  // page.pageNum = 1;
  //保存设置的列
  // window.$api.demo.saveColumns({ tableName: 'demo', columns, userName: '' }).then((res) => {
  //   proTable.value.getColumns();
  // });
  // getData();
  console.log(columns);
};
</script>

<style lang="less" scoped></style>
