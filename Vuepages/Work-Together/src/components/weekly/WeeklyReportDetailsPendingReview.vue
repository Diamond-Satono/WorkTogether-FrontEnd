<template>
    <div class="overlay">
      <div class="modal">
        <p>这是一个弹窗内容</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">

  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent; 
  }
  
  .modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 8px 10px rgba(0, 0, 0, 0.2); 
    width: 50%; 
    height: 70%; 
    overflow: auto;
  }
  </style>
  