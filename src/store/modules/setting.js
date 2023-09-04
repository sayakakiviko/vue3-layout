import { defineStore } from 'pinia';

export const useSettingStore = defineStore({
  id: 'setting',
  state: () => ({
    themeColor: sessionStorage.getItem('themeColor') || '#409EFF', //主题色
    //默认提供的主题色板
    colorList: [
      '#409EFF',
      '#f5222d',
      '#4fc08d',
      '#faad14',
      '#13c2c2',
      '#722ed1',
    ],
    tabsShow: true, //页签显示状态
  }),
  actions: {
    /**
     * 更换主题色
     * @color {object} 路由对象
     * */
    changeThemeColor(color) {
      this.themeColor = color;
      sessionStorage.setItem('themeColor', color);
    },
  },
});
