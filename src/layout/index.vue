<template>
  <div class="layout">
    <el-config-provider :locale="$i18n.locale === 'zh' ? zhCn : en">
      <el-container>
        <Aside></Aside>
        <el-container direction="vertical">
          <Header></Header>
          <NavTab v-if="useSettingStore().tabsShow"></NavTab>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </el-config-provider>
  </div>
</template>

<script setup name="layout">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';
import Aside from './components/Aside.vue';
import Header from './components/Header.vue';
import NavTab from './components/NavTab.vue';
import { useSettingStore } from '@/store';
</script>

<style scoped lang="less"></style>
