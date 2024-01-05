<template>
  <el-input v-model="input" v-focus placeholder="文本框自动聚焦指令" style="width: 220px" />
  <br />
  <br />
  <el-button type="primary" v-auth="['admin']">权限指令-该按钮仅管理员可见</el-button>
  <el-button type="success" v-jump="['home', { id: 123 }]">跳转指令</el-button>
  <el-button type="info" v-jump.open="['home', { id: 123 }]">跳转指令-新开窗口</el-button>
  <el-button v-debounce="onClick">防抖指令</el-button>
  <el-button type="danger" v-drag>拖拽指令</el-button>
</template>

<script setup>
const input = ref('');
const onClick = () => {
  window.$message('点击了按钮');
};
</script>

<style scoped></style>
