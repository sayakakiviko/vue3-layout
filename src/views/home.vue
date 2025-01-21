<!--首页-->
<template>
  <div class="home page-wrap">
    <h1 ref="hr">欢迎</h1>
    <el-button ref="btn" v-jump="['/other/detail/1', {}, 'params']">多开详情页1</el-button>
    <el-button v-jump="['detail', { id: 2 }, 'params']">多开详情页2</el-button>
    <el-button v-jump="['detail', { id: 3 }, 'params']">多开详情页3</el-button>
    <el-button v-jump="['directive', { id: 3 }]">query传参</el-button>

    <el-button type="primary" @click="dialogShow = true">上传</el-button>
    <pageRender :renderData="elementData"></pageRender>
  </div>

  <UploadDialog multiple v-model="dialogShow" :limit="2" @submit="submit" />
</template>

<script setup name="Home">
let hr = ref(null);
let btn = ref(null);
let dialogShow = ref(false);

/*const elementData = ref([
  {
    id: 'QjyE5G1',
    icon: 'image',
    tag: 'el-image',
    config: {
      attr: {
        src: src,
        fit: '',
        previewImage: true,
        hideOnClickModal: true,
        previewSrcList: [],
      },
      layout: {
        display: 'inline-block',
        width: '200px',
        height: '200px',
      },
      style: {
        backgroundColor: '',
      },
      event: {},
    },
    ref: 'QjyE5G1',
  },
]); //页面数据*/

/**
 * 提交上传
 * @fileList {array} 上传的文件
 * */
const submit = (fileList) => {
  console.log(fileList);
};

window.home = {};
window.home.dialogShow = dialogShow;
</script>

<style lang="less" scoped></style>
