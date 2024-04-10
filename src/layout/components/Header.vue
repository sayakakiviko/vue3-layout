<!--顶部栏-->
<template>
  <el-header>
    <!--<h2>{{ $t('projectName') }}</h2>-->
    <Breadcrumb></Breadcrumb>
    <div class="right-bar">
      <!--搜索-->
      <Search></Search>

      <!--消息通知-->
      <el-popover placement="bottom" :width="260">
        <template #reference>
          <el-badge is-dot style="margin-top: 4px; cursor: pointer">
            <el-icon size="20"><Bell /></el-icon>
          </el-badge>
        </template>
        <template #default>
          <el-tabs v-model="data.activeName" class="demo-tabs">
            <el-tab-pane label="通知(1)" name="notice">User</el-tab-pane>
            <el-tab-pane label="待办" name="wait">Config</el-tab-pane>
          </el-tabs>
        </template>
      </el-popover>

      <!--语言切换-->
      <el-dropdown class="language">
        <el-icon size="22" style="outline: none"><SwitchFilled /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="userStore.changeLanguage('zh')">简体中文</el-dropdown-item>
            <el-dropdown-item @click="userStore.changeLanguage('en')">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!--用户信息-->
      <el-dropdown class="user-warp">
        <div class="user">
          <el-avatar :src="userInfo.avatar" :size="24" />
          <el-text>{{ userInfo.name }}</el-text>
          <el-icon color="#999"><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="data.showDrawer = true">
              {{ $t('顶部栏.全局配置') }}
            </el-dropdown-item>
            <!--语言切换-->
            <!--<el-dropdown-item class="language" style="padding: 8px 16px">
              <el-dropdown placement="left">
                <span class="el-dropdown-link">
                  {{ $t('header.language') }}
                  <el-icon class="el-icon&#45;&#45;right" style="margin: 0">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="userStore.changeLanguage('zh')">
                      简体中文
                    </el-dropdown-item>
                    <el-dropdown-item @click="userStore.changeLanguage('en')">
                      English
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-dropdown-item>-->
            <el-dropdown-item @click="logout">
              {{ $t('顶部栏.退出登录') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>

  <!--全局配置抽屉-->
  <SettingDrawer v-model:showDrawer="data.showDrawer"></SettingDrawer>
</template>

<script setup>
import Breadcrumb from './Breadcrumb.vue';
import Search from './Search.vue';
import SettingDrawer from './SettingDrawer.vue';
import { useUserStore } from '@/store';
import { ElMessageBox } from 'element-plus';

const data = reactive({
  showDrawer: false, //是否显示抽屉
  activeName: 'notice', //消息通知的激活项
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { userInfo } = userStore;

/**
 * 退出登录
 * */
const logout = () => {
  ElMessageBox.confirm('您确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.logout();
      router.replace('/login?return_url=' + encodeURIComponent(route.fullPath));
      // router.replace('/login');
    })
    .catch(() => {});
};
</script>

<style scoped lang="less">
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--el-color-white);
  border-bottom: 1px solid #ddd;
  .right-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      margin-left: 14px;
    }
  }
  .language {
    margin-top: -4px;
    color: #333;
    cursor: pointer;
  }
  .user {
    display: flex;
    align-items: center;
    margin-top: -4px;
    cursor: pointer;
    outline: none;
    .el-text {
      margin: 0 8px;
    }
  }
}
</style>
