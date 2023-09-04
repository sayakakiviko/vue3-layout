<template>
  <el-config-provider :locale="$i18n.locale === 'zh' ? zhCn : en">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';
import { useMenuStore, useNavTabStore } from '@/store';

const menuStore = useMenuStore();
const navTabStore = useNavTabStore();
const route = useRoute();

// 监听路由变化
watch(
  () => route.path,
  (newVal) => {
    menuStore.changeActive(newVal); //路径缓存在菜单
    handleNavTab();
  },
);

/**
 * 路由变化后添加对应的tab标签
 * */
const handleNavTab = () => {
  // console.log('路由对象', route)
  navTabStore.addTabItem({
    title: route.meta.title || '未命名',
    path: route.path,
    name: route.name,
  });
  route.meta.keepAlive && navTabStore.addCacheItem(route.name);
};
</script>

<style lang="less">
#app {
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: var(--el-color-info-light-9);
  line-height: 1.6;
  font-size: 14px;
}
</style>
