<!--表格组件-表格搜索组件-->
<template>
  <section class="search">
    <el-input
      v-model.trim="searchValue"
      placeholder="请输入内容"
      :size="size"
      :suffix-icon="Search"
      @change="emit('searchTable', searchValue)"
      clearable
    />
  </section>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';

defineProps({
  size: {
    type: String,
  },
});

const searchValue = ref(''); //搜索内容
const emit = defineEmits(['searchTable']);
</script>

<style scoped lang="less">
.search {
  margin-bottom: 16px;
  text-align: right;
  .el-input {
    width: 220px;
  }
}
</style>
