import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
import { resolve } from 'node:path';
import VueSetupExtend from 'vite-plugin-vue-setup-extend'; //方便定义组件的name命名

const serverMap = {
  0: {
    proxyTarget: 'http://127.0.0.1:4523/',
    plmTarget: 'http://127.0.0.1:4523/',
  },
};
const ip = 0;
// https://vitejs.dev/config/
export default defineConfig({
  // 配置需要使用的插件
  plugins: [
    vue(),
    VueSetupExtend(),
    // vue3 api自动导入
    AutoImport({
      // 适用的文件
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: ['vue', 'vue-router'],
      // 可以选择auto-import.d.js生成的位置，建议设置为'/src/auto-import.d.js'不然会自动生成在根目录
      dts: 'src/auto-import.d.js',
      // 生成全局声明文件，给eslint用
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // 避免自动引入vue3 api后页面报未定义的错误
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
    Components({
      resolvers: [ElementPlusResolver()], //使用element plus
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 设置 `@` 指向 `src` 目录
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },
  base: './', // 设置打包路径
  server: {
    host: '0.0.0.0',
    port: 3000, // 设置服务启动端口号
    open: false, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
    // 设置代理，根据我们项目实际情况配置
    proxy: {
      // '/m1': ['http://127.0.0.1:4523/', 'http://192.168.1.18:8888/'],
      '/m1': {
        target: serverMap[ip].proxyTarget,
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/m1/, '/m1'), // 路径重写
      },
    },
  },
  // 构建
  build: {
    outDir: 'dist', // 指定打包路径，默认为项目根目录下的 dist 目录
    terserOptions: {
      compress: {
        keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
        drop_console: true, // 生产环境去除 console
        drop_debugger: true, // 生产环境去除 debugger
      },
    },
    chunkSizeWarningLimit: 1500, // chunk 大小警告的限制（以 kbs 为单位）
  },
});
