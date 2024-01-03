<!--菜单列表-->
<template>
  <!--有子菜单-->
  <el-sub-menu v-if="value.children && value.children.length" :index="value.path">
    <template #title>
      <el-icon v-if="value.meta.icon">
        <component :is="value.meta.icon" />
      </el-icon>
      <span>{{ value.meta.title }}</span>
    </template>
    <MenuItem
      v-for="(item, index) in value.children"
      :key="index"
      :value="item"
      @click="onClickMenuItem"
    />
  </el-sub-menu>
  <!--无子菜单-->
  <el-menu-item v-else :index="value.path" @click="onClickMenuItem(value)">
    <el-icon v-if="value.meta.icon">
      <component :is="value.meta.icon" />
    </el-icon>
    <span>{{ value.meta.title }}</span>
  </el-menu-item>
</template>

<script setup name="MenuItem">
defineProps({
  value: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['click']);

const onClickMenuItem = (item) => {
  console.log('item');
  console.log(item);
  // emit('click', item);
};
</script>

<style scoped lang="less"></style>
