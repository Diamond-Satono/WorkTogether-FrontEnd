<template>
    <div class="modal">
      <div id="info-mode">
          <div id="menu-name"><img class="icon-little" src="@/assets/img/address_icon.png" alt="Icon">团队通讯录</div>
        </div>
      <div id="bottom-line"></div>

      <div class="member-menu">
            <input id="search-bar" type="text" v-model="searchQuery" placeholder="搜索成员" />
            <ul>
              
            </ul>
      </div>


    </div>
  </template>
  
  <script>
  export default {
    name: 'addressL',
    data(){
      return{
        searchQuery:'',
        
      }

    }
  };
  </script>
  
  <style scoped>
  /* 样式可以根据需要进行修改 */
  #info-mode {
    position: relative;
    top: 0px;
    width: 100%;
    height: 50px;
    background-color: #ffffff;
  }
  #menu-name {
    position: relative;
    width: 150px;
    height: 35px;
    font-size: 20px;
    font-weight: bold;
    left: 20px;
    top: 10px;
    align-items: center;
    text-align: center;
    /* border:2px solid #050505; */
  }
  .icon-little {
    position: relative;
    top: 5px;
    left: -5px;
    width: 30px;
    height: 30px;
  }
  #search-bar{
    width: 75%;
    height: 30px;
    font-size: 20px;
    margin-left: 25px;
    margin-top: 10px;;
    border-radius: 8px;
    padding: 5px 10px;
  }



  </style>
  