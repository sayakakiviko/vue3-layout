<!--全局搜索-->
<template>
  <el-input
    v-model="data.keyword"
    placeholder="请输入搜索关键字"
    class="search"
    @change="onSearch"
  >
    <template #prepend>
      <el-select v-model.trim="data.selectVal">
        <el-option
          v-for="item in data.selectList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </template>
    <template #append>
      <el-button :icon="Search" @click="onSearch" />
    </template>
  </el-input>

  <!--全局搜索弹窗-->
  <el-dialog v-model="data.searchVisible" title="全局搜索">
    <el-input
      v-model.trim="data.keyword"
      placeholder="请输入搜索关键字"
      class="search"
    >
      <template #prepend>
        <el-select v-model="data.selectVal">
          <el-option
            v-for="item in data.selectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #append>
        <el-button :icon="Search" />
      </template>
    </el-input>
    <el-table :data="data.tableData">
      <el-table-column property="name" label="姓名" width="200" />
      <el-table-column property="name" label="年龄" />
      <el-table-column property="address" label="地址" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.searchVisible = false">取消</el-button>
        <el-button type="primary" @click="data.searchVisible = false">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';

const state = reactive({
  data: {
    keyword: '', //搜索内容
    selectVal: 1, //选中的下拉
    selectList: [], //下拉列表
    searchVisible: false, //是否显示全局搜索弹窗
    tableData: [], //搜索结果
  },
});
const { data } = toRefs(state);
const vm = state.data;

vm.selectList = [
  {
    label: 'CAD文档',
    value: 1,
  },
  {
    label: 'testtest',
    value: 2,
  },
];

/**
 * 搜索
 * */
const onSearch = () => {
  if (!vm.keyword) return window.$message.error('搜索内容不能为空');
  vm.searchVisible = true;
};
</script>

<style scoped lang="less">
.search {
  width: 320px;
  background-color: var(--el-color-info-light-9);
  :deep(.el-select) {
    width: 80px;
    font-size: 12px;
    .el-input__wrapper {
      padding: 1px 5px;
    }
    .el-input__suffix-inner > :first-child {
      margin-left: 2px;
      color: #666;
    }
  }
  :deep(.el-input__wrapper) {
    background-color: var(--el-fill-color-light);
  }
  :deep(.el-input-group__append) {
    background-color: var(--el-color-primary);
    padding: 0 16px;
    color: #fff;
    box-shadow: none;
  }
}
.el-table {
  margin-top: 20px;
  :deep(th.el-table__cell) {
    background-color: var(--el-color-info-light-9);
  }
}
</style>
