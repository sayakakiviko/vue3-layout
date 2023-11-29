<!--首页-->
<template>
  <div class="home page-wrap">
    home
    <el-button
      type="primary"
      v-permission="['admin']"
      @click="dialogShow = true"
    >
      该按钮仅管理员可见
    </el-button>
    <!--表格-->
    <div class="table-box">
      <ProTable
        border
        rowKey="number"
        ref="proTable"
        :tableData="tableData"
        :tableColumns="tableColumns"
        @selectionChange="selectionChange"
        @radioChange="radioChange"
      >
        <template #expand>展开插槽</template>
        <template #number="scope">
          <el-link type="primary">{{ scope.row.number }}</el-link>
        </template>
      </ProTable>
    </div>
  </div>

  <UploadDialog
    isSingle
    :isShow="dialogShow"
    @close="dialogShow = false"
    @submit="submit"
  />
</template>

<script setup name="Home">
let dialogShow = ref(false);
const proTable = ref(null); //表格ref
const tableColumns = [
  // {
  //   type: 'selection', //与单选互斥
  //   label: '复选',
  // },
  {
    type: 'radio', //与复选互斥
    label: '单选',
    width: 55,
  },
  {
    type: 'expand',
    label: '',
  },
  {
    type: 'index',
    label: '序号',
    width: 70,
  },
  {
    prop: 'number',
    label: '编号',
  },
  {
    prop: 'name',
    label: '姓名',
    // width: 800,
    // fixed: true,
  },
  {
    prop: 'age',
    label: '年龄',
  },
];
const tableData = [
  {
    number: '001',
    name: '张三',
    age: 18,
  },
];

for (let i = 0; i < 10; i++) {
  tableData.push({
    number: i,
    name: '李四',
    age: 20,
  });
}

onMounted(() => {
  //直接使用element表格的属性、方法
  console.log(proTable.value.element.stripe);
});

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
 * 提交上传
 * @fileList {array} 上传的文件
 * */
const submit = (fileList) => {
  console.log(fileList);
};
</script>

<style lang="less" scoped>
.table-box {
  height: 600px;
}
</style>
