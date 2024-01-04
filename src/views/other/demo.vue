<template>
  <div class="main">
    <el-form class="demo-form-inline" style="margin: auto; width: 500px">
      <el-form-item label="国际化：">
        {{ $t('theme.title') }}
        <el-select v-model="$i18n.locale">
          <el-option
            v-for="(locale, index) in $i18n.availableLocales"
            :key="index"
            :value="locale"
            :label="locale"
          />
        </el-select>
        <el-button type="danger" :icon="Delete" circle />
        <el-icon><Setting /></el-icon>
        <el-button type="primary" :icon="Search">Search</el-button>
      </el-form-item>
      <el-form-item label="pinia：">
        <h2>name：{{ useUserInfo.name }} age：{{ useUserInfo.age }}</h2>
        <!--<h2>getter： {{ useUserInfo.doubleCount }}</h2>-->
        <el-button v-debounce="addAge">addAge</el-button>
        <!--<el-button @click="addAge">addAge</el-button>-->
        <h2>home：{{ useCounter.count }}</h2>
      </el-form-item>
      <el-form-item label="过滤器：">
        {{ $fn.$timeDiff(1660813072865) }}
        <!--{{ $fn.$timeFormat('1646038433000') }}-->
      </el-form-item>
      <el-form-item label="累加&组件通信：">
        <p @click="add">点我：{{ num }}</p>
        <child
          v-model="num"
          v-model:name="user.name"
          :title="childTitle"
          @changeTitle="changeTitle"
        >
          <div style="background-color: #666">子组件的slot插槽</div>
        </child>
      </el-form-item>
      <el-form-item label="路由跳转：">
        <el-button v-jump="['home', { id: 321 }]">push跳转</el-button>
        <!--<el-button @click="goToHello">push跳转</el-button>-->
        <router-link to="/home">router link</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
// import { onMounted, watch, ref, reactive, toRefs, inject } from 'vue';
// import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { Delete, Search } from '@element-plus/icons-vue';
import { counterStore, userInfoStore } from '@/store';
import child from './child.vue';

const useCounter = counterStore();
const useUserInfo = userInfoStore();
const $fn = window.$fn; //过滤器。因为window不能直接在模板中使用，需要在这里中转下
const $api = window.$api; //定义一个$api为中转，虽然可以直接去掉window使用$api，但TS会报错（不影响功能）

// const $api = inject<Reactive<object>>('$api');
// const $fn = inject<Reactive<object>>('$fn');

useUserInfo.$patch({ age: useUserInfo.age + 1 });

//await方法需要放在生命周期函数里
onBeforeMount(async () => {
  /** post传参。不推荐的调用接口用法 */
  $api.demo
    .addUserName({ name: 'aa' })
    .then((res) => {
      console.log('---res----: ', res);
      console.log('使用全局方法：', $fn.$timeFormat(1646038433000));
    })
    .catch((err) => {
      console.log('err: ', err);
    });

  /** post传参。推荐的调用接口用法 */
  const addUserName = await $api.demo.addUserName({ name: 'aa' });
  console.log(addUserName.data);

  /** post formData传参。config的修改也可直接在接口定义处编写 */
  const postTest = await $api.demo.postTest(
    { url: 'https://www.baidu.com' },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  );

  /** get params传参 */
  const getUserName = await $api.demo.getUserName(11);
  /** get query传参 */
  const getData = await $api.demo.getData({
    url: 'https://www.baidu.com',
  });
});

/* like data */
const state = reactive({
  num: 333,
  arr: [1, 2, 3],
  user: {
    id: 1,
    name: 'Tom',
  },
  childTitle: '子组件名',
});
const { num, arr, user, childTitle } = toRefs(state); // toRefs解构后可以直接在模板中使用而不必用state.

setTimeout(() => {
  state.num = 999;
  state.arr.push(5);
  state.user.name = 'sam';
}, 2000);

// provide传参
const msg = ref('msg info');
provide('msg', {
  msg,
  change: () => {
    msg.value = 'this is msg';
  },
});
provide('user', state.user); // 简单的传递个user对象
provide('userState', {
  user: state.user, // 传递user对象
  change: () => {
    // 同时传递个方法供子组件调用
    state.user.name = 'kiviko';
  },
});
/* ref */
// let num = ref<Number>(333);
// console.log(num.value);//ref 包裹的变量会全部变成对象，script内操作必须.value方式获取修改

/* reactive */
// let statearr=reactive([1,2,3,4]);//reactive也是响应式api，但只适用于数组和对象
// statearr.length=0//用这种方法清空数组才能保持它的响应性

// let userInfo = reactive({
//   id: 1,
//   name: 'Tom'
// });
// userInfo.name='sam'

// 路由导航
const router = useRouter();
// 路由信息
const route = useRoute();
console.log('当前路由：', route.name);

/* 监听 */
watch(
  () => state.num,
  (newVal, oldVal) => {
    console.log(818);
    console.log('监听num ', { newVal, oldVal });
  },
  {
    deep: true, //深度监听
    immediate: true, //初始化监听
  },
);

watchEffect(() => {
  console.log('watchEffect =>', state.num);
});

// 监听数组
watch(
  () => [...state.arr],
  (newVal, oldVal) => {
    console.log('监听数组 ', { newVal, oldVal });
  },
);

// 监听对象
// watch(()=>_.cloneDeep(userInfo), (newVal,oldVal) => {
//   console.log('监听对象 ', {newVal,oldVal});
// })
watch(
  () => state.user.name,
  (newVal, oldVal) => {
    console.log('监听对象单个属性 ', { newVal, oldVal });
  },
);

// 监听整个路由
watch(route, (to, from) => {
  console.log('监听路由触发', { to, from });
});
// 监听路由参数的变化
watch(
  () => route.query,
  (newVal, oldVal) => {
    console.log('监听到query变化', { newVal, oldVal });
  },
);

/* 生命周期 */
onMounted(() => {
  console.log('钩子函数');
});

// 调用离开守卫
// onBeforeRouteLeave( (to, from) => {
//   // 弹出一个确认框
//   const CONFIRM_TEXT: string = '确认要离开吗？您的更改尚未保存！';
//   const IS_CONFIRM_LEAVE: boolean = window.confirm(CONFIRM_TEXT);

//   // 当用户点取消时，不离开路由
//   if ( !IS_CONFIRM_LEAVE ) {
//     return false
//   }
// })

const addAge = () => {
  useUserInfo.addAge();
};

const add = () => {
  state.num++;
};

const changeTitle = (val) => {
  state.childTitle = val;
};
</script>

<style lang="less" scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
