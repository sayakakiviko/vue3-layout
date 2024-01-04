<!--标签导航栏-->
<template>
  <div class="nav-tab" :class="settingStore.tabsStyle">
    <el-tabs
      closable
      type="card"
      :model-value="route.path"
      @tab-remove="removeTab"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="(item, index) in navTabStore.tabList"
        :key="item.path"
        :name="item.path"
        :closable="item.path !== '/home'"
      >
        <template #label>
          <!--右键菜单-->
          <el-dropdown
            trigger="contextmenu"
            @visible-change="(visible) => dropdownVisible(visible, index)"
          >
            <span class="el-dropdown-link">{{ item.title }}</span>
            <template #dropdown v-if="item.contextmenu">
              <el-dropdown-menu>
                <el-dropdown-item @click="navTabStore.closeNavTab(item.path, 'left', route)">
                  关闭左侧
                </el-dropdown-item>
                <el-dropdown-item @click="navTabStore.closeNavTab(item.path, 'right', route)">
                  关闭右侧
                </el-dropdown-item>
                <el-dropdown-item @click="navTabStore.closeNavTab(item.path, 'other', route)">
                  关闭其他
                </el-dropdown-item>
                <el-dropdown-item @click="navTabStore.closeNavTab(item.path, 'all')">
                  关闭全部
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { useNavTabStore, useSettingStore } from '@/store';

const route = useRoute();
const router = useRouter();
const navTabStore = useNavTabStore();
const settingStore = useSettingStore(); //配置的store

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
  // const item = navTabStore.tabList.find((i) => i.path === key);
  navTabStore.removeTabItem(key);
  navTabStore.removeCacheItem(route.name);
};
/**
 * 右键菜单显示，隐藏其他已显示的右键菜单
 * @visible {boolean} 当前右键菜单显隐
 * @index {number} 当前右键菜单的标签的下标
 * */
const dropdownVisible = (visible, index) => {
  if (visible) {
    //隐藏其他已显示的右键菜单
    navTabStore.tabList.map((item, i) => {
      item.contextmenu = index === i;
    });
  }
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
        .el-dropdown-link {
          color: var(--el-color-primary);
        }
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
.cardSpace {
  :deep(.el-tabs__header) {
    .el-tabs__nav {
      border: none;
    }
    .el-tabs__item.is-closable {
      margin: 1px 8px 0 0;
      border: 1px solid var(--el-border-color-light);
      border-bottom: none;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
}
</style>
