<!--
    name：表格组件
 -->
<template>
  <div class="pro-table" v-loading="data.loading">
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :row-key="rowKey"
      :border="border"
      :data="tableData"
      @selection-change="
        (list) => {
          emit('selectionChange', list);
        }
      "
    >
      <!-- 默认插槽 -->
      <slot />
      <template v-for="item in tableColumns" :key="item">
        <!--单选框/复选框/展开列/序号-->
        <el-table-column v-if="item.type" v-bind="item">
          <template #default="scope">
            <!-- expand -->
            <template v-if="item.type === 'expand'">
              <slot :name="item.type" v-bind="scope" />
            </template>
            <!-- radio。需要有传入的rowKey唯一值，如id、编号 -->
            <el-radio
              v-if="item.type === 'radio'"
              v-model="data.radio"
              :label="scope.row[rowKey]"
              @change="emit('radioChange', data.radio)"
            >
              <i></i>
            </el-radio>
          </template>
        </el-table-column>
        <!--其他列-->
        <el-table-column
          v-else
          show-overflow-tooltip
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template #default="scope">
            <!--需自定义列-->
            <slot :name="item.prop" v-bind="scope">
              {{ scope.row[item.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
      <!-- 设置按钮列 -->
      <el-table-column v-if="isSetting" width="45" fixed="right" align="right">
        <template #header>
          <el-link style="{font-size: 16px }" :underline="false">
            <el-icon><Setting /></el-icon>
          </el-link>
        </template>
      </el-table-column>
      <!-- 插入表格最后一行之后的插槽 -->
      <template #append>
        <slot name="append" />
      </template>
    </el-table>
    <!--分页-->
    <el-pagination
      v-if="pagination"
      layout="prev, pager, next"
      :total="50"
      background
    />
  </div>
</template>

<script setup>
const props = defineProps({
  //是否展示边框线
  border: {
    type: Boolean,
    default: false,
  },
  //是否要设置表头
  isSetting: {
    type: Boolean,
    default: false,
  },
  //是否需要分页
  pagination: {
    type: Boolean,
    default: false,
  },
  //行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  rowKey: {
    type: String,
    default: 'id',
  },
  //表格数据
  tableData: {
    type: Array,
    default: () => [],
  },
  //表头
  tableColumns: {
    type: Array,
    default: () => [],
  },
});

const tableRef = ref(null); //表格ref
const data = reactive({
  loading: false, //加载状态
  radio: '', //单选值
});

const emit = defineEmits(['selectionChange', 'radioChange']);

defineExpose({
  element: tableRef,
});
</script>

<style scoped lang="less">
.pro-table {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  :deep(.el-table tr th) {
    background: var(--el-fill-color-light);
    color: #333;
  }
}
</style>
