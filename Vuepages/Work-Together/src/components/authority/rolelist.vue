<template>
    <div id="sidebar">
      <!-- Logo -->
      <img class="logo" src="@/assets/img/wt_logo.png" alt="Icon">
      <!-- Sidebar-->
      <ul>
        <!-- <li id="home" @click="toggleSubMenu('home')">
          <a href="/HomePage"><fa icon="folder-open" />  首页</a>
        </li> -->
        <li id="organization">
          <a @click="toggleSubMenu('organization')"><fa icon="folder-open" /> 组织架构</a>
          <ul class="submenu" v-show="subMenuStatus.organization">
            <li v-show="groupstate"> <a href="/groupmanage"><fa icon="file" />  团队管理</a></li>
            <li v-show="departmentstate"> <a href="/departmentManage"><fa icon="file" />  成员与部门</a></li>
          </ul>
        </li>
        <li id="enterprise">
          <a @click="toggleSubMenu('enterprise')"><fa icon="folder-open" />  企业管理</a>
          <ul class="submenu" v-show="subMenuStatus.enterprise">
            <li v-show="enterprisestate"> <a href="/enterpriseinfo"><fa icon="file" />  企业概览</a></li>
          </ul>
        </li>
        <li id="authority">
          <a @click="toggleSubMenu('authority')"><fa icon="folder-open" />  权限列表</a>
          <ul class="submenu" v-show="subMenuStatus.authority">
            <li> <a href="/userlist"><fa icon="file" />  用户列表</a></li>
            <li> <a style="color: #ff7f50;"><fa icon="file" />  角色列表</a></li>
            <li> <a href="/menulist"><fa icon="file" />  菜单列表</a></li>
            <li> <a href="resourcelist"><fa icon="file" />  资源列表</a></li>
          </ul>
        </li>
      </ul>
      <router-view></router-view>
    </div>
     
    <div id="right-content"> 
      <!-- Topbar-->
      <div id="topbar">
        <div class="topbar-left">
          <div id="symbol">深</div>
          <div id="page-info">
              <span id="name-en">深圳大学/</span>
              <span id="name-list">权限列表/</span>
              <span id="name-page">角色列表</span>
          </div>   
        </div>

        <div class="topbar-right">
          <!-- 用户信息 -->
          <div class="user-info">
            <img src="@/assets/img/icon.png" alt="User Avatar">
            <div class="user-details">
              <div class="username">用户名</div>
              <div class="role">用户身份</div>
            </div>
            <!-- 用户操作 -->
            <div id="user-operation">
              <!-- 触发气泡菜单的按钮 -->
                <button id="user-button" @click="toggleMenu"><fa icon="caret-down" /></button>
                <div v-if="isMenuOpen" class="bubble-menu">
                  <ul class="user-bubble">
                    <li class="bubble-choice"><a href="/Login">退出登录</a></li>
                    <li class="bubble-choice"><a href="/calendar">前往前台界面</a></li>
                  </ul>
                </div>
            </div>
            <!-- 用户操作↑  -->   
          </div>
          <!-- 用户信息↑ -->
        </div>

      </div>

      <div id="main-content">
          <!-- 这里放置页面的主要内容 -->
          <role></role>
          

      </div>


    </div>

  

  
  </template>
  
  <script>
  import { UserInfo } from '@/store/userinfo';
  const userInfo = UserInfo();
  import { listInfo } from '@/store/liststate';
  const liststate = listInfo();

  import role from '@/components/authority/role.vue';

  export default {
    name: 'rolelist',
    data() {
      return {
        subMenuStatus: {
          home: false,
          organization: true,
          enterprise: true,
          authority: true
        },
        isMenuOpen: false, // 用于控制气泡菜单的显示与隐藏
        groupstate: liststate.value.group,
        departmentstate: liststate.value.department,
        enterprisestate: liststate.value.enterprise,
      }
    },
    components: {
        role,
    },
    methods: {
      toggleSubMenu(item) {
        this.subMenuStatus[item] = !this.subMenuStatus[item];
      },
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen; // 点击按钮时切换菜单的显示状态
      },
      
      
      
  
    }
  }
  </script>
  
  <style scoped>
  /* 样式可以根据需要进行修改 */
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
  #sidebar {
    position: fixed;
    width: 200px;
    height: 100%;
    background: #FFF; /* 设置侧边栏背景色 */
    color: #948F8F; /* 设置文字颜色 */
    padding-top: 20px;
    padding-left: 18px;
  }
  .submenu {
    padding-left: 30px;
  }
  .submenu.open {
    display: block;
  }
  
  ul {
    list-style: none; /* 移除默认的列表样式 */
    padding: 10px 5px;
  }
  
  li {
    padding: 12px 0;
  }
  
  a {
    text-decoration: none; /* 移除链接下划线 */
    color: inherit; /* 继承父元素文字颜色 */
    display: block;
    padding: 10px 0; /* 设置菜单项的内边距 */
    transition: background-color 0.3s ease; /* 添加悬停效果的过渡动画 */
  }
  
  #sidebar a {
    text-decoration: none;
    color: #948F8F; /* 设置默认文字颜色 */
    display: block;
    padding: 4px 20px;
    transition: color 0.3s; /* 添加颜色过渡动画 */
    font-size: 17px; /* 设置字体大小 */
  }
  
  #sidebar a:hover {
    color: #ff7f50; /* 设置悬停时的文字颜色 */
    cursor: pointer; /* 鼠标悬停时显示手型光标 */
  }
  
  
  .logo {
    display: block;
    margin: 10px; /* 设置logo居中并与菜单项有一定的间距 */
    width: 200px; /* 设置logo宽度 */
    height: auto; /* 根据宽度自动调整高度 */
  }
  
  #right-content{
    background-color: #F5F7FA;
    margin-left: 250px;
    width:86.5%;
    height: 100%;
  }


  #topbar {
    background-color: #fff; /* 设置顶部栏背景色 */
    color: #161515; /* 设置文字颜色 */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
    position: relative;
    left:8px;
    height: 65px
  }
  
  .topbar-left {
    display: flex;
/*     margin-left: 250px; */
  }
  
  #symbol{
    display: flex;
    width: 55px; /* 设置矩形宽度 */
    height: 55px; /* 设置矩形高度 */
    background-color: #fb5b1d; /* 设置矩形背景色 */
    border-radius: 10px; /* 设置圆角半径 */
    position:absolute;
    left: 30px;
    top: 9px;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    font-size: 150%;
    color:#fff
  }
  #page-info{
    position: relative;
    display: flex;
    left: 90px;
  }
  #name-en{
    font-size: 170%;
    font-weight: 800;
    margin-top: auto;
  }
  #name-list{
    margin-left: 3px;
    font-size: 140%;
    font-weight: 800;
    margin-top: auto;
  }
  #name-page{
    margin-left: 3px;
    font-size: 100%;
    font-weight: 600;
    color: #ff7f50;
    margin-top: auto;
  }
  
  .topbar-right {
    display: flex;
    align-items: center;
    margin-right: 40px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .user-info img {
    width: 65px; /* 设置用户头像的宽度 */
    height: 65px; /* 设置用户头像的高度 */
    border-radius: 50%; /* 将头像设置为圆形 */
    margin-right: 15px;
  }
  
  .user-details {
    font-size: 14px; /* 设置用户信息文字的字号 */
    margin-right: 15px;
  }
  
  .username {
    font-weight: bold; /* 设置用户名字体加粗 */
    
  }
  
  .role {
    color: #050505; /* 设置用户身份文字颜色 */
  }

  #user-operation{
    margin-right: 25px;
  }
  

  #user-button{
    background-color: #fff; /* 按钮背景色 */
    color: #161515; /* 按钮文字颜色 */
    border: none; /* 移除按钮边框 */
    padding: 0 0; /* 按钮内边距 */
    font-size: 15px; /* 按钮文字字号 */
    cursor: pointer; /* 鼠标悬停样式为手型 */
    transition: background-color 0.3s ease; /* 添加背景色过渡效果 */
    width:20px;
    height: 20px;
    transform: scale(1.5); /* 设置图标大小为原来的 1.5 倍 */
  }

  /* 鼠标悬停时按钮背景色变深 */
  #user-button:hover {
    background-color: #cfd2d4;
  }

  .bubble-menu {
    position:absolute;
    top: 75px; /* 根据需要调整菜单的位置 */
    left: 1490px;
    z-index: 1000; /* 确保菜单在顶层显示 */
    background-color: #4D4D4D;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 10px;
    width: 120px;
    color: #FFF;
  }
  .bubble-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .bubble-menu ul li {
    padding: 5px 10px;
  }

  .bubble-menu ul li:hover {
    background-color: #4d4949;
  }
  
  #main-content{
    position: relative;
    background-color: #fff;
    width: 99%;
    height: 91%;
    left: 20px;
    top:6px;
  }

  #info-mode{
    position: relative;
    top:0px;
    width:100%;
    height: 50px;
    background-color: #ffffff;
  }
  #mode1 {
    background-color: #fff;
    border: none;
    padding: 8px 16px;
    margin-right: 20px;
    cursor: pointer;
    margin-left: 40px;
    height: 54px;
    width: 100px;
    font-size: 18px;
    font-weight: 800;
  }
  #mode2 {
    background-color: #fff;
    border: none;
    padding: 8px 16px;
    margin-right: 20px;
    cursor: pointer;
    margin-left: 40px;
    height: 54px;
    width: 100px;
    font-size: 18px;
    font-weight: 800;
  }

  #mode1.active {
    color: #fb5b1d; /* 改变选中选项的背景颜色 */
    border-bottom: 3px solid #fb5b1d;
  }
  #mode2.active {
    color: #fb5b1d; /* 改变选中选项的背景颜色 */
    border-bottom: 3px solid #fb5b1d;
  }

  #bottom-line{
    border-bottom: 1px solid #BBBBBB; /* 画出下方的实线 */
    position: relative;
    top:5px;
    left:10px;
    height: 0px;
    width: 98%; /* 设置线的宽度为，与页面宽度相符 */
  }
  
  #list-content{
    position: relative;
    height:93%;
    width: 100%;
    top:6px;
    background-color: #fff;
  }

  #test{
    width: 150px;
    height: 50px;
  }

  </style>
  