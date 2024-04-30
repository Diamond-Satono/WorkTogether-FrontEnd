<template>
    <div class="modal">
      <div class="modal-content">
        <div class="modal-name"><img src="@/assets/img/cr_en.png" alt="Icon"> 创建企业</div>
        <div class="tip">是否创建新的企业</div>
        <span class="confirm">确认创建</span>
        <span class="close" @click="$emit('closeDialog')">放弃创建</span>
        <!-- 在这里添加创建企业的内容 -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CreateEnterprise',
  };
  </script>
  
  <style scoped>
  /* 样式可以根据需要进行修改 */
  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-content {
    height: 300px;
    background-color: #fefefe;
    margin-top: 10%;
    margin-left: 35%;
    padding: 20px;
    border: 1px solid #888;
    width: 33%;
    border-radius: 15px; /* 设置圆角半径 */
  }

  .modal-name{
    position: absolute;
    text-align: center;
    font-size: 20px;
    font-weight: 800;
  }
  .tip{
    position: absolute;
    left: 48%;
    top:35%;
    width: 10%;
    font-size: 20px;
    font-weight: 800;
  }
  .confirm{
    width: 140px;
    height: 30px;
    color: #fff;
    float: right;
    font-size: 20px;
    cursor: pointer;
    background-color:#fb5b1d ;
    border-radius: 10px; /* 设置圆角半径 */
    border: 1px solid #fb5b1d; /* 设置边框 */    
    position: absolute;
    left: 40%;
    top:48%
  }
  
  .close {
    width: 140px;
    height: 30px;
    color: #aaa;
    float: right;
    font-size: 20px;
    cursor: pointer;
    border-radius: 10px; /* 设置圆角半径 */
    border: 1px solid #fb5b1d; /* 设置边框 */    
    position: absolute;
    left: 57%;
    top:48%
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  </style>
  