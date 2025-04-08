<!--表格组件-分页组件-->
<template>
  <section class="pagination">
    <el-pagination
      background
      size="small"
      :total="pageable.total"
      v-model:current-page="pageable.pageNum"
      v-model:page-size="pageable.pageSize"
      layout="total, sizes, prev, pager, next"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="
        (val) => {
          emit('sizeChange', val);
        }
      "
      @current-change="
        (val) => {
          emit('currentChange', val);
        }
      "
    />
  </section>
</template>

<script setup>
const props = defineProps({
  //分页
  pagination: {
    type: Object,
    default: () => {
      return {
        pageSize: 10, //每页显示数
        pageNum: 1, //当前页码
        total: 0, //数据总量
        fullData: false, //是否全量数据返回
      };
    },
  },
});
const pageable = computed(() => props.pagination); //分页器

const emit = defineEmits(['sizeChange', 'currentChange']);
</script>

<style scoped lang="less"></style>
