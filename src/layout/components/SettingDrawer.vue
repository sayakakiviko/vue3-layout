<!--抽屉-全局配置-->
<template>
  <el-drawer v-model="showDrawer" :size="300">
    <template #header>
      <label>{{ $t('系统文本.全局配置') }}</label>
    </template>
    <template #default>
      <div class="content">
        <el-form label-width="160" label-position="left" size="small" class="demo-form-inline">
          <el-divider content-position="left">{{ $t('系统文本.主题设置') }}</el-divider>
          <el-form-item :label="$t('系统文本.主题颜色')">
            <el-color-picker
              v-model="settingStore.themeColor"
              :predefine="settingStore.colorList"
              @change="changeColor"
            />
          </el-form-item>
          <el-form-item :label="$t('系统文本.暗黑模式')">
            <el-switch v-model="settingStore.isDark" @change="settingStore.changeDark">
              <template #inactive-action>
                <el-icon><Sunny class="light-icon" /></el-icon>
              </template>
              <template #active-action>
                <el-icon><Moon /></el-icon>
              </template>
            </el-switch>
          </el-form-item>
          <el-form-item :label="$t('系统文本.灰色模式')">
            <el-switch
              v-model="settingStore.isGrey"
              @change="settingStore.changeGreyOrWeak('grey', !!$event)"
            />
          </el-form-item>
          <el-form-item :label="$t('系统文本.色弱模式')">
            <el-switch
              v-model="settingStore.isWeak"
              @change="settingStore.changeGreyOrWeak('weak', !!$event)"
            />
          </el-form-item>

          <el-divider content-position="left">{{ $t('系统文本.界面显示') }}</el-divider>
          <el-form-item :label="$t('系统文本.语言设置')">
            <el-select
              v-model="settingStore.language"
              @change="settingStore.changeLanguage(settingStore.language)"
            >
              <el-option label="中文" value="zh_CN" />
              <el-option label="english" value="en_US" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('系统文本.菜单展开模式')">
            <el-select v-model="settingStore.accordion">
              <el-option :label="$t('系统文本.普通')" :value="false" />
              <el-option :label="$t('系统文本.手风琴')" :value="true" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('系统文本.页签风格')">
            <el-select v-model="settingStore.tabsStyle">
              <el-option :label="$t('系统文本.卡片')" value="card" />
              <el-option :label="$t('系统文本.间隔卡片')" value="cardSpace" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('系统文本.页签显示')">
            <el-switch v-model="settingStore.tabsShow" />
          </el-form-item>
          <el-form-item :label="$t('系统文本.页脚')">
            <el-switch v-model="settingStore.isFooter" />
          </el-form-item>
        </el-form>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { Sunny, Moon } from '@element-plus/icons-vue';
import { useElementPlusTheme } from 'use-element-plus-theme';
import { useSettingStore } from '@/store';

const settingStore = useSettingStore(); //配置的store
const { changeTheme } = useElementPlusTheme(settingStore.themeColor);
const showDrawer = defineModel();

/**
 * 更换主题色
 * @color {string} 主题色值
 * */
const changeColor = (color) => {
  changeTheme(color);
  settingStore.changeTheme(settingStore.themeColor);
};
</script>

<style lang="less">
.el-drawer__header {
  margin-bottom: 0;
  padding: 14px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}
.el-drawer__body {
  padding-top: 10px;
}
</style>
<style scoped lang="less">
.el-form-item--small {
  margin-bottom: 8px;
  :deep(.el-form-item__content) {
    justify-content: end;
  }
}
.light-icon {
  color: #606266;
}
.dark-icon {
  border-radius: 50%;
  color: #cfd3dc;
  background-color: #141414;
}
</style>
