<!--标签导航栏-->
<template>
  <div class="nav-tab">
    <el-tabs
      v-model="route.path"
      type="card"
      closable
      @tab-remove="removeTab"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="item in navTabStore.tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.path !== '/home/index'"
      />
    </el-tabs>
  </div>
</template>

<script setup>
import { useNavTabStore } from '@/store';

const route = useRoute();
const router = useRouter();
const navTabStore = useNavTabStore();

/**
 * 点击标签
 * @pane {object} 选项卡对象
 * */
const tabClick = (pane) => {
  router.push({ path: pane.props.name });
};
/**
 * 移除标签
 * @key {string} tab唯一值，这里是路由路径
 * */
const removeTab = (key) => {
  const item = navTabStore.tabList.find((i) => i.path === key);
  navTabStore.removeTabItem(key);
  navTabStore.removeCacheItem(route.name);
};
</script>

<style scoped lang="less">
.nav-tab {
  height: 40px;
  padding: 0 20px;
  background-color: var(--el-color-white);
  :deep(.el-tabs) {
    --el-tabs-header-height: 26px;
    margin-top: 13px;
    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      line-height: 32px;
    }
    .el-tabs__header {
      border-bottom: none;
      .is-active {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
      .el-tabs__item {
        border-bottom: none;
        &:first-child .el-icon {
          display: none;
        }
        &.is-closable {
          padding-left: 13px;
          padding-right: 13px;
        }
      }
    }
    .el-tabs__content {
      display: none;
    }
  }
}
</style>
