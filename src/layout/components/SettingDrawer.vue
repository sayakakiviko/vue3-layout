<!--抽屉-全局配置-->
<template>
  <el-drawer v-model="isOpen" :size="300">
    <template #header>
      <label>全局配置</label>
    </template>
    <template #default>
      <!--<div class="theme">-->
      <!--  <el-divider content-position="left">主题颜色</el-divider>-->
      <!--  <div class="theme-color">-->
      <!--    <el-color-picker-->
      <!--      v-model="settingStore.themeColor"-->
      <!--      :predefine="settingStore.colorList"-->
      <!--      @change="change"-->
      <!--    />-->
      <!--  </div>-->
      <!--</div>-->
      <div class="content">
        <el-divider content-position="left">界面显示</el-divider>
        <el-row>
          <el-col :span="12">主题颜色：</el-col>
          <el-col :span="12">
            <el-color-picker
              v-model="settingStore.themeColor"
              :predefine="settingStore.colorList"
              @change="change"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">页签显示：</el-col>
          <el-col :span="12">
            <el-switch v-model="settingStore.tabsShow" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">页签风格：</el-col>
          <el-col :span="12">
            <el-select v-model="settingStore.tabsStyle" size="small" style="width: 100px">
              <el-option label="卡片" value="card" />
              <el-option label="间隔卡片" value="cardSpace" />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">菜单手风琴模式：</el-col>
          <el-col :span="12">
            <el-switch v-model="settingStore.accordion" />
          </el-col>
        </el-row>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { useElementPlusTheme } from 'use-element-plus-theme';
import { useSettingStore } from '@/store';

/* like props */
const props = defineProps({
  //是否显示抽屉
  showDrawer: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:showDrawer']);

//是否显示抽屉
const isOpen = computed({
  get: () => props.showDrawer,
  set: (val) => {
    emit('update:showDrawer', false); // 触发父组件值更新
  },
});

const settingStore = useSettingStore(); //配置的store
const { changeTheme } = useElementPlusTheme(settingStore.themeColor);
/**
 * 更换主题色
 * @color {object} 路由对象
 * */
const change = (val) => {
  changeTheme(val);
  settingStore.changeThemeColor(settingStore.themeColor);
};
</script>

<style lang="less">
.el-drawer__header {
  margin-bottom: 0;
  padding: 14px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}
</style>
<style scoped lang="less">
.el-row {
  padding: 4px 0;
  .el-col + .el-col {
    text-align: right;
  }
}
</style>
