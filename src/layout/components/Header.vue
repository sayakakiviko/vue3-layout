<!--顶部栏-->
<template>
  <el-header>
    <h2>{{ $t('projectName') }}</h2>
    <el-space wrap size="large">
      <!--搜索-->
      <Search></Search>

      <!--消息通知-->
      <el-popover placement="bottom" trigger="click" :width="260">
        <template #reference>
          <el-badge is-dot style="cursor: pointer">
            <el-icon size="22"><Bell /></el-icon>
          </el-badge>
        </template>
        <template #default>
          <el-tabs v-model="data.activeName" class="demo-tabs">
            <el-tab-pane label="通知(1)" name="notice">User</el-tab-pane>
            <el-tab-pane label="待办" name="wait">Config</el-tab-pane>
          </el-tabs>
        </template>
      </el-popover>

      <!--用户信息-->
      <el-dropdown class="user-warp" trigger="click">
        <div class="user">
          <el-avatar
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            :size="32"
          />
          <el-text>张三</el-text>
          <el-icon color="#999"><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="data.showDrawer = true">
              {{ $t('header.global') }}
            </el-dropdown-item>
            <!--语言切换-->
            <el-dropdown-item class="language" style="padding: 8px 16px">
              <el-dropdown placement="left">
                <span class="el-dropdown-link">
                  {{ $t('header.language') }}
                  <el-icon class="el-icon--right" style="margin: 0">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="$i18n.locale = 'zh'">
                      简体中文
                    </el-dropdown-item>
                    <el-dropdown-item @click="$i18n.locale = 'en'">
                      English
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              {{ $t('header.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-space>
  </el-header>

  <!--全局配置抽屉-->
  <SettingDrawer v-model:showDrawer="data.showDrawer"></SettingDrawer>
</template>

<script setup>
import Search from './Search.vue';
import SettingDrawer from './SettingDrawer.vue';

const state = reactive({
  data: {
    showDrawer: false, //是否显示抽屉
    activeName: 'notice', //消息通知的激活项
  },
});
const { data } = toRefs(state);
const vm = state.data;
const router = useRouter();

/**
 * 退出登录
 * */
const logout = () => {
  router.replace('/login');
  sessionStorage.removeItem('userInfo');
};
</script>

<style scoped lang="less">
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--el-color-white);
  border-bottom: 1px solid #ddd;
  .user {
    display: flex;
    align-items: center;
    margin-top: -10px;
    cursor: pointer;
    outline: none;
    .el-text {
      margin: 0 8px;
    }
  }
}
</style>
