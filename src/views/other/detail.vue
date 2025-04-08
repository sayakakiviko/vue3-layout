<template>
  <div class="page-wrap">
    <span>详情页：{{ route.params.id }}</span>
  </div>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped></style>
