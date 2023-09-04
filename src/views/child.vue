<template>
  <h1 @click="updateTitle">child组件：{{ title }}</h1>
  <p>我叫：{{ name }}，这是我的编号：{{ modelValue }}</p>
  <slot></slot>
</template>

<script setup>
// import { defineProps,defineEmits } from 'vue'
defineProps({
  title: {
    type: String,
    default: '标题',
  },
  modelValue: Number,
  name: String,
});

const data = inject('msg');
console.log('使用provide传来的值：', data.msg.value);
setTimeout(() => {
  data.change();
  // console.log(data.msg.value);
  // console.log(user.name);
  userState.change();
  console.log(userState.user.name);
}, 2500);

const user = inject('user');
let userState = inject('userState');
// console.log(user.name);
userState.change(); // 调用父组件传递的方法
// console.log(userState.user.name);

const emit = defineEmits(['changeTitle', 'update:modelValue', 'update:name']);

function updateTitle() {
  emit('changeTitle', '修改子组件名');
  // model绑定的props值会自动触发父组件值更新，不必在父组件再绑定事件
  emit('update:modelValue', 30);
  emit('update:name', 'sayaka');
}
</script>

<style lang="less" scoped></style>
