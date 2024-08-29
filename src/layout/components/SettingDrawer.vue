<!--抽屉-全局配置-->
<template>
  <el-drawer v-model="showDrawer" :size="300">
    <template #header>
      <label>{{ $t('系统文本.全局配置') }}</label>
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
        <el-divider content-position="left">{{ $t('系统文本.界面显示') }}</el-divider>
        <el-row>
          <el-col :span="12">{{ $t('系统文本.主题颜色') }}：</el-col>
          <el-col :span="12">
            <el-color-picker
              v-model="settingStore.themeColor"
              :predefine="settingStore.colorList"
              @change="change"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">{{ $t('系统文本.页签显示') }}：</el-col>
          <el-col :span="12">
            <el-switch v-model="settingStore.tabsShow" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">{{ $t('系统文本.页签风格') }}：</el-col>
          <el-col :span="12">
            <el-select v-model="settingStore.tabsStyle" size="small" style="width: 100px">
              <el-option :label="$t('系统文本.卡片')" value="card" />
              <el-option :label="$t('系统文本.间隔卡片')" value="cardSpace" />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">{{ $t('系统文本.菜单模式') }}：</el-col>
          <el-col :span="12">
            <el-select v-model="settingStore.accordion" size="small" style="width: 100px">
              <el-option :label="$t('系统文本.普通')" :value="false" />
              <el-option :label="$t('系统文本.手风琴')" :value="true" />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { useElementPlusTheme } from 'use-element-plus-theme';
import { useSettingStore } from '@/store';

const settingStore = useSettingStore(); //配置的store
const { changeTheme } = useElementPlusTheme(settingStore.themeColor);
const showDrawer = defineModel();

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
