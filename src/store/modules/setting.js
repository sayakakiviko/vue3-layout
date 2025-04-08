import { defineStore } from 'pinia';
import VueI18n from '@/i18n';
import { getLightColor, getDarkColor } from '@/utils/color';

export const useSettingStore = defineStore('globalSetting', {
  state: () => ({
    //默认提供的主题色板
    colorList: ['#409EFF', '#f5222d', '#4fc08d', '#faad14', '#13c2c2', '#722ed1'],
    themeColor: '#409EFF', //主题色
    isDark: false, //是否开启暗黑模式
    isGrey: false, //是否开启灰色模式
    isWeak: false, //是否开启色弱模式
    language: 'zh_CN', //语言
    tabsStyle: 'card', //页签风格
    tabsShow: true, //页签显示状态
    accordion: false, //菜单手风琴模式
    isFooter: false, //是否显示页脚
  }),
  actions: {
    /**
     * 初始化主题
     * */
    initTheme() {
      this.changeDark(this.isDark);
      if (this.isGrey) this.changeGreyOrWeak('grey', true);
      if (this.isWeak) this.changeGreyOrWeak('weak', true);
    },
    /**
     * 切换语言
     * @val {string} 语言：zh_CN、en_US
     * */
    changeLanguage(val) {
      this.language = val;
      VueI18n.global.locale = val;
    },
    /**
     * 暗黑模式
     * @flag {boolean} 是否开启暗黑模式
     * */
    changeDark(flag) {
      this.isDark = flag;
      document.documentElement.setAttribute('class', (flag && 'dark') || '');
      this.changeTheme(this.themeColor);
    },
    /**
     * 修改主题
     * @val {boolean} 是否开启暗黑模式
     * */
    changeTheme(val) {
      if (!val) {
        //恢复默认主题色
        val = '#409EFF';
        this.themeColor = val;
      }

      // 计算主题颜色变化
      document.documentElement.style.setProperty('--el-color-primary', val);
      document.documentElement.style.setProperty(
        '--el-color-primary-dark-2',
        this.isDark ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`,
      );
      for (let i = 1; i <= 9; i++) {
        const primaryColor = this.isDark
          ? `${getDarkColor(val, i / 10)}`
          : `${getLightColor(val, i / 10)}`;
        document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor);
      }
    },
    /**
     * 灰色模式和色弱模式
     * @type {string} 类型。grey、weak
     * @value {boolean} 是否开启
     * */
    changeGreyOrWeak(type, value) {
      const body = document.body;
      if (!value) return body.removeAttribute('style');
      const styles = {
        grey: 'filter: grayscale(1)',
        weak: 'filter: invert(80%)',
      };
      body.setAttribute('style', styles[type]);

      //二者不可同时开启
      if (type === 'grey') {
        this.isWeak = false;
        this.isGrey = true;
      } else {
        this.isGrey = false;
        this.isWeak = true;
      }
    },
  },
  persist: {
    enabled: true,
  },
});
