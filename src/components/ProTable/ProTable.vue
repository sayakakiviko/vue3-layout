<!--
    名称：表格组件；如果你想使用 el-table 的任何属性、事件，通过属性透传都能支持，ProTable 组件内部暴露了 el-table DOM，可通过 proTable.value.element.方法名 调用他们
    属性：详见props
    插槽：自定义表头插槽为'header列的prop'；设置某列特殊样式插槽为'列的prop'；其他的与element plus表格组件插槽使用方法一致
    输出方法：
      selectionChange 复选框发生变化时会触发该事件，返回数组_选择的数据列表；
      radioChange 单选框发生变化时会触发该事件，返回对象_选择的数据；
      searchTable 搜索框内容改变会触发该事件，非前端分页时返回字符串_搜索的关键字；注：为前端分页时，可不使用该方法，会内部搜索有search标记的列。
      pageChange 页码或每页显示数改变会触发该事件，返回参数1为数字_当前页码，返回参数2为数字_每页显示数；注：为前端分页时，可不使用该方法。
                 前端分页开启方法：isPagination为true；pagination的fullData为true。

    使用示例：
      <ProTable
        border
        isSearch
        isPagination
        rowKey="number"
        ref="proTable"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :pagination="page"
        @pageChange="pageChange"
        @selectionChange="selectionChange"
        @radioChange="radioChange"
      >
        <template #expand>展开插槽，自定义填写的内容</template>
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
            <el-link type="primary" @click="onEdit(scope.row)">编辑</el-link>
            <el-link type="danger">删除</el-link>
          </el-space>
        </template>
      </ProTable>

      const tableColumns = [
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
          filter: 'input', //筛选类型。input/select/date
        },
        {
          prop: 'name',
          label: '姓名',
          filter: 'select',
          search: true, //该列是否可在顶部搜索框搜索出来（前端分页用）
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
      ];
 -->
<template>
  <div class="pro-table">
    <!--搜索-->
    <TableSearch v-if="isSearch" @searchTable="searchTable" />
    <!--表格-->
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
      <template v-for="item in tableColumns" :key="item.prop">
        <!-- 默认插槽 -->
        <slot />
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
              @change="emit('radioChange', scope.row)"
            >
              <i></i>
            </el-radio>
          </template>
        </el-table-column>
        <!--其他列-->
        <el-table-column v-else show-overflow-tooltip v-bind="item">
          <template #header="scope">
            <!-- 自定表头插槽 -->
            <slot :name="'header' + item.prop" v-bind="scope">
              {{ scope.column.label }}
            </slot>
            <!-- 表头筛选 -->
            <template v-if="item.filter">
              <el-popover placement="bottom-start" :width="260" :hide-after="10" trigger="click">
                <template #reference>
                  <el-link class="filter-btn" :underline="false">
                    <el-icon size="12"><ArrowDownBold /></el-icon>
                  </el-link>
                </template>
                <div class="table-filter-box">
                  <div class="filter-top">
                    <div class="sub-title">快捷操作</div>
                    <el-link
                      class="block-btn"
                      :class="{ 'active-color': scope.column.activeSort === 1 }"
                      :underline="false"
                      @click="onSort(scope.column, 'ascending', true)"
                    >
                      <el-icon><SortUp /></el-icon>
                      升序排列
                    </el-link>
                    <el-link
                      :class="{ 'active-color': scope.column.activeSort === 2 }"
                      :underline="false"
                      @click="onSort(scope.column, 'descending', true)"
                    >
                      <el-icon><SortDown /></el-icon>
                      降序排列
                    </el-link>
                  </div>
                  <div class="filter-bottom">
                    <div class="sub-title">筛选条件</div>
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
                      clearable
                      @input="inputFilter(scope.column, item, item.filter)"
                    ></el-input>
                  </div>
                </div>
              </el-popover>
            </template>
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
      <el-table-column v-if="isSetting" width="40" fixed="right" align="right">
        <template #header>
          <el-link
            style="{font-size: 16px }"
            :underline="false"
            @click="data.showHeaderSetting = true"
          >
            <el-icon><Setting /></el-icon>
          </el-link>
        </template>
      </el-table-column>
      <!-- 插入表格最后一行之后的插槽 -->
      <template #append>
        <slot name="append" />
      </template>
      <!-- 无数据 -->
      <template #empty>
        <div class="table-empty">
          <slot name="empty">
            <img src="@/assets/images/not_data.png" alt="notData" />
            <div>暂无数据</div>
          </slot>
        </div>
      </template>
    </el-table>
    <!--分页-->
    <Pagination
      v-if="isPagination"
      :pagination="pageable"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    />
  </div>
  <!--列设置-->
  <HeaderSetting
    v-model:isShow="data.showHeaderSetting"
    :allColumns="allColumns"
    :tableColumns="tableColumns"
    @confirmSetting="confirmSetting"
  ></HeaderSetting>
</template>

<script setup name="proTable">
import Pagination from './components/pagination.vue';
import TableSearch from './components/tableSearch.vue';
import HeaderSetting from './components/headerSetting.vue';

let timer = null; // 维护一个 timer
let searchTableData = []; //搜索框搜索出来的数据（前端分页用）
const tableRef = ref(null); //表格ref

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
  //是否需要搜索
  isSearch: {
    type: Boolean,
    default: false,
  },
  //是否需要分页
  isPagination: {
    type: Boolean,
    default: false,
  },
  //行数据的 Key，用来优化 Table 的渲染。单选时需要传入rowKey，唯一值，如id、编号
  rowKey: {
    type: String,
    default: 'id',
  },
  //全部的表头
  allColumns: {
    type: Array,
    default: () => [],
  },
  //表头
  tableColumns: {
    type: Array,
    default: () => [],
  },
  //表格数据
  tableData: {
    type: Array,
    default: () => [],
  },
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

const data = reactive({
  showHeaderSetting: false, //列设置弹窗的显隐
  radio: '', //单选值
  searchValue: '', //搜索内容
  sortColumn: {}, //激活排序的列
  filterCollect: {}, //筛选的列及值
  searchColumns: [], //可被顶部搜索框搜索出来的列（前端分页用）
  showTableData: [], //实际展示的表格
});

watch(
  () => props.tableData,
  (val) => {
    if (props.isPagination && props.pagination.fullData) {
      //若是有分页且全量数据返回了数据，则做前端分页
      const startIndex = (props.pagination.pageNum - 1) * props.pagination.pageSize; //计算截取的数据的初始位置
      data.showTableData = val.slice(startIndex, startIndex + props.pagination.pageSize);
    } else {
      data.showTableData = val;
    }

    //表头筛选有下拉框的情况
    nextTick(() => {
      getSelectOptions(data.showTableData);
    });
  },
  { deep: true, immediate: true },
);

const pageable = computed(() => props.pagination); //分页器
/**
 * 表头设置确认
 * @columns {array} 动态设置的列
 * */
const confirmSetting = (columns) => {
  clearFilterAll();
  pageable.value.pageNum = 1; //重置页码
  emit('confirmSetting', columns);
};
/**
 * 获取筛选的下拉选项
 * @list {array} 当前页的表格数据
 */
const getSelectOptions = (list) => {
  data.searchColumns = []; //置空数据，避免push相同数据
  props.tableColumns.map((column) => {
    column.search && data.searchColumns.push(column.prop); //可被顶部搜索框搜索出来的列
    //有筛选
    if (column.filter && column.filter === 'select') {
      //下拉框筛选
      column.filterList = []; //下拉列表
      // column.filterVal = [];
      list.map((item) => {
        column.filterList.push(item[column.prop]);
      });
      column.filterList = Array.from(new Set(column.filterList));
    }
  });
};
/**
 * 排序
 * @prop {string} 排序的列的
 * @type {string} ascending升序，descending降序，null清空排序
 * @flag {boolean} 是否是点击进来的
 */
const onSort = (column, type, flag) => {
  //重复点击同一排序
  if (column.order === type && flag) {
    tableRef.value.clearSort();
    column.activeSort = 0;
    return false;
  }

  data.sortColumn.activeSort = 0; //清空上一个设置的排序列
  tableRef.value.clearSort();
  //颜色激活
  type ? (column.activeSort = (type === 'ascending' && 1) || 2) : (column.activeSort = 0);
  tableRef.value.sort(column.property, type); //排序方法
  data.sortColumn = column; //赋值当前列
};
/**
 * 文本框的筛选
 * @column {object} 筛选的列
 * @info {object} 筛选的列的数据
 * @filterType {string} 筛选类型。select。date
 */
const inputFilter = (column, info, filterType) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    changeFilter(column, info, filterType);
  }, 500);
};
/**
 * 下拉框、时间的筛选
 * @column {object} 筛选的列
 * @info {object} 筛选的列的数据
 * @filterType {string} 筛选类型。input，select。date
 */
const changeFilter = (column, info, filterType) => {
  info.filterVal = column.filteredValue; //选择的值
  data.showTableData = [];

  //筛选的列的值
  data.filterCollect[column.property] = {
    key: column.property,
    value: column.filteredValue,
    filterType,
  };

  let tempList = [props.tableData]; //过滤过程中使用的临时二维数组
  if (props.isPagination && props.pagination.fullData) {
    //前端分页时的筛选
    const startIndex = (pageable.value.pageNum - 1) * pageable.value.pageSize;
    let list = props.tableData.slice(startIndex, startIndex + pageable.value.pageSize); //当前页的数据
    tempList = [list]; //过滤过程中使用的临时二维数组

    filterRes(tempList);
  } else {
    filterRes(tempList);
  }

  //若有排序需保持排序
  nextTick(() => {
    column.order && onSort(column, column.order);
    data.sortColumn.order && onSort(data.sortColumn, data.sortColumn.order);
  });
};
/**
 * 筛选的副方法
 * @tempList {array} 过滤过程中使用的临时二维数组
 */
const filterRes = (tempList) => {
  let filterCollect = Object.values(data.filterCollect); //对象的值转数组
  filterCollect.map((filter, index) => {
    tempList[index + 1] = []; //下一轮过滤使用的数组

    tempList[index].map((item) => {
      //filter.key为列属性；filter.value为筛选输入、选择的值；filter.filterType筛选类型
      let flag = true; //数据是否展示
      switch (filter.filterType) {
        case 'input':
          var columnsValue = item[filter.key] + ''; //该列各行的值，统一转为字符串
          columnsValue.length && (flag = columnsValue.includes(filter.value)); //有筛选值才做判断
          break;
        case 'select':
          filter.value.length && (flag = filter.value.includes(item[filter.key])); //有筛选值才做判断
          break;
        case 'date':
          //有筛选值才做判断
          if (filter.value) {
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
            flag = startTime <= dataDate && endTime >= dataDate;
          }
          break;
      }
      flag && tempList[index + 1].push(item); //将当前轮过滤到的数据存放到下一轮的数组里
    });
  });
  data.showTableData = tempList[tempList.length - 1]; //显示过滤后的数据
};
/**
 * 清空所有的筛选及排序
 */
const clearFilterAll = () => {
  //清空排序
  tableRef.value.clearSort();
  data.sortColumn.activeSort = 0;
  data.sortColumn = {}; //激活排序的列

  //清空筛选
  data.filterCollect = {}; //筛选的列及值
  props.tableColumns.map((column) => {
    column.filterVal = '';
    column.filteredValue = [];
  });
};
/**
 * 搜索表格
 * @value {string} 搜索内容
 */
const searchTable = (value) => {
  clearFilterAll();
  //前端分页情况
  if (props.isPagination && props.pagination.fullData) {
    searchTableData = [];
    props.tableData.map((item) => {
      data.searchColumns.map((prop) => {
        //匹配到搜索的数据
        item[prop].includes(value) && searchTableData.push(item);
      });
    });

    //展示搜索到的数据
    pageable.value.pageNum = 1; //重置页码
    pageable.value.total = searchTableData.length; //设置数据总量
    const startIndex = (pageable.value.pageNum - 1) * pageable.value.pageSize; //要截取的数据的初始下标
    data.showTableData = searchTableData.slice(startIndex, startIndex + pageable.value.pageSize);
  } else {
    emit('searchTable', data.searchValue); //非前端分页的搜索需要调取接口
  }
};
/**
 * page-size 改变时触发
 * @val {number} 每页显示数
 */
const sizeChange = (val) => {
  //全量数据返回，前端分页
  if (props.pagination.fullData) {
    let dataList = (searchTableData.length && searchTableData) || props.tableData; //有用框搜索数据
    data.showTableData = dataList.slice(0, val);
    getSelectOptions(data.showTableData);
  }

  pageable.value.pageSize = val;
  pageable.value.pageNum = 1; //改变每页显示数后，重置页码
  emit('pageChange', 1, pageable.value.pageSize); //当前页，每页显示数
  clearFilterAll();
};
/**
 * current-page 改变时触发
 * @val {number} 当前页码
 */
const currentChange = (val) => {
  //全量数据返回，前端分页
  if (props.pagination.fullData) {
    const startIndex = (val - 1) * pageable.value.pageSize; //计算截取的数据的初始位置
    let dataList = (searchTableData.length && searchTableData) || props.tableData; //有用框搜索数据
    //截取对应页码的数据
    data.showTableData = dataList.slice(startIndex, startIndex + pageable.value.pageSize);
    getSelectOptions(data.showTableData);
  }

  pageable.value.pageNum = val;
  emit('pageChange', val, pageable.value.pageSize); //当前页，每页显示数
  clearFilterAll();
};

const emit = defineEmits([
  'selectionChange',
  'radioChange',
  'searchTable',
  'pageChange',
  'confirmSetting',
]);
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
  .pagination {
    display: flex;
    justify-content: end;
    margin-top: 16px;
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
.el-table__empty-block {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .table-empty {
    padding: 100px 0;
    line-height: 30px;
  }
}
.active-color {
  color: var(--el-color-primary);
}
</style>
