<!--登录页-->
<template>
  <div class="login">
    <div class="login-box">
      <!-- 左侧 -->
      <div class="login-left">
        <img src="@/assets/images//svg/login.svg" />
      </div>
      <!-- 右侧 -->
      <div class="login-right">
        <el-form :model="formLogin" class="demo-form-inline">
          <h3 class="login-form-title">账号登录</h3>
          <el-form-item>
            <el-input
              v-model="formLogin.username"
              placeholder="账号"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="formLogin.password"
              type="password"
              placeholder="密码"
              clearable
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-row justify="space-between" align="middle" style="width: 100%">
              <el-checkbox v-model="isRemember">记住密码</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码</el-link>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="onLogin">
              登录
            </el-button>
          </el-form-item>
          <!--<el-form-item>-->
          <!--  <el-button @click="onSubmit">注册</el-button>-->
          <!--</el-form-item>-->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store';

const userStore = useUserStore();
const router = useRouter();
//账号、密码
const formLogin = reactive({
  username: 'admin',
  password: '123456',
});
const isRemember = ref(true); //记住密码
const loading = ref(false); //登录加载

/**
 * 登录
 * */
const onLogin = () => {
  if (!formLogin.username || !formLogin.password)
    return window.$message.error('用户名和密码不能为空');

  loading.value = true;
  setTimeout(() => {
    loading.value = false;

    //用户信息
    const userInfo = {
      name: '张三丰',
      username: 'admin',
      role: 'admin',
      language: 'zh',
      avatar:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    };
    userStore.login(userInfo);
    router.push('/');
  }, 600);
};
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--el-color-white);
  .login-box {
    display: flex;
    width: 720px;
    height: 380px;
    box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.08);
    .login-left {
      overflow: hidden;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: 100%;
      background: linear-gradient(
        60deg,
        var(--el-color-primary),
        var(--el-color-primary-light-3)
      );
    }
    .login-right {
      width: 270px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 30px;
      box-sizing: border-box;
      .login-form-title {
        color: var(--color-text-1);
        font-weight: 500;
        font-size: 20px;
        line-height: 32px;
        margin-bottom: 20px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        .logo {
          width: 32px;
          height: 32px;
          margin-right: 6px;
        }
      }
      .el-form {
        width: 84%;
        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
