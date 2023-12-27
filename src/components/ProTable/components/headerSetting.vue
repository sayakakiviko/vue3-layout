<!--表格组件-列设置组件-->
<template>
  <el-dialog
    destroy-on-close
    v-model="isShowDialog"
    title="表格列设置"
    width="800"
    @close="closeSetting"
  >
    <section class="main-section">
      <div class="section-left">
        <div class="section-title">可选字段（共{{ data.leftDataList.length }}个）</div>
        <div class="section-box">
          <div class="section-top">
            <el-checkbox
              v-model="data.leftCheckAll"
              :indeterminate="data.leftIndeterminate"
              @change="(bool) => checkAllChange(bool, true)"
            >
              {{ data.leftCheckedList.length }}/{{ data.leftDataList.length }}条
            </el-checkbox>
          </div>
          <div class="section-bottom">
            <el-input
              placeholder="请输入搜索内容"
              style="margin-bottom: 4px"
              v-model="data.leftSearchValue"
              :suffix-icon="Search"
            />
            <el-scrollbar height="260px">
              <el-checkbox-group
                v-model="data.leftCheckedList"
                style="width: 96%"
                @change="(value) => checkedChange(value, true)"
              >
                <el-row>
                  <el-col :span="8" v-for="item in leftData" :key="item.prop">
                    <el-checkbox :label="item.prop">
                      <div class="row-text">
                        <el-tooltip placement="top" :content="item.label">
                          {{ item.label }}
                        </el-tooltip>
                      </div>
                    </el-checkbox>
                  </el-col>
                </el-row>
              </el-checkbox-group>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="section-middle">
        <el-button size="small" @click="toRight">
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        <el-button size="small" @click="toLeft">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
      </div>
      <div class="section-right">
        <div class="section-title">已选字段（共{{ data.rightDataList.length }}个）</div>
        <div class="section-box">
          <div class="section-top">
            <el-checkbox
              v-model="data.rightCheckAll"
              :indeterminate="data.rightIndeterminate"
              :disabled="rightData.length <= data.fixedData.length"
              @change="(bool) => checkAllChange(bool, false)"
            >
              {{ data.rightCheckedList.length }}/{{ data.rightDataList.length }}条
            </el-checkbox>
          </div>
          <div class="section-bottom">
            <el-input
              placeholder="请输入搜索内容"
              style="margin-bottom: 10px"
              v-model="data.rightSearchValue"
              :suffix-icon="Search"
            />
            <el-scrollbar height="260px">
              <el-checkbox-group
                v-model="data.rightCheckedList"
                @change="(value) => checkedChange(value, false)"
              >
                <!--<draggable-->
                <!--  v-model="rightList_search"-->
                <!--  animation="200"-->
                <!--  itemKey="title"-->
                <!--  handle=".row-mover"-->
                <!--&gt;-->
                <!--  <template #item="{ element, index }">-->
                <div v-for="item in rightData" :key="item.prop">
                  <el-checkbox :label="item.prop" :disabled="item.disabled">
                    <div class="check-row">
                      <!--<el-icon class="row-mover" v-if="!data.rightSearchValue">-->
                      <!--  <MoreFilled />-->
                      <!--</el-icon>-->
                      <div class="row-text">
                        <el-tooltip placement="top" :content="item.label">
                          {{ item.label }}
                        </el-tooltip>
                      </div>
                      <el-link
                        v-if="!item.disabled && !data.rightSearchValue"
                        class="row-btn"
                        :underline="false"
                        @click.prevent="goTop(item.label)"
                      >
                        <el-icon><Top /></el-icon>
                      </el-link>
                    </div>
                  </el-checkbox>
                </div>
                <!--</template>-->
                <!--</draggable>-->
              </el-checkbox-group>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </section>
    <template #footer>
      <span class="dialog-footer">
        <!--<el-button v-if="tableName" link class="btn-left" @click="reset">-->
        <!--  <el-icon><Refresh /></el-icon>-->
        <!--  恢复默认-->
        <!--</el-button>-->
        <el-button link class="btn-left" @click="onReset">
          <el-icon><Refresh /></el-icon>
          恢复默认
        </el-button>
        <el-button @click="closeSetting">取消</el-button>
        <el-button type="primary" @click="confirmSetting">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
// import draggable from 'vuedraggable';

const props = defineProps({
  //弹框显隐
  isShow: {
    type: Boolean,
    default: false,
  },
  //表格名称。设置动态列时必传
  tableName: {
    type: String,
    default: '',
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
});

const data = reactive({
  fixedData: [], //固定显示在列设置右侧的数据
  initLeftData: [], //初始化时左侧数据
  initRightData: [], //初始化时右侧数据
  openLeftData: [], //弹窗打开时左侧数据
  openRightData: [], //弹窗打开时右侧数据
  leftCheckAll: false, //标记左侧是否已全选
  leftIndeterminate: false, //左侧的不确定状态，仅负责样式控制
  leftSearchValue: '', //左侧搜索框
  leftDataList: [], //左侧的复选框数据
  leftCheckedList: [], //左侧选中的数据
  rightCheckAll: false, //标记右侧是否已全选
  rightIndeterminate: false, //右侧的不确定状态，仅负责样式控制
  rightSearchValue: '', //左侧搜索框
  rightDataList: [], //左侧的复选框数据
  rightCheckedList: [], //右侧选中的数据
});
const append = [];
const proTable = JSON.parse(localStorage.getItem('proTable_' + props.tableName)); //获取存在本地设置的表头

//获取传递来的表头
watch(
  () => props.allColumns,
  (newVal) => {
    //固定显示在列设置右侧的数据
    props.tableColumns.map((item) => {
      if (item.label !== '操作' && item.prop) {
        item.disabled = true;
        data.fixedData.push(item);
      } else if (item.label === '操作') {
        append.push(item); //存入要追加的列
      }
    });

    //左侧数据
    const leftList = props.allColumns.filter((item) => {
      return data.fixedData.every((key) => item.prop !== key.prop);
    });

    data.leftDataList = [...leftList]; //左侧未显示在表格的列
    data.rightDataList = [...data.fixedData]; //右侧已显示在表格的列

    if (proTable?.right) {
      data.leftDataList = proTable.left;
      data.rightDataList = proTable.right;
      // tableColumns.value = proTable.columns;
    }

    //获得初始数据，需脱离对象引用
    data.initLeftData = JSON.parse(JSON.stringify(data.leftDataList));
    data.initRightData = JSON.parse(JSON.stringify(data.rightDataList));
  },
);
//获取弹窗开启时的数据
watch(
  () => props.isShow,
  (newVal) => {
    if (newVal) {
      // if (proTable.right) {
      //   data.leftDataList = proTable.left;
      //   data.rightDataList = proTable.right;
      // }

      //获得初始数据，需脱离对象引用
      data.openLeftData = JSON.parse(JSON.stringify(data.leftDataList));
      data.openRightData = JSON.parse(JSON.stringify(data.rightDataList));
    }
  },
);

//弹框显隐
const isShowDialog = computed({
  get() {
    return props.isShow;
  },
  set() {
    emit('update:isShow', false);
  },
});
//实际使用的左侧列表
const leftData = computed(() => {
  return data.leftDataList.filter((item) => item.label.includes(data.leftSearchValue));
});
// //实际使用的右侧列表
const rightData = computed(() => {
  return data.rightDataList.filter((item) => item.label.includes(data.rightSearchValue));
});

// 表头
const tableColumns = computed(() => props.tableColumns);
//若设置了表头用已设置的表头
proTable?.right && tableColumns.value.splice(0, tableColumns.value.length + 1, ...proTable.columns);

/**
 * 右侧全选复选框change事件
 * @bool {boolean} 是否全选
 * @type {boolean} true为左侧列表，false为右侧列表
 * */
const checkAllChange = (bool, type) => {
  data[(type && 'leftCheckedList') || 'rightCheckedList'] = bool
    ? (type && data.leftDataList.map((item) => item.prop)) || //左侧全选的处理
      data.rightDataList //右侧全选。因为右侧有固定显示列不允许勾选需要过滤禁选项
        .filter((item) => data.fixedData.every((el) => el.prop !== item.prop))
        .map((item) => item.prop)
    : [];

  data[(type && 'leftIndeterminate') || 'rightIndeterminate'] = false;
};
/**
 * 右侧复选框列表change事件
 * @value {array} 勾选的数据
 * @type {boolean} true为左侧列表，false为右侧列表
 * */
const checkedChange = (value, type) => {
  const dataListLen = data[(type && 'leftDataList') || 'rightDataList'].length;
  const checkedCount = value.length;

  data[(type && 'leftCheckAll') || 'rightCheckAll'] = checkedCount === dataListLen;
  data[(type && 'leftIndeterminate') || 'rightIndeterminate'] =
    checkedCount > 0 && checkedCount < dataListLen;
};
/**
 * 右移按钮，左侧勾选的数据移动到右侧
 * */
const toRight = () => {
  data.leftCheckedList.map((el) => {
    let i = data.leftDataList.findIndex((cel) => cel.prop === el);
    i > -1 && data.rightDataList.push(data.leftDataList.splice(i, 1)[0]);
  });

  //置空左侧选中
  data.leftCheckedList = [];
  data.leftIndeterminate = false;
  data.leftCheckAll = false;
};
/**
 * 左移按钮，右侧勾选的数据移动到左侧
 * */
const toLeft = () => {
  data.rightCheckedList.map((el) => {
    let i = data.rightDataList.findIndex((cel) => cel.prop === el);
    i > -1 && data.leftDataList.push(data.rightDataList.splice(i, 1)[0]);
  });

  //置空右侧选中
  data.rightCheckedList = [];
  data.rightIndeterminate = false;
  data.rightCheckAll = false;
};
/**
 * 右侧项置顶
 * @label {string} 要置顶的数据的label
 * */
const goTop = (label) => {
  data.rightDataList.map((item, index) => {
    // item.label === label && data.rightDataList.unshift(data.rightDataList.splice(index, 1)[0]);
    //置顶的数据只能跟在固定列的后面
    console.log(data.fixedData.length);
    item.label === label &&
      data.rightDataList.splice(data.fixedData.length, 0, data.rightDataList.splice(index, 1)[0]);
  });
};
/**
 * 恢复默认
 * */
const onReset = () => {
  //初始化数据，需脱离对象引用
  data.leftDataList = JSON.parse(JSON.stringify(data.initLeftData));
  data.rightDataList = JSON.parse(JSON.stringify(data.initRightData));

  //初始化左侧
  data.leftSearchValue = '';
  data.leftCheckedList = [];
  data.leftIndeterminate = false;
  data.leftCheckAll = false;

  //初始化右侧
  data.rightSearchValue = '';
  data.rightCheckedList = [];
  data.rightIndeterminate = false;
  data.rightCheckAll = false;
};
/**
 * 关闭弹窗
 * */
const closeSetting = () => {
  //初始化左侧
  data.leftSearchValue = '';
  data.leftCheckedList = [];
  data.leftIndeterminate = false;
  data.leftCheckAll = false;

  //初始化右侧
  data.rightSearchValue = '';
  data.rightCheckedList = [];
  data.rightIndeterminate = false;
  data.rightCheckAll = false;
  emit('update:isShow', false);
};
/**
 * 确认
 * */
const confirmSetting = () => {
  //要显示的列（不含固定显示的列）
  // const column = data.rightDataList.filter((item) =>
  //   data.fixedData.every((key) => item.prop !== key.prop),
  // );

  const columns = data.rightDataList.map((item) => item.prop); //要显示的列（含固定显示的列）
  const index = tableColumns.value.findIndex((v) => v.prop === data.fixedData[0].prop); // 找到第一个固定显示列的位置
  tableColumns.value.splice(index, data.openRightData.length); //先移除表格里的动态列
  tableColumns.value.splice(index + 1, 0, ...data.rightDataList); //然后新增更改后的动态列

  //表头数据存入本地
  const list = tableColumns.value.filter((item) => append.every((el) => item.prop !== el.prop)); //去重
  const obj = {
    left: data.leftDataList,
    right: data.rightDataList,
    columns: [...list, ...append],
  };
  localStorage.setItem('proTable_' + props.tableName, JSON.stringify(obj)); //将设置的表头数据保存在本地

  emit('confirmSetting', columns);
  closeSetting();
};
const emit = defineEmits(['update:isShow', 'confirmSetting']);
</script>

<style lang="less" scoped>
.main-section {
  display: flex;
  width: 760px;
  height: 400px;
  .section-left {
    width: 460px;
    height: 100%;
    flex-shrink: 0;
    .section-title {
      height: 40px;
      width: 100%;
      line-height: 40px;
    }
    .section-box {
      height: calc(100% - 40px);
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      .section-top {
        padding: 4px 10px 2px 10px;
        border-bottom: 1px solid #eee;
      }
      .section-bottom {
        padding: 8px 10px;
        .row-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
          width: 126px;
        }
      }
    }
  }
  .section-middle {
    height: 100%;
    width: 100%;
    flex-shrink: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .el-button {
      margin: 0 0 8px 0;
      padding: 10px 6px;
    }
  }
  .section-right {
    width: 248px;
    height: 100%;
    flex-shrink: 0;
    .section-title {
      height: 40px;
      width: 100%;
      line-height: 40px;
    }
    .section-box {
      height: calc(100% - 40px);
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      .section-top {
        padding: 4px 10px 2px 10px;
        border-bottom: 1px solid #eee;
      }
      .section-bottom {
        padding: 8px 4px 8px 10px;
        .el-checkbox {
          width: 100%;
          margin-right: 0;
          :deep(.el-checkbox__label) {
            width: calc(100% - 30px);
            padding-right: 6px;
          }
        }
        .check-row {
          width: 100%;
          background: #fff;
          .row-mover {
            margin-right: 6px;
          }
          .row-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            width: 154px;
          }
          .row-btn {
            float: right;
          }
        }
      }
    }
  }
}
.dialog-footer {
  .btn-left {
    float: left;
  }
}
</style>
