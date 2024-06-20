<template>
    <div class="modal">
      <div class="modal-content">
        <div class="modal-name"><img src="@/assets/img/ch_en.png" alt="Icon"> 切换企业</div>
        <div class="tip">选择切换</div>
        <span class="confirm" @click="$emit('closeDialog')">确认切换</span>
        <span class="close" @click="$emit('closeDialog')">放弃切换</span>
        <!-- 在这里添加切换企业的内容 -->
        <div class="choice">
        <label v-for="(option, index) in options" :key="index" :class="'option-' + index">
          <input class="choicep" type="radio" :value="option" v-model="selectedOption">
          {{ option }}
        </label>
      </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SwitchEnterprise',
    data() {
      return {
        selectedOption: null,
        options: ['深圳大学', '软件工程', '实习企业'], // 选项列表，根据实际需求修改
      };
    },
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
    height: 420px;
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
    left: 42%;
    top:37%;
    width: 10%;
    font-size: 20px;
    font-weight: 800;
  }

  .choice{
    position: absolute;
    left: 47%;
    top:35%;
    width: 10%;
  }


  /* 为每个选项设置不同的样式 */
  .option-0 {
    display: block; /* 让每个选项显示为块级元素，单独占据一行 */
    font-size: 20px;
    font-weight: bold;
    margin: 20px;
  }

  .option-1 {
    display: block; /* 让每个选项显示为块级元素，单独占据一行 */
    font-size: 20px;
    font-weight: bold;
    margin: 20px;
  }

  .option-2 {
    display: block; /* 让每个选项显示为块级元素，单独占据一行 */
    font-size: 20px;
    font-weight: bold;
    margin: 20px;
  }
  .option-3 {
    display: block; /* 让每个选项显示为块级元素，单独占据一行 */
    font-size: 20px;
    font-weight: bold;
    margin: 20px;
  }

  .confirm{
    width: 140px;
    height: 30px;
    color: #fff;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
    background-color:#fb5b1d ;
    border-radius: 10px; /* 设置圆角半径 */
    border: 1px solid #fb5b1d; /* 设置边框 */    
    position: absolute;
    left: 40%;
    top:62%
  }
  
  .close {
    width: 140px;
    height: 30px;
    color: #aaa;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
    border-radius: 10px; /* 设置圆角半径 */
    border: 1px solid #fb5b1d; /* 设置边框 */    
    position: absolute;
    left: 57%;
    top:62%
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  </style>
  