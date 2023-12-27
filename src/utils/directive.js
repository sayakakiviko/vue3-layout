import router from '@/router';
import { useUserStore } from '@/store';

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
   * 拖拽 可在父元素区域任意拖拽元素。
   *
   *  思路：
   *    1、设置需要拖拽的元素为absolute，其父元素为relative。
   *    2、鼠标按下(onmousedown)时记录目标元素当前的 left 和 top 值。
   *    3、鼠标移动(onmousemove)时计算每次移动的横向距离和纵向距离的变化值，并改变元素的 left 和 top 值
   *    4、鼠标松开(onmouseup)时完成一次拖拽
   *
   *  使用：在 Dom 上加上 v-drag 即可
   *  <div class="dialog-model" v-drag></div>
   * */
  drag: {
    mounted: (el) => {
      el.style.cursor = 'move';
      el.style.position = 'absolute';
      el.onmousedown = function (e) {
        let disX = e.pageX - el.offsetLeft;
        let disY = e.pageY - el.offsetTop;
        document.onmousemove = function (e) {
          let x = e.pageX - disX;
          let y = e.pageY - disY;
          let maxX = el.parentNode.offsetWidth - el.offsetWidth;
          let maxY = el.parentNode.offsetHeight - el.offsetHeight;
          if (x < 0) {
            x = 0;
          } else if (x > maxX) {
            x = maxX;
          }

          if (y < 0) {
            y = 0;
          } else if (y > maxY) {
            y = maxY;
          }
          el.style.left = x + 'px';
          el.style.top = y + 'px';
        };
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null;
        };
      };
    },
  },
  /**
   * Vue 跳转指令'v-jump'，调整新页面或url，基于router.push方式
   * @param name/path 路由名或路径(必传)[eg:home或/home]
   * @param param 参数[eg:{id:123}]
   * @param type  按什么方式传递参数[1-按路由配置方式[eg:home/123]；2-按param方式[eg:{name/path:'',params:{id:123}}]；3-按query方式(默认)[eg:{name/path:'',query:{id:123}}]]
   * 例子：<div class="click-wrap" :data-id="item.id" v-jump="['home_detail', {id:123}, 2]">（新窗口打开，只需要添加open修饰符即可：v-jump.open="['home_detail', {id:123}, 2]"）
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
                routeData = pathName.indexOf('/') > -1 ? { path: pathName } : { name: pathName };
              }

              if (binding.modifiers.open) {
                //新窗口打开
                window.open(routeData, '_blank');
              } else {
                router.push(routeData);
              }
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
  /**
   * 权限指令。被设置的元素只会为有权限的角色展示
   * 例子： <el-button v-permission="['admin','user']>提交</el-button>
   * */
  permission: {
    mounted(el, binding) {
      const userStore = useUserStore();
      const { userInfo } = userStore;
      const { value } = binding; //传递的值，值为数组
      // const role = 'admin';

      if (Array.isArray(value)) {
        if (value.length > 0) {
          const permissionValues = value;
          // 对当前用户的角色权限和传入指令的权限类型进行比对。如果当前用户无权限则会执行节点删除操作。
          const hasPermission = permissionValues.includes(userInfo.role);
          if (!hasPermission && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }
      } else {
        throw new Error(`请正确设置权限! 如 v-permission="['admin','user']"`);
      }
    },
  },
};
export default directive;
