<!--抽屉-全局配置-->
<template>
  <el-drawer v-model="isOpen" :size="300">
    <template #header>
      <label>全局配置</label>
    </template>
    <template #default>
      <div class="theme">
        <el-divider content-position="left">主题颜色</el-divider>
        <div class="theme-color">
          <el-color-picker
            v-model="settingStore.themeColor"
            :predefine="settingStore.colorList"
            @change="change"
          />
        </div>
      </div>
      <div class="content">
        <el-divider content-position="left">内容区域</el-divider>
        <el-row>
          <el-col :span="12">页签显示：</el-col>
          <el-col :span="12" style="text-align: right">
            <el-switch v-model="settingStore.tabsShow" />
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

//页签显示状态
// const tabsShow = ref(true);
</script>

<style lang="less">
.el-drawer__header {
  margin-bottom: 0;
  padding: 14px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}
</style>
<style scoped lang="less"></style>
