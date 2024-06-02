<template>
  <div id="sidebar">
    <!-- Logo -->
    <img class="logo" src="@/assets/img/wt_logo.png" alt="Icon">
    <!-- Sidebar-->
    <ul>
      <li id="home" @click="toggleSubMenu('home')">
        <i class="fas fa-file"></i>
        <a href="/foregroundhomepage">
          <fa icon="folder-open" /> 首页
        </a>
      </li>
      <li id="calendar">
        <i class="fas fa-file"></i>
        <a style="color: #ff7f50;" @click="toggleSubMenu('calendar')">
          <fa icon="folder-open" /> 日历
        </a>
        <!-- <ul class="submenu" v-show="subMenuStatus.calendar">
          <li><a>
              <fa icon="file" /> 1
            </a></li>
        </ul> -->
      </li>
      <li id="settings">
        <i class="fas fa-file"></i>
        <a href="/address" @click="toggleSubMenu('settings')">
          <fa icon="folder-open" /> 通讯录
        </a>
        <!-- <ul class="submenu" v-show="subMenuStatus.settings">
          <li><a>
              <fa icon="file" /> 1
            </a></li>
        </ul> -->
      </li>
      <li id="userinfo">
        <i class="fas fa-file"></i>
        <a href="/notice" @click="toggleSubMenu('userinfo')">
          <fa icon="folder-open" /> 通知
        </a>
        <!-- <ul class="submenu" v-show="subMenuStatus.userinfo">
          <li><a>
              <fa icon="file" /> 1
            </a></li>
        </ul> -->
      </li>
      <li id="tasks">
        <i class="fas fa-file"></i>
        <a @click="toggleSubMenu('tasks')">
          <fa icon="folder-open" /> 设置
        </a>
        <!-- <ul class="submenu" v-show="subMenuStatus.tasks">
          <li><a>
              <fa icon="file" /> 1
            </a></li>
        </ul> -->
      </li>
    </ul>
    <!-- 切换切换团队窗口 -->
    <div id="group-change">
      <div id="group-symbol">软</div>
      <button id="user-button2" @click="toggleMenu2"><img id="change-icon" src="@/assets/img/group_change.png"
          alt="Icon"></button>
    </div>
    <div id="group-change2">
      <div v-if="isMenuOpen2" class="bubble-menu2" id="group-bubble">
        <ul class="user-bubble">
          <li class="bubble-choice"><span class="content-span">软</span><a href="#">软件工程小组</a></li>
          <li class="bubble-choice"><span class="content-span">岗</span><a href="#">岗位实训小组</a></li>
          <li class="bubble-choice"><span class="content-span">软</span><a href="#">软件综合实训小组</a></li>
        </ul>
      </div>
    </div>

    <router-view></router-view>
  </div>

  <div id="right-content">
    <!-- Topbar-->
    <div id="topbar">
      <div class="topbar-left">
        <div id="symbol">深</div>
        <div id="page-info">
          <span id="name-en">深圳大学/</span>
          <span id="name-list">日历</span>
        </div>
      </div>

      <div class="topbar-right">
        <div id="notice-button">                       
            <button id="notice-popup" @click="toggleNoticeMenu"><img src="@/assets/img/notice_icon.png" alt="notice"></button>
            
            <div v-if="isNoticeMenuOpen" id="notice-bubble">
              <!-- 弹窗内容 -->
              <noticebubble />
            </div>
        </div>

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
            <button id="user-button" @click="toggleMenu">
              <fa icon="caret-down" />
            </button>
            <div v-if="isMenuOpen" class="bubble-menu">
              <ul class="user-bubble">
                <li class="bubble-choice"><a href="#">切换账号</a></li>
                <li class="bubble-choice"><a href="#">退出登录</a></li>
                <li class="bubble-choice"><a href="#">切换公司</a></li>
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
      <div id="info-mode">
        <div id="menu-name"><img class="icon-little" src="@/assets/img/calendar_icon.png" alt="Icon">日历</div>
      </div>

      <div id="bottom-line"></div> <!-- 下方的线 -->
      <div id="carlendar-content">
        <!-- <component :is="componentToShow"></component> -->
        <div id="carlendar-L">
          <CalendarL @update:selectedDate="updateSelectedDate" @update:currentActive="updateActive"
            @update:currentTypeColor="updateColor" />
        </div>
        <div id="carlendar-R">
          <CalendarR :selectedDate="selectedDate" :currentActive="currentActive" :currentTypeColor="currentTypeColor" />
        </div>
      </div>

    </div>


  </div>




</template>

<script>
import CalendarL from './CalendarL.vue';
import CalendarR from './CalendarR.vue';
import noticebubble from '@/components/notice/noticebubble.vue';

export default {
  name: 'Calendar',
  data() {
    return {
      subMenuStatus: {
        home: false,
        calendar: true,
        settings: true,
        userinfo: true,
        tasks: true
      },
      isMenuOpen: false, // 用于控制气泡菜单的显示与隐藏
      isMenuOpen2: false, // 用于左下角控制气泡菜单的显示与隐藏
      selectedOption: 'basic',
      /* showChild1: true, // 控制显示子组件1还是子组件2的标志 */
      /*         child1Component: member, // 子组件1
              child2Component: group  // 子组件2 */
      //从组件CalendarL中获取数据
      // 使用 props 接收从子组件传递过来的值
      selectedDate: '',//格式：2024-5-19
      currentActive: null,//格式：allschedule
      currentTypeColor: '' , //格式：#FF0000
      isNoticeMenuOpen: false, // 新增变量
    }
  },
  components: {
    CalendarL,
    CalendarR,
    noticebubble
  },
  /*     computed: {
        // 将 showChild1 改为计算属性
        componentToShow() {
          return this.showChild1 ? 'member' : 'group';
        }
      }, */
  methods: {
    toggleSubMenu(item) {
      this.subMenuStatus[item] = !this.subMenuStatus[item];
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen; // 点击按钮时切换菜单的显示状态
    },
    toggleMenu2() {
      this.isMenuOpen2 = !this.isMenuOpen2; // 点击按钮时切换菜单的显示状态
    },
    // 定义方法来更新 selectedDate
    updateSelectedDate(date) {
      this.selectedDate = date;
      console.log('Selected date:', this.selectedDate);
    },
    // 定义方法来更新 currentActive 和 currentTypeColor
    updateActive(active) {
      this.currentActive = active;
      console.log('Current active:', this.currentActive);
    },
    updateColor(color) {
      this.currentTypeColor = color;
      console.log('Current type color:', this.currentTypeColor)
    },
    toggleNoticeMenu() {
      this.isNoticeMenuOpen = !this.isNoticeMenuOpen;
    }


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
  background: #FFF;
  /* 设置侧边栏背景色 */
  color: #948F8F;
  /* 设置文字颜色 */
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
  list-style: none;
  /* 移除默认的列表样式 */
  padding: 10px 5px;
}

li {
  padding: 12px 0;
}

a {
  text-decoration: none;
  /* 移除链接下划线 */
  color: inherit;
  /* 继承父元素文字颜色 */
  display: block;
  padding: 10px 0;
  /* 设置菜单项的内边距 */
  transition: background-color 0.3s ease;
  /* 添加悬停效果的过渡动画 */
}

#sidebar a {
  text-decoration: none;
  color: #948F8F;
  /* 设置默认文字颜色 */
  display: block;
  padding: 4px 20px;
  transition: color 0.3s;
  /* 添加颜色过渡动画 */
  font-size: 17px;
  /* 设置字体大小 */
}

#sidebar a:hover {
  color: #ff7f50;
  /* 设置悬停时的文字颜色 */
  cursor: pointer;
  /* 鼠标悬停时显示手型光标 */
}


.logo {
  display: block;
  margin: 10px;
  /* 设置logo居中并与菜单项有一定的间距 */
  width: 200px;
  /* 设置logo宽度 */
  height: auto;
  /* 根据宽度自动调整高度 */
}

#right-content {
  background-color: #F5F7FA;
  margin-left: 250px;
  width: 86.5%;
  height: 100%;
}


#topbar {
  background-color: #fff;
  /* 设置顶部栏背景色 */
  color: #161515;
  /* 设置文字颜色 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  position: relative;
  left: 8px;
  height: 65px
}

.topbar-left {
  display: flex;
  /*     margin-left: 250px; */
}

#symbol {
  display: flex;
  width: 55px;
  /* 设置矩形宽度 */
  height: 55px;
  /* 设置矩形高度 */
  background-color: #fb5b1d;
  /* 设置矩形背景色 */
  border-radius: 10px;
  /* 设置圆角半径 */
  position: absolute;
  left: 30px;
  top: 9px;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  font-size: 150%;
  color: #fff
}

#page-info {
  position: relative;
  display: flex;
  left: 90px;
}

#name-en {
  font-size: 170%;
  font-weight: 800;
  margin-top: auto;
}

#name-list {
  margin-left: 3px;
  font-size: 140%;
  font-weight: 800;
  color: #ff7f50;
  margin-top: auto;
}

#name-page {
  margin-left: 3px;
  font-size: 100%;
  font-weight: 600;
  color: #ff7f50;
  margin-top: auto;
}

.topbar-right {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info img {
  width: 65px;
  /* 设置用户头像的宽度 */
  height: 65px;
  /* 设置用户头像的高度 */
  border-radius: 50%;
  /* 将头像设置为圆形 */
  margin-right: 15px;
}

.user-details {
  font-size: 14px;
  /* 设置用户信息文字的字号 */
  margin-right: 15px;
}

.username {
  font-weight: bold;
  /* 设置用户名字体加粗 */

}

.role {
  color: #050505;
  /* 设置用户身份文字颜色 */
}

#user-operation {
  margin-right: 25px;
}


#user-button {
  background-color: #fff;
  /* 按钮背景色 */
  color: #161515;
  /* 按钮文字颜色 */
  border: none;
  /* 移除按钮边框 */
  padding: 0 0;
  /* 按钮内边距 */
  font-size: 15px;
  /* 按钮文字字号 */
  cursor: pointer;
  /* 鼠标悬停样式为手型 */
  transition: background-color 0.3s ease;
  /* 添加背景色过渡效果 */
  width: 20px;
  height: 20px;
  transform: scale(1.5);
  /* 设置图标大小为原来的 1.5 倍 */
}

/* 鼠标悬停时按钮背景色变深 */
#user-button:hover {
  background-color: #cfd2d4;
}

.bubble-menu {
  position: absolute;
  top: 75px;
  /* 根据需要调整菜单的位置 */
  left: 1490px;
  z-index: 1000;
  /* 确保菜单在顶层显示 */
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

#main-content {
  position: relative;
  background-color: #fff;
  width: 99%;
  height: 91%;
  left: 20px;
  top: 6px;
}

#info-mode {
  position: relative;
  top: 0px;
  width: 100%;
  height: 50px;
  background-color: #ffffff;
}


#bottom-line {
  border-bottom: 1px solid #BBBBBB;
  /* 画出下方的实线 */
  position: relative;
  top: 5px;
  left: 10px;
  height: 0px;
  width: 98%;
  /* 设置线的宽度为，与页面宽度相符 */
}

#carlendar-content {
  position: relative;
  height: 93%;
  width: 100%;
  top: 6px;
  /* background-color: #d1c7c7; */
  display: flex;
}

#menu-name {
  position: relative;
  width: 120px;
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
  width: 25px;
  height: 25px;
}

#carlendar-L {
  position: relative;
  /* background-color: #4D4D4D; */
  height: 100%;
  width: 25%;

}

#carlendar-R {
  position: relative;
  /* background-color: #b3aaaa; */
  height: 100%;
  width: 75%;
}

#group-change {
  position: absolute;
  left: 2px;
  bottom: 22px;
  /* top: 440px; */
  background-color: #fff;
  width: 100%;
  height: 50px;
}

#group-change2 {
  margin-bottom: 20px;
  background-color: aqua;

}

#group-symbol {
  display: flex;
  width: 40px;
  /* 设置矩形宽度 */
  height: 40px;
  /* 设置矩形高度 */
  background-color: #fb5b1d;
  /* 设置矩形背景色 */
  border-radius: 5px;
  /* 设置圆角半径 */
  position: absolute;
  left: 10px;
  top: 8px;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  font-size: 100%;
  color: #fff
}

#group-bubble {
  position: absolute;
  left: 10px;
  top: 680px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
  font-size: 15px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  /* 四周阴影 */
}

.bubble-menu2 {
  position: absolute;
  z-index: 1000;
  /* 确保菜单在顶层显示 */
  background-color: #4D4D4D;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  color: #FFF;
}

.bubble-menu2 ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bubble-menu2 ul li {
  font-weight: 1000;
  width: auto;
}

.content-span {
  display: flex;
  margin-left: 10px;
  width: 30px;
  /* 设置矩形宽度 */
  height: 30px;
  /* 设置矩形高度 */
  background-color: #fb5b1d;
  /* 设置矩形背景色 */
  border-radius: 5px;
  /* 设置圆角半径 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  font-size: 100%;
  font-weight: 100;
  color: #fff
}

.bubble-menu2 ul li:hover {
  background-color: rgb(255, 217, 194);
}

.bubble-choice {
  display: flex;
  /* 使子元素水平排列 */
  align-items: center;
  /* 垂直居中对齐 */
}

#change-icon {
  width: 20px;
  height: 20px;
}

#user-button2 {
  position: relative;
  left: 60px;
  top: 20px;
  background-color: #fff;
  /* 按钮背景色 */
  color: #161515;
  /* 按钮文字颜色 */
  border: none;
  /* 移除按钮边框 */
  padding: 0 0;
  /* 按钮内边距 */
  font-size: 15px;
  /* 按钮文字字号 */
  cursor: pointer;
  /* 鼠标悬停样式为手型 */
  transition: background-color 0.3s ease;
  /* 添加背景色过渡效果 */
  width: 20px;
  height: 20px;
  transform: scale(1.5);
  /* 设置图标大小为原来的 1.5 倍 */
}

#user-button2:hover {
  background-color: #cfd2d4;
}

  #notice-button{
    margin-right: 50px;
  }
  #notice-popup{
    width:  30px;
    height: 30px;
    background-color: #fff;
    border: none;
  }
  #notice-popup:hover{
    /* background-color: #cfd2d4; */
    cursor: pointer;
  }

  #notice-bubble {
    position: absolute;
    top: 80px; /* 根据需要调整 */
    right: 20px; /* 根据需要调整 */
    width: 450px;
    height: 780px;
    z-index: 1001;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>