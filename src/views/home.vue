<!--首页-->
<template>
  <div class="home page-wrap">
    <el-button type="primary" v-permission="['admin']" @click="dialogShow = true">
      该按钮仅管理员可见
    </el-button>
    <!--表格-->
    <div style="height: 620px">
      <ProTable
        border
        isSetting
        isSearch
        isPagination
        rowKey="number"
        ref="proTable"
        tableName="demo"
        :allColumns="allColumns"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :pagination="page"
        @pageChange="pageChange"
        @selectionChange="selectionChange"
        @radioChange="radioChange"
        @confirmSetting="confirmSetting"
      >
        <template #headerAge>
          <el-button type="primary">年龄</el-button>
        </template>

        <template #expand>展开插槽</template>
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
  </div>

  <UploadDialog isSingle :isShow="dialogShow" @close="dialogShow = false" @submit="submit" />
</template>

<script setup name="Home">
let dialogShow = ref(false);
const proTable = ref(null); //表格ref
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
  total: 21, //数据总量
  fullData: true, //全量数据返回
});
tableData.value = [
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
  tableData.value.push({
    number: i,
    name: '李四',
    age: 20,
    time: '2023-12-04',
    status: 'normal',
  });
}
tableData.value.push(
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
  console.log(proTable.value.element.stripe); //直接使用element表格的属性、方法
  getColumns();
  getData();
});

/**
 * 获取全部表头
 * */
const getColumns = () => {
  window.$api.demo.getColumns({ tableName: 'demo', userName: '' }).then((res) => {
    allColumns.value = res.data;
  });
};
/**
 * 获取表格数据
 * */
const getData = () => {
  window.$api.demo.getList({ id: 0, currentPage: page.pageNum }).then((res) => {
    tableData.value = res.data.list;
    page.total = res.data.total;
    page.fullData = res.data.list.length === res.data.total;
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
 * 分页
 * @pageNum {number} 页码
 * @pageSize {number} 每页显示数
 * */
const pageChange = (pageNum, pageSize) => {
  page.pageNum = pageNum;
  page.pageSize = pageSize;
  // getData();
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
};
/**
 * 提交上传
 * @fileList {array} 上传的文件
 * */
const submit = (fileList) => {
  console.log(fileList);
};
</script>

<style lang="less" scoped></style>
