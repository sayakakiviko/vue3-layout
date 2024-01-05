<!--
    组件名称：弹窗上传文件
    属性：用 v-bind="$attrs" 通过属性透传我们支持 el-upload 的所有 Props 属性
    插槽：topContent
    输出： submit方法 ： 确定上传，传出文件属性
 -->
<template>
  <div class="upload-dialog">
    <el-dialog
      draggable
      destroy-on-close
      v-model="isShowDialog"
      :title="title"
      :close-on-click-modal="false"
      width="600"
      @close="close"
    >
      <slot name="topContent"></slot>
      <el-upload
        drag
        action="/"
        v-model:file-list="fileList"
        v-bind="$attrs"
        :auto-upload="false"
        :on-exceed="onExceed"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖拽支至此处，或者点击
          <el-button>
            <el-icon class="el-icon--right"><Upload /></el-icon>
            点击上传
          </el-button>
          <p v-if="$attrs.accept">
            <el-text type="info" size="small">仅支持 {{ $attrs.accept }} 等格式</el-text>
          </p>
        </div>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" :loading="isLoading" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const attrs = useAttrs(); //js 里使用 $attrs
const props = defineProps({
  //是否展示弹窗
  isShow: {
    type: Boolean,
    default: false,
  },
  //弹窗标题
  title: {
    type: String,
    default: '上传',
  },
});

const isLoading = ref(false); //加载状态
const fileList = ref([]); //附件列表

//监听上传的文件类型
watch(
  () => fileList.value,
  (newVal) => {
    for (let item of newVal) {
      let fileName = item.name;
      let dotIndex = fileName.lastIndexOf('.'); //找到后缀名的.
      let type = fileName.substring(dotIndex + 1, fileName.length); //文件类型

      if (attrs.accept && !attrs.accept.includes(type))
        return window.$message.warning('请上传符合要求的文件格式');
    }
  },
);

//弹窗显示状态
const isShowDialog = computed({
  get: () => props.isShow,
  set: (val) => {
    emit('update:isShow', false); // 触发父组件值更新
  },
});

/**
 * 超出上传文件数量限制
 * @files {array} 上传的文件
 * */
const onExceed = (files) => {
  if (attrs.limit === 1) {
    //单个文件时直接覆盖替换
    files[0].status = 'pending';
    fileList.value = files;
  } else {
    window.$message.warning('已超出允许上传的最大数量');
  }
};
/**
 * 关闭弹窗
 * */
const close = () => {
  isLoading.value = false;
  fileList.value = [];
  isShowDialog.value = false;
};
/**
 * 确认弹窗
 * */
const submit = () => {
  if (!fileList.value.length) return window.$message.warning('请添加附件');
  isLoading.value = true;
  emit('submit', fileList.value);
};

const emit = defineEmits(['update:isShow', 'submit']);
</script>

<style scoped lang="less">
.upload-dialog {
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
