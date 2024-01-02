<template>
  <div class="breadcrumb" :class="{ hide: !breadcrumbStore.breadcrumb.length }">
    <el-breadcrumb style="line-height: 30px" :separator-icon="ArrowRight">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbStore.breadcrumb"
        :key="item.title"
        :to="
          item.name && index < breadcrumbStore.breadcrumb.length - 1 ? { name: item.name } : null
        "
      >
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue';
import { useBreadcrumbStore } from '@/store';

const breadcrumbStore = useBreadcrumbStore();
</script>

<style scoped lang="less">
.breadcrumb {
  //width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  padding: 0 16px;
  .el-breadcrumb {
    line-height: 40px !important;
  }
  &.hide {
    height: 20px;
    line-height: 20px;
  }
}
</style>
