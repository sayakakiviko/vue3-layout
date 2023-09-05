// import Vue from 'vue';
import { createI18n } from 'vue-i18n';
import LangZh from './lang/zh';
import LangEn from './lang/en';

// 注册i8n实例并引入语言文件
const i18n = createI18n({
  locale: 'zh', // 默认显示的语言
  messages: {
    zh: LangZh, // 引入语言文件
    en: LangEn,
  },
});

export default i18n; // 将i18n暴露出去，在main.js中引入挂载
