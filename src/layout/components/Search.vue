<!--全局搜索-->
<template>
  <el-input
    v-model="data.keyword"
    :placeholder="$t('请输入')"
    class="search"
    size="small"
    @keydown.enter="onSearch"
  >
    <template #prepend>
      <el-select v-model.trim="data.selectVal" size="small">
        <el-option
          v-for="item in data.selectList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </template>
    <template #append>
      <el-button :icon="Search" size="small" @click="onSearch" />
    </template>
  </el-input>

  <!--全局搜索弹窗-->
  <el-dialog v-model="data.searchVisible" title="全局搜索">
    <el-input
      v-model.trim="data.keyword"
      :placeholder="$t('请输入')"
      class="search"
      size="small"
    >
      <template #prepend>
        <el-select v-model="data.selectVal" size="small">
          <el-option
            v-for="item in data.selectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #append>
        <el-button :icon="Search" size="small" />
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
        <el-button type="primary" @click="data.searchVisible = false">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';

const data = reactive({
  keyword: '', //搜索内容
  selectVal: 1, //选中的下拉
  selectList: [], //下拉列表
  searchVisible: false, //是否显示全局搜索弹窗
  tableData: [], //搜索结果
});

data.selectList = [
  {
    label: '全部',
    value: 1,
  },
  {
    label: 'CAD文档',
    value: 2,
  },
];

/**
 * 搜索
 * */
const onSearch = () => {
  if (!data.keyword) return window.$message.error('搜索内容不能为空');
  data.searchVisible = true;
  console.log(123);
};
</script>

<style scoped lang="less">
.search {
  width: 260px;
  background-color: var(--el-color-info-light-9);
  :deep(.el-select) {
    width: 60px;
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
