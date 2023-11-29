<!--首页-->
<template>
  <div class="home">
    home
    <el-button
      type="primary"
      v-permission="['admin']"
      @click="dialogShow = true"
    >
      该按钮仅管理员可见
    </el-button>
    <el-pagination :total="100" />
  </div>
  <UploadDialog
    isSingle
    :isShow="dialogShow"
    @close="dialogShow = false"
    @submit="submit"
  ></UploadDialog>
</template>

<script setup name="Home">
const dialogShow = ref(false);

/**
 * 提交上传
 * @fileList {array} 上传的文件
 * */
const submit = (fileList) => {
  console.log(fileList);
};
</script>

<style lang="less" scoped></style>
