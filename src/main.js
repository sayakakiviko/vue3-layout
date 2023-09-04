import { createApp } from 'vue';
import { createPinia } from 'pinia'; // 替代vuex
import * as ElIcons from '@element-plus/icons-vue'; // element icon
import element, { ElMessage } from 'element-plus'; //引入message组件
import App from './App.vue';
import router from '@/router';
import api from '@/api';
import VueI18n from '@/i18n';
import directive from '@/utils/directive'; //自定义指令
import prototype from '@/utils/prototype'; //全局方法

import 'element-plus/dist/index.css';
import '@/assets/css/base.less';

//注册全局方法到window下
window.$api = api; //全局api
window.$fn = prototype; //全局方法
window.$message = ElMessage; //全局$message。调用：window.$message('消息');

const app = createApp(App);
//全局注册所有icon组件
for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component);
}

//注册全局自定义指令
app.directive('debounce', directive.debounce);
app.directive('focus', directive.focus);
app.directive('jump', directive.jump);

app.use(router);
app.use(createPinia());
app.use(VueI18n);
app.use(element);
app.mount('#app');
