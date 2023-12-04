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
      :data="data.showTableData"
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
            <!-- radio。需要传入rowKey，唯一值，如id、编号 -->
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
        <el-table-column v-else show-overflow-tooltip v-bind="item">
          <!-- 表头筛选 -->
          <template #header="scope" v-if="item.filter">
            <span>{{ scope.column.label }}</span>
            <el-popover
              placement="bottom-start"
              :width="260"
              :hide-after="10"
              trigger="click"
            >
              <template #reference>
                <el-link class="filter-btn" :underline="false">
                  <el-icon size="12"><ArrowDownBold /></el-icon>
                </el-link>
              </template>
              <div class="table-filter-box">
                <div class="filter-top">
                  <div class="sub-title">
                    快捷操作
                    <el-link
                      class="title-btn"
                      type="primary"
                      :underline="false"
                      @click="onSort(scope.column.property, null)"
                    >
                      清空
                    </el-link>
                  </div>
                  <el-link
                    class="block-btn"
                    :class="{ 'active-color': data.activeSort === 1 }"
                    :underline="false"
                    @click="onSort(scope.column.property, 'ascending')"
                  >
                    <el-icon><SortUp /></el-icon>
                    升序排列
                  </el-link>
                  <el-link
                    :class="{ 'active-color': data.activeSort === 2 }"
                    :underline="false"
                    @click="onSort(scope.column.property, 'descending')"
                  >
                    <el-icon><SortDown /></el-icon>
                    降序排列
                  </el-link>
                </div>
                <div class="filter-bottom">
                  <div class="sub-title">
                    筛选条件
                    <el-link
                      class="title-btn"
                      type="primary"
                      :underline="false"
                      @click="clearFilter(scope.column, item, item.filter)"
                    >
                      清空
                    </el-link>
                  </div>
                  <div class="sub-section">{{ scope.column.label }}筛选</div>
                  <!-- 选择 -->
                  <el-select
                    v-if="item.filter === 'select'"
                    v-model="scope.column.filteredValue"
                    :teleported="false"
                    multiple
                    @change="changeFilter(scope.column, item, item.filter)"
                  >
                    <el-option
                      v-for="(val, index) in item.filterList"
                      :key="index"
                      :value="val"
                      :label="val"
                    />
                  </el-select>
                  <!-- 时间 -->
                  <el-date-picker
                    v-else-if="item.filter === 'date'"
                    type="daterange"
                    start-placeholder="请选择"
                    end-placeholder="请选择"
                    style="width: 90%"
                    :teleported="false"
                    v-model="scope.column.filteredValue"
                    @change="changeFilter(scope.column, item, item.filter)"
                  />
                  <!-- input -->
                  <el-input
                    v-else-if="item.filter === 'input'"
                    :placeholder="'请输入' + item.label"
                    v-model="scope.column.filteredValue"
                    @input="inputSearch(scope.column, item, item.filter)"
                  ></el-input>
                </div>
              </div>
            </el-popover>
          </template>
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

<script setup name="proTable">
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

let timer = null; // 维护一个 timer
const tableRef = ref(null); //表格ref
const data = reactive({
  loading: false, //加载状态
  activeSort: 0, //排序激活项
  showTableData: props.tableData, //实际展示的表格
  radio: '', //单选值
});

/** 表头筛选有下拉框的情况 */
watch(
  () => props.tableData,
  (val) => {
    props.tableColumns.map((column) => {
      //有筛选
      if (column.filter) {
        //下拉框筛选
        if (column.filter === 'select') {
          column.filterList = []; //下拉列表
          // column.filterVal = [];
          val.map((item) => {
            column.filterList.push(item[column.prop]);
          });
          column.filterList = Array.from(new Set(column.filterList));
        }
      }
    });
  },
  { deep: true, immediate: true },
);

/**
 * 排序
 * @prop {string} 排序的列
 * @type {string} ascending升序，descending降序，null清空排序
 */
const onSort = (prop, type) => {
  //颜色激活
  type
    ? (data.activeSort = (type === 'ascending' && 1) || 2)
    : (data.activeSort = 0);
  //排序方法
  tableRef.value.sort(prop, type);
};
/**
 * 文本框的筛选
 * @column {object} 筛选的列
 * @info {object} 筛选的列的数据
 * @filterType {string} 筛选类型。select。date
 */
const inputSearch = (column, info, filterType) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    changeFilter(column, info, filterType);
  }, 500);
};
/**
 * 下拉框、时间的筛选
 * @column {object} 筛选的列
 * @info {object} 筛选的列的数据
 * @filterType {string} 筛选类型。select。date
 */
const changeFilter = (column, info, filterType) => {
  info.filterVal = column.filteredValue; //选择的值
  data.showTableData = [];
  let filterCollect = []; //筛选的列的值

  props.tableColumns.map((column) => {
    if (column.filterVal && column.filterVal.length) {
      filterCollect.push({
        key: column.prop,
        value: column.filterVal,
      });
    }
  });

  props.tableData.map((item) => {
    let flag = true; //数据是否展示
    filterCollect.map((filter) => {
      //filter.key为列属性，filter.value为筛选输入、选择的值
      switch (filterType) {
        case 'input':
          var columnsValue = item[filter.key] + ''; //该列各行的值，统一转为字符串
          !columnsValue.includes(filter.value) && (flag = false);
          break;
        case 'select':
          !filter.value.includes(item[filter.key]) && (flag = false);
          break;
        case 'date':
          var startTime = new Date(filter.value[0]).getTime(); //开始时间，00:00:00
          var endTime = filter.value[1]; //结束时间，23:59:59
          // var endTime = new Date(filter.value[1]).getTime(); //结束时间,23:59:59
          var dataDate = new Date(item[filter.key]).getTime();

          //结束时间到结束日期的23:59:59
          endTime = new Date(
            endTime.getFullYear(),
            endTime.getMonth(),
            endTime.getDate(),
            23,
            59,
            59,
          ).getTime();
          !(startTime <= dataDate && endTime >= dataDate) && (flag = false);
          break;
      }
    });
    flag && data.showTableData.push(item);
  });
};
/**
 * 清空筛选
 * @column {object} 筛选的列
 * @info {object} 筛选的列的数据
 * @filterType {string} 筛选类型。select。date
 */
const clearFilter = (column, info, filterType) => {
  column.filteredValue = [];
  info.filterVal = [];
  data.showTableData = [];
  let filterCollect = [];

  props.tableColumns.map((column) => {
    if (column.filterVal && column.filterVal.length > 0) {
      filterCollect.push({
        key: column.prop,
        value: column.filterVal,
      });
    }
  });

  props.tableData.map((item) => {
    let flag = true; //数据是否展示
    filterCollect.map((filter) => {
      switch (filterType) {
        case 'input':
          !(item[filter.key].indexOf(filter.value) > -1) && (flag = false);
          break;
        case 'select':
          !filter.value.includes(item[filter.key]) && (flag = false);
          break;
      }
    });
    flag && data.showTableData.push(item);
  });
};

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
  :deep(.el-table__column-filter-trigger) {
    display: none;
  }
}
.table-filter-box {
  user-select: none;
  .filter-top {
    padding: 6px 10px 10px 10px;
    border-bottom: 1px solid #ddd;
    .sub-title {
      color: #999;
      margin-bottom: 10px;
    }
    .block-btn {
      display: block;
      margin-bottom: 4px;
    }
  }
  .filter-bottom {
    padding: 6px 10px;
    .sub-section {
      margin-bottom: 10px;
    }
  }
  .sub-title {
    color: #999;
    margin-bottom: 10px;
    .title-btn {
      vertical-align: top;
      float: right;
      font-size: 12px;
    }
  }
}
.active-color {
  color: var(--el-color-primary);
}
</style>
