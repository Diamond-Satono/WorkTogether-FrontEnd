<template>
  <div :class="{ 'alert': true, 'show': show }">
    <img src="@/assets/loginimgs/loginsuccess.png" alt="Success Icon" class="icon">
    {{ message }}
  </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";

const show = ref(false);
const message = ref("");

const displayAlert = (msg: string, duration: number = 1500) => {
  message.value = msg;
  show.value = true;
  setTimeout(() => {
    show.value = false;
  }, duration);
};

defineExpose({ displayAlert });
</script>
  
<style scoped>
.alert {
  position: fixed;
  top: -100%; /* 初始位置在屏幕上方 */
  left: 50%;
  right: 0;
  padding: 10px;
  background-color: white;
  color: black;
  text-align: center;
  width: 6%;
  height: 3%;
  border-radius: 10px;
  display: flex;
  justify-content: center; 
  align-items: center; 
  font-size: 17px;
  transition: top 0.3s ease; /* 使用 transition 属性定义动画效果 */
}

.show {
  top: 2%; /* 当 show 为 true 时，将弹窗移动到屏幕顶部 */
}

.icon {
  width: 20px; 
  height: auto; 
  margin-right: 10px; 
}
</style>
