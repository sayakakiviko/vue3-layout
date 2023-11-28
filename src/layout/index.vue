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

<style scoped lang="less"></style>
