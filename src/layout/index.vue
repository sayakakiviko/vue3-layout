<template>
  <div class="layout">
    <el-container>
      <Aside></Aside>
      <el-container direction="vertical">
        <Header></Header>
        <NavTab v-if="useSettingStore().tabsShow"></NavTab>
        <el-main>
          <router-view>
            <template #default="{ Component, route }">
              <keep-alive :include="useNavTabStore().cacheList">
                <component :is="Component" :key="route.name" />
              </keep-alive>
            </template>
          </router-view>
        </el-main>
        <el-footer v-if="useSettingStore().isFooter">
          <div class="footer flx-center">
            <a href="#" target="_blank">2025 © PISX.</a>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup name="layout">
import Aside from './components/menu/Aside.vue';
import Header from './components/Header.vue';
import NavTab from './components/NavTab.vue';
import { useSettingStore, useNavTabStore } from '@/store';
</script>

<style scoped lang="less">
.el-main {
  padding: 10px 12px;
}
.el-footer {
  height: 30px;
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
  line-height: 30px;
  .flx-center {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      text-decoration: none;
      letter-spacing: 0.5px;
    }
  }
}
</style>
