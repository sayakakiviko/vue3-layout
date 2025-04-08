<!--首页-->
<template>
  <div class="home page-wrap">
    <h1 ref="hr">欢迎</h1>
    <el-button ref="btn" v-jump="['/other/detail/1', {}, 'params']">多开详情页1</el-button>
    <el-button v-jump="['detail', { id: 2 }, 'params']">多开详情页2</el-button>
    <el-button v-jump="['detail', { id: 3 }, 'params']">多开详情页3</el-button>
    <el-button v-jump="['directive', { id: 3 }]">query传参</el-button>

    <el-button type="primary" @click="dialogShow = true">上传</el-button>
  </div>

  <UploadDialog multiple v-model="dialogShow" :limit="2" @submit="submit" />
</template>

<script setup name="Home">
const hr = ref(null);
const btn = ref(null);
const dialogShow = ref(false);

/**
 * 提交上传
 * @fileList {array} 上传的文件
 * */
const submit = (fileList) => {
  console.log(fileList);
};
// onMounted(()=>{
//   window.globalDragPage.setValue('KuWOKGw','test')
// })

window.home = {};
window.home.dialogShow = dialogShow;
</script>

<style lang="less" scoped></style>
