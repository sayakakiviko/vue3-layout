import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {}, //用户信息
  }),
  actions: {
    /**
     * 登录后设置用户登录信息
     * @userInfo {object} 用户信息
     * */
    login(userInfo) {
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      this.userInfo = userInfo;
      window.$message.success('登录成功');
    },
    /**
     * 退出登录
     * */
    logout() {
      sessionStorage.removeItem('userInfo');
      this.userInfo = {};
    },
  },
});
