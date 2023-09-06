<template>
  <div class="not-found">
    <div class="tips">
      <el-text type="primary">抱歉</el-text>
      <h3>当前页面不存在...</h3>
      <p>请检查您输入的网址是否正确，或点击下面的按钮返回首页</p>
      <el-button type="primary" round v-jump="['home']">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.not-found {
  width: 100%;
  height: 100%;
  background: var(--el-color-white) url('@/assets/images/svg/404.svg') no-repeat
    center/50vw 50vh;
}
.tips {
  padding-top: 80px;
  text-align: center;
  .el-text {
    margin-bottom: 20px;
    font-size: 40px;
    font-weight: bold;
  }
  h3 {
    margin-bottom: 10px;
    font-size: 20px;
    color: #333;
  }
  p {
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
  }
}
</style>
