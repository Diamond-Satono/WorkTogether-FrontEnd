<template>
  <div>
    我的周报
    <button @click="send">发送</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
const emit = defineEmits(['update:weeklyId']);
const weeklyId = ref(111);
function send(){
  emit('update:weeklyId', weeklyId.value);
}

</script>

<style>
    
</style>