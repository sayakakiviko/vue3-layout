<template>
  <!--
    pull: 'clone', put: false
    意思是以克隆的方式拖拽，，不能在组件列表进行放置，目的是不影响原来的组件列表
  -->
  <draggable
    v-model="componentList"
    item-key="id"
    :group="{ name: 'component', pull: 'clone', put: false }"
  >
    <template #item="{ element }">
      <div class="item">
        {{ element.tag }}
      </div>
    </template>
  </draggable>
</template>
<script>
import { defineComponent, ref } from 'vue';

// 引入vuedraggable
import draggable from 'vuedraggable';

export default defineComponent({
  name: 'Lsit',
  components: {
    draggable,
  },
  setup() {
    // 组件数据列表
    const componentList = ref([
      {
        id: 1,
        tag: 'button',
        props: {
          type: 'primary',
        },
      },
      {
        id: 2,
        tag: 'empty',
        props: {
          description: '没有数据捏',
        },
      },
      {
        id: 3,
        tag: 'spin',
      },
    ]);
    return {
      componentList,
    };
  },
});
</script>
<style>
.item {
  border: #0083ee 1px solid;
  margin: 10px;
  padding: 10px;
}
</style>
