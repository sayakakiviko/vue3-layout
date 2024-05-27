# vue3框架
Vite 搭建的 ts/js + vue3 框架。使用的技术栈有：
- 编程语言：TypeScript | JavaScript
- 构建工具：Vite 5.x
- 前端框架：Vue 3.x
- 路由工具：Vue Router 4.x
- 状态管理：Pinia
- UI 框架：Element Plus
- CSS 预编译： Less
- HTTP 工具：Axios
- 代码规范：EditorConfig + Prettier + ESLint
- 提交规范：Commitizen

需要node版本 16+。

安装 `npm i`

运行 `npm run dev`

打包 `npm run build`

## 说明
- @/utils下有已经封装好的自定义指令、全局方法、axios等；接口的封装和拦截也都在axios.js里。具体可使用的指令、方法请看工程结构处说明
- @/router/routes.js文件是路由表，路由拦截则在同级的index.js内


**全局方法**

全局性的事件挂载到了window下，有$api、$fn、$message
```js
//调用
console.log('调用全局方法：', window.$fn.$timeFormat(1646038433000));

// 调用 API 接口 
// window.$api.文件名.该文件下的接口(入参)
await window.$api.common.getUserInfo({ name: 'a' });//query传参
await window.$api.demo.getUserName(123);//params传参

//调用$message
window.$message('消息');
```

# 整体工程结构
<pre>
│  .editorconfig             //统一不同IDE编辑器上的风格
│  .eslintignore             //eslint忽略配置
│  .eslintrc.js              //eslint配置
│  .eslintrc-auto-import.json             //避免自动引入vue3 api后页面报未定义的错误
│  .gitignore                //git忽略配置
│  .prettierrc.js            //prettierrc配置
│  components.d.ts           //UI组件按需自动引入文件，使用了新的组件它会自动在文件内新增。由unplugin-vue-components自动生成
│  index.html                //主页模版
│  jsconfig.json             //js配置文件
│  package.json              //package配置
│  package-lock.json         //package锁定文件
│  README.md                 //readme
│  vite.config.js            //全局配置文件
│
├─public                    //公共资源存放目录
│      favicon.ico          //网站icon
│
└─src
    │─App.vue              //页面根组件
    │─auto-import.d.js     //需要自动导入的vue3的api的配置
    │─main.js              //入口文件
    │  
    ├─api                  //api定义目录
    │  ├─index.js          //api统一出口文件
    │  └─user.js
    │       
    ├─assets               //静态资源目录
    │  ├─css               //样式
    │  ├─iconfont          //字体
    │  ├─images            //图片
    │  └─script            //脚本
    │    └─common.js
    │  
    ├─components           //组件目录
    │
    ├─i18n                //国际化配置目录
    │  │─index.js         //国际化配置文件
    │  │  
    │  └─lang             //语言目录
    │     ├─en_US.js      //英文配置
    │     └─zh_CN.js      //中文配置
    │
    ├─layout              //布局
    │    index.vue
    │
    ├─views               //页面
    │     index.vue
    │
    ├─router              //路由配置
    │     index.js        //路由配置（含路由拦截）
    │     routes.js       //路由表
    │
    ├─store               //pinia目录
    │     index.js
    │
    └─utils               //工具类
          axios.js        //请求配置（含接口拦截）
          directive.js    //全局自定义指令。v-debounce防抖、v-focus自动聚焦、v-jump路由跳转、v-auth权限设置
          prototype.js    //全局方法。$timeDiff时间戳返回多久以前、$timeFormat格式化时间戳
</pre>
