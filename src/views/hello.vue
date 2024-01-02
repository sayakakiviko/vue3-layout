<template>
  <div>欢迎欢迎</div>
  <el-checkbox v-model="checked">test</el-checkbox>
</template>

<script setup name="hello">
const checked = ref(false);
</script>

<style scoped>
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
