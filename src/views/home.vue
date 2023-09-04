<!--首页-->
<template>
  <div class="home">
    home
    <el-button type="primary" v-permission="['admin']">
      该按钮仅管理员可见
    </el-button>
    <el-pagination :total="100" />
  </div>
</template>

<script setup name="Home"></script>

<style lang="less" scoped></style>
