<!--左侧菜单栏-->
<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="side">
      <div class="logo" @click="router.push('/')">
        <img src="@/assets/images/vite.svg" />
        <!--<img v-show="!isCollapse" src="@/assets/images/logo.png" />-->
        <!--<img v-show="isCollapse" src="@/assets/images/logo_mini.png" />-->
      </div>
      <div class="menu-list">
        <el-scrollbar>
          <el-menu
            :default-active="menuStore.menuActive"
            :collapse="isCollapse"
            :unique-opened="useSettingStore().accordion"
            router
          >
            <MenuItem v-for="(item, index) in menuStore.menuList" :key="index" :value="item" />
          </el-menu>
        </el-scrollbar>
        <div class="collapse-wrapper" @click="isCollapse = !isCollapse">
          <el-icon>
            <Fold v-show="!isCollapse" />
            <Expand v-show="isCollapse" />
          </el-icon>
        </div>
      </div>
    </div>
  </el-aside>
</template>

<script setup>
import MenuItem from './MenuItem.vue';
import { useMenuStore, useSettingStore } from '@/store';

const menuStore = useMenuStore();
const router = useRouter();
const isCollapse = ref(false); //是否折叠菜单

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref(0);
let timer = null;

const listeningWindow = () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    screenWidth.value = document.body.clientWidth;
    if (!isCollapse.value && screenWidth.value < 1200) isCollapse.value = true;
    if (isCollapse.value && screenWidth.value > 1200) isCollapse.value = false;
  }, 100);
};
window.addEventListener('resize', listeningWindow, false);
onBeforeUnmount(() => {
  window.removeEventListener('resize', listeningWindow);
});
</script>

<style scoped lang="less">
.el-aside {
  z-index: 1;
  background-color: var(--el-color-white);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
  transition: all ease 0.35s;
  .logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    cursor: pointer;
    img {
      height: 40px;
      margin-top: 10px;
    }
  }
  .el-menu {
    height: calc(100vh - 90px);
    border-right: none;
    :deep(.el-menu-item.is-active) {
      background-color: var(--el-color-primary-light-9);
    }
  }
  .collapse-wrapper {
    height: 29px;
    padding-right: 20px;
    border-top: 1px var(--el-border-color) var(--el-border-style);
    text-align: right;
    line-height: 29px;
    cursor: pointer;
  }
}
</style>
