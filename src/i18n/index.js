// import Vue from 'vue';
import { createI18n } from 'vue-i18n';
import zh_CN from './lang/zh_CN';
import en_US from './lang/en_US';

// 注册i8n实例并引入语言文件
const i18n = createI18n({
  locale: 'zh', // 默认显示的语言
  messages: {
    zh: zh_CN, // 引入语言文件
    en: en_US,
  },
});

export default i18n; // 将i18n暴露出去，在main.js中引入挂载
