import router from '@/router';

/* Vue全局指令 */
const directive = {
  /**
   * 防抖。为元素添加click事件，可在在指令后传参延迟事件，单位ms，不传参则默认延迟300ms后执行
   * 例子：<el-button v-debounce:1000="addNumber">addNumber</el-button>
   * */
  debounce: {
    mounted: (el, binding) => {
      let timer;
      el.addEventListener('click', () => {
        if (timer) clearTimeout(timer);

        el.delay = binding.arg || 300; // 延迟时间, 默认0.3秒后执行
        timer = setTimeout(() => {
          binding.value();
        }, el.delay);
      });
    },
  },
  /** 文本框自动聚焦 */
  focus: {
    mounted: (el) => {
      let myInput = el.children[0] ? el.querySelector('input') : el;
      myInput.focus();
    },
  },
  /**
   * Vue 跳转指令'v-jump'，调整新页面或url，基于router.push方式
   * @param name/path 路由名或路径(必传)[eg:home或/home]
   * @param param 参数[eg:{id:123}]
   * @param type  按什么方式传递参数[1-按路由配置方式[eg:home/123]；2-按param方式[eg:{name/path:'',params:{id:123}}]；3-按query方式(默认)[eg:{name/path:'',query:{id:123}}]]
   * 例子：<div class="click-wrap" :data-id="item.id" v-jump="['home_detail', {id:123}, 2]">
   */
  jump: {
    // el: 指令绑定的元素
    // vm: 拥有该指令的上下文 ViewModel
    // expression: 指令的表达式，不包括参数和过滤器
    // arg: 指令的参数
    // raw: 未被解析的原始表达式
    // name: 不带前缀的指令名
    mounted(el, binding) {
      // 做绑定的准备工作（比如添加事件监听器，或是其他只需要执行一次的复杂操作）

      // 若和v-for指令共用，由于v-for的就地重用机制，需要指定一个唯一的key属性(对应vnode.key)，若没指定，这里需要添加
      // vnode.key = Math.round(Math.random() * 12568);

      el.handler = (e) => {
        e.stopPropagation();
        const data = binding.value || null;
        if (data) {
          const pathName = data[0] || null;
          const param = data[1] || null;
          const type = data[2] || 3;
          // const vm = vnode['context'];
          // console.log('v-jump数据：', el, pathName, param, type);
          if (pathName) {
            if (pathName.match(new RegExp('^(http|www)'))) {
              location.href = pathName;
            } else {
              let routeData = {};
              if (type === 1) {
                /* path类型单独处理参数格式 */
                const pStr = [];
                if (param) {
                  for (const j in param) {
                    // if (param.hasOwnProperty(j)) {
                    if (Object.prototype.hasOwnProperty.call(param, j)) {
                      param[j] ? pStr.push(param[j]) : null;
                    }
                  }
                }
                routeData = {
                  path: `/${pathName}${param ? `/${pStr.join('/')}` : ''}`,
                };
              }
              if (type === 2) {
                routeData = {
                  name: pathName,
                  params: param,
                };
              }
              if (type === 3) {
                routeData = {
                  path: `/${pathName}`,
                  query: param,
                };
              } else {
                routeData =
                  pathName.indexOf('/') > -1
                    ? { path: pathName }
                    : { name: pathName };
              }

              router.push(routeData);
            }
          } else {
            console.warn('好歹给个页面名啊！');
          }
        } else {
          console.error('v-jump似乎还需要点什么！');
        }
      };
      /* 为Dom绑定事件 */
      el.addEventListener('click', el.handler, true);
    },
    unmounted(el) {
      // 做清理工作（比如移除在 bind() 中添加的事件监听器）
      /* 为Dom移除事件 */
      el.removeEventListener('click', el.handler);
    },
  },
};
export default directive;
