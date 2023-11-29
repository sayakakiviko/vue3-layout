<!--
    组件名称：弹窗上传文件
    插槽：topContent
    输出：close方法：关闭弹窗，清空文件数组 。   submit方法 ： 确定上传，传出文件属性
 -->
<template>
  <div class="selectedDialog">
    <el-dialog
      v-model="isShowDialog"
      :title="title"
      width="600"
      @close="close"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <slot name="topContent"></slot>
      <el-upload
        drag
        ref="uploadRef"
        action="/"
        v-model:file-list="fileList"
        :accept="accept"
        :auto-upload="false"
        :multiple="!isSingle"
        :limit="limit"
        :on-exceed="onExceed"
      >
        <!--<el-icon size="60">-->
        <!--  <svg><use xlink:href="#icon-shangchuanwenjian"></use></svg>-->
        <!--</el-icon>-->
        <div class="el-upload__text">
          将文件拖拽支至此处，或者点击
          <el-button>
            <el-icon class="el-icon--right"><Upload /></el-icon>
            点击上传
          </el-button>
          <p v-if="accept">
            <el-text type="info" size="small">
              仅支持 {{ accept }} 等格式
            </el-text>
          </p>
        </div>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button
            type="primary"
            :loading="isLoading"
            :disabled="disabled"
            @click="submit"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  //是否展示弹窗
  isShow: {
    type: Boolean,
    default: false,
  },
  //是否文件单选
  isSingle: {
    type: Boolean,
    default: false,
  },
  //允许上传文件的最大数量
  limit: {
    type: Number,
  },
  //接受上传的文件类型
  accept: {
    type: String,
    default: '',
  },
  //弹窗标题
  title: {
    type: String,
    default: '上传',
  },
});

const disabled = ref(false); //提交禁用
const isLoading = ref(false); //加载状态
const isShowDialog = ref(false); //弹窗显示状态
const fileList = ref([]); //附件列表

watch(
  () => props.isShow,
  (newVal) => {
    isShowDialog.value = newVal;
    if (!newVal) isLoading.value = false;
  },
);
//监听上传的文件类型
watch(
  () => fileList.value,
  (newVal) => {
    disabled.value = false;
    for (let item of newVal) {
      let fileName = item.name;
      let dotIndex = fileName.lastIndexOf('.'); //找到后缀名的.
      let type = fileName.substring(dotIndex + 1, fileName.length); //文件类型

      if (props.accept && !props.accept.includes(type)) {
        disabled.value = true;
        return window.$message.error('请上传符合要求的文件格式');
      }
    }
  },
);

const emit = defineEmits(['close', 'submit']);
/**
 * 超出上传文件数量限制
 * @files {array} 上传的文件
 * */
const onExceed = (files) => {
  if (props.limit === 1) {
    //单个文件时直接覆盖替换
    files[0].status = 'pending';
    fileList.value = files;
  } else {
    window.$message.error('已超出允许上传的最大数量');
  }
};
/**
 * 关闭弹窗
 * */
const close = () => {
  fileList.value = [];
  emit('close', false);
};
/**
 * 确认弹窗
 * */
const submit = () => {
  if (!fileList.value.length) return window.$message.warning('请添加附件');
  isLoading.value = true;
  emit('submit', fileList.value);
};

defineExpose({
  isLoading,
});
</script>

<style scoped lang="less">
.selectedDialog {
  :deep .el-dialog__header {
    border-bottom: 1px solid var(--el-border-color);
    margin-right: 0;
  }
  :deep .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  :deep .el-dialog__footer {
    border-top: 1px solid var(--el-border-color);
  }
}
</style>
