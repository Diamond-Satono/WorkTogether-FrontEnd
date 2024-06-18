<template>
  <div id="sidebar">
    <!-- Logo -->
    <img src="@/assets/img/wt_logo.png" alt="Icon">
    <!-- Sidebar-->
    <ul>
        <!-- <li id="home" @click="toggleSubMenu('home')">
          <i class="fas fa-file"></i> 
          <a href="/HomePage"><fa icon="folder-open" />  首页</a>
        </li> -->
        <li id="organization">
          <i class="fas fa-file"></i>  
          <a @click="toggleSubMenu('organization')"><fa icon="folder-open" /> 组织架构</a>
          <ul class="submenu" v-show="subMenuStatus.organization">
            <li v-show="groupstate"><i class="fas fa-file"></i> <a href="/groupmanage"><fa icon="file" />  团队管理</a></li>
            <li v-show="departmentstate"><i class="fas fa-file"></i> <a href="/departmentManage"><fa icon="file" />  成员与部门</a></li>
          </ul>
        </li>
        <li id="enterprise">
          <i class="fas fa-file"></i>  
          <a @click="toggleSubMenu('enterprise')"><fa icon="folder-open" />  企业管理</a>
          <ul class="submenu" v-show="subMenuStatus.enterprise">
            <li v-show="enterprisestate"><i class="fas fa-file"></i> <a style="color: #ff7f50;"><fa icon="file" />  企业概览</a></li>
          </ul>
        </li>
        <li id="authority">
          <i class="fas fa-file"></i>  
          <a @click="toggleSubMenu('authority')"><fa icon="folder-open" />  权限列表</a>
          <ul class="submenu" v-show="subMenuStatus.authority">
            <li><i class="fas fa-users"></i> <a href="/userlist"><fa icon="file" />  用户列表</a></li>
            <li><i class="fas fa-user-tag"></i> <a href="/rolelist"><fa icon="file" />  角色列表</a></li>
            <li><i class="fas fa-list"></i> <a href="/menulist"><fa icon="file" />  菜单列表</a></li>
            <li><i class="fas fa-server"></i> <a href="resourcelist"><fa icon="file" />  资源列表</a></li>
          </ul>
        </li>
      </ul>
    <router-view></router-view>
  </div>

  <div id="topbar">
    <div class="topbar-left">
      <button @click="showSwitchEnterpriseDialog"><img src="@/assets/img/ch_en.png" alt="Icon"> 切换企业</button>
      <button @click="showCreateEnterpriseDialog"><img src="@/assets/img/cr_en.png" alt="Icon"> 创建企业</button>
      <button @click="showLogoutEnterpriseDialog"><img src="@/assets/img/ex_en.png" alt="Icon"> 注销企业</button>
    </div>
    <div class="topbar-right">
      <div class="user-info">
        <img src="@/assets/img/icon.png" alt="User Avatar">
        <div class="user-details">
          <div class="username">用户名</div>
          <div class="role">用户身份</div>
        </div>
      </div>
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
    </div>
  </div>

  <div id="topbar-bottom-line"></div> <!-- 顶部栏下方的线 -->

  <div id="main-content">
    <!-- 这里放置页面的主要内容 -->
    <div id="fletter-en">深</div>
    <div id="info-en">
      <p id="name-en">深圳大学</p>
      <p id="enname-en">shenzhen University</p>
      <span id="url-en">https://www.szu.edu.en</span>
      <span id="phone-en">+86 0755-2653-8888</span>
      <span id="builder-en">负责人：张企业</span>
    </div>

    <div id="numpeople-en">
        <div class="num1">企业总人数</div>
        <div class="num2">325</div>
    </div>
    <div id="increase-en">
        <div class="num1">近一月新增</div>
        <div class="num2">20</div>
    </div>
    <div id="info-mode">
      <button 
        :class="{ active: selectedOption === 'basic' }" 
        @click="selectOption('basic')"
        id="mode1"
      >
        基础信息
      </button>
      <button 
        :class="{ active: selectedOption === 'development' }" 
        @click="selectOption('development')"
        id="mode2"
      >
        企业发展
      </button>
    </div>

    <div id="maininfo-en">
      <div id="infobody">
        <div class="text-container" v-for="(text, index) in texts" :key="index">
          <span v-if="!editMode" class="text text-0">
            {{ texts[0] }}
          </span>
          <span v-if="!editMode" class="text text-1">
            {{ texts[1] }}
          </span>
          <span v-if="!editMode" class="text text-2">
            {{ texts[2] }}
          </span>
          <span v-if="!editMode" class="text text-3">
            {{ texts[3] }}
          </span>
          <span v-if="!editMode" class="text text-4">
            {{ texts[4] }}
          </span>
          <span v-if="!editMode" class="text text-5">
            {{ texts[5] }}
          </span>
          <span v-if="!editMode" class="text text-6">
            {{ texts[6] }}
          </span>
          <span v-if="!editMode" class="text text-7">
            {{ texts[7] }}
          </span>
          <span v-if="!editMode" class="text text-8">
            {{ texts[8] }}
          </span>
          <span v-if="!editMode" class="text text-9">
            {{ texts[9] }}
          </span>

          <div v-if="editMode" class="text-input text-input-0"><input type="text" v-model="editedTexts[0]" class="text-input"></div>
          <div v-else></div>
          <div v-if="editMode" class="text-input text-input-1"><input type="text" v-model="editedTexts[1]" class="text-input"></div>
          <div v-else></div>
          <div v-if="editMode" class="text-input text-input-2"><input type="text" v-model="editedTexts[2]" class="text-input"></div>
          <div v-else></div>
          <div v-if="editMode" class="text-input text-input-3"><input type="text" v-model="editedTexts[3]" class="text-input"></div>
          <div v-else></div>
          <div v-if="editMode" class="text-input text-input-4"><input type="text" v-model="editedTexts[4]" class="text-input"></div>
          <div v-else></div>
          <div v-if="editMode" class="text-input text-input-5"><input type="text" v-model="editedTexts[5]" class="text-input"></div>
          <div v-else></div>
          <div v-if="editMode" class="text-input text-input-6"><input type="text" v-model="editedTexts[6]" class="text-input"></div>
          <div v-else></div>
          <div v-if="editMode" class="text-input text-input-7"><input type="text" v-model="editedTexts[7]" class="text-input"></div>
          <div v-else></div>
          <div v-if="editMode" class="text-input text-input-8"><input type="text" v-model="editedTexts[8]" class="text-input"></div>
          <div v-else></div>
          <div v-if="editMode" class="text-input text-input-9"><input type="text" v-model="editedTexts[9]" class="text-input"></div>
          <div v-else></div>
          <!-- 后续文本和输入框依此类推 -->

        </div>
          <button v-if="!editMode" @click="toggleEditMode" id="edit-button">编辑</button>
          <!-- 保存和取消按钮 -->
          <div v-if="editMode">
            <button @click="saveTexts" id="save-button">保存</button>
            <button @click="cancelEdit" id="cancel-button">取消</button>
          </div>

          <div id="inname0" class="infoname">企业编号</div>
          <div id="inname1" class="infoname">企业域名</div>
          <div id="inname2" class="infoname">行业</div>
          <div id="inname3" class="infoname">规模</div>
          <div id="inname4" class="infoname">成立日期</div>
          <div id="inname5" class="infoname">开办资金</div>
          <div id="inname6" class="infoname">举办单位</div>
          <div id="inname7" class="infoname">经济来源</div>
          <div id="inname8" class="infoname">企业地址</div>
          <div id="inname9" class="infoname">企业ip</div>

      </div>

      <div id="contacts">
        <div id="con-title">企业联系人</div>
        <div id="con-peo1">
          <h3 class="peo-title">联系人1</h3>
          <p class="pi1">g17d729@qq.com</p>
          <p class="pi2">(86)25508966</p>
          <p class="pi3">外事部主任</p>
          <img class="con-icon" src="@/assets/img/icon.png" alt="User Avatar">
        </div>
        <div id="con-peo2">
          <h3 class="peo-title">联系人2</h3>
          <p class="pi1">k17d729@qq.com</p>
          <p class="pi2">(86)25508966</p>
          <p class="pi3">人事部主任</p>
          <img class="con-icon" src="@/assets/img/icon.png" alt="User Avatar">
        </div>
      </div>
    </div>


  </div>

  <component :is="currentDialog" @closeDialog="closeDialog" v-if="isDialogVisible" />

</template>

<script>
import { UserInfo } from '@/store/userinfo';
const userInfo = UserInfo();
import { listInfo } from '@/store/liststate';
const liststate = listInfo();
import SwitchEnterprise from './SwitchEnterprise.vue';
import CreateEnterprise from './CreateEnterprise.vue';
import LogoutEnterprise from './LogoutEnterprise.vue';

export default {
  
  name: 'EnterpriseInfo',
  data() {
    return {
      subMenuStatus: {
        home: true,
        organization: true,
        enterprise: true,
        authority: true
      },
      texts: ['QIYEBIANHAO001', 'szu.edu.cn', '软件开发','100人以上','1983-01-01','31586万元人民币','深圳市政府','财政核拨','深圳市南山区粤海街道3688号','属地：广东'], // 初始文字内容数组
      editMode: false, // 编辑模式状态，初始为false表示不处于编辑模式
      editedTexts: Array(10).fill(''),// 编辑后的文字内容数组
      currentDialog: '', // 当前显示的弹窗组件名称
      isDialogVisible: false, // 是否显示弹窗
      selectedOption: 'basic',
      isMenuOpen: false, // 用于控制气泡菜单的显示与隐藏
      groupstate: liststate.value.group,
      departmentstate: liststate.value.department,
      enterprisestate: liststate.value.enterprise,
    }
  },
  components:{
    SwitchEnterprise,
    CreateEnterprise,
    LogoutEnterprise
  },
  methods: {
    toggleSubMenu(item) {
      this.subMenuStatus[item] = !this.subMenuStatus[item];
    },
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen; // 点击按钮时切换菜单的显示状态
      },
    toggleEditMode() {
      // 切换所有文本的编辑模式
      this.editMode = !this.editMode;
    },
    saveTexts() {
      if (this.editMode) {
        // 保存修改的文字内容
        this.texts = [...this.editedTexts];
        this.editMode = false; // 退出编辑模式
      }
    },
    cancelEdit() {
      if (this.editMode) {
        // 取消编辑，恢复原始文字内容
        this.editMode = false; // 退出编辑模式
        this.editedTexts = [...this.texts]; // 恢复为原始文字内容
      }
    },
    // 显示切换企业弹窗
    showSwitchEnterpriseDialog() {
      this.currentDialog = 'SwitchEnterprise';
      this.isDialogVisible = true;
    },
    // 显示创建企业弹窗
    showCreateEnterpriseDialog() {
      this.currentDialog = 'CreateEnterprise';
      this.isDialogVisible = true;
    },
    // 显示注销企业弹窗
    showLogoutEnterpriseDialog() {
      this.currentDialog = 'LogoutEnterprise';
      this.isDialogVisible = true;
    },
    // 关闭弹窗
    closeDialog() {
      this.currentDialog = '';
      this.isDialogVisible = false;
    },
    selectOption(option) {
      this.selectedOption = option;
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


#topbar {
  background-color: #fff; /* 设置顶部栏背景色 */
  color: #161515; /* 设置文字颜色 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;

}

.topbar-left {
  display: flex;
  margin-left: 250px;
}



/* 设置顶部栏按钮的样式 */
.topbar-left button {
  background-color: #fff; /* 按钮背景色 */
  color: #161515; /* 按钮文字颜色 */
  border: none; /* 移除按钮边框 */
  padding: 10px 20px; /* 按钮内边距 */
  font-size: 18px; /* 按钮文字字号 */
  cursor: pointer; /* 鼠标悬停样式为手型 */
  transition: background-color 0.3s ease; /* 添加背景色过渡效果 */
  display: flex; /* 使用 Flex 布局使图标与文字水平排列 */
  align-items: center; /* 垂直居中对齐图标与文字 */
  margin-right: 10px; /* 添加右侧间距 */
}

/* 鼠标悬停时按钮背景色变深 */
.topbar-left button:hover {
  background-color: #cfd2d4;
}

.topbar-left button img {
  margin-right: 5px; /* 图标与文字之间的右侧间距 */
}

.topbar-right {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info img {
  width: 60px; /* 设置用户头像的宽度 */
  height: 60px; /* 设置用户头像的高度 */
  border-radius: 50%; /* 将头像设置为圆形 */
  margin-right: 15px;
}

.user-details {
  font-size: 14px; /* 设置用户信息文字的字号 */
  margin-right: 45px;
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

#topbar-bottom-line {
  border-bottom: 2px solid #BBBBBB; /* 画出下方的实线 */
  margin-left: 250px;
  width: 86%; /* 设置线的宽度为，与页面宽度相符 */
}

.bubble-menu {
    position:absolute;
    top: 75px; /* 根据需要调整菜单的位置 */
    left: 1690px;
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

#main-content {
  margin-top: 20px; /* 设置与顶部栏的间距 */
  margin-left: 250px;
  text-align: center; /* 让内容居中显示 */
  padding: 20px; /* 设置内容区域的内边距 */
}

#fletter-en{
  display: flex;
  width: 80px; /* 设置矩形宽度 */
  height: 80px; /* 设置矩形高度 */
  background-color: #fb5b1d; /* 设置矩形背景色 */
  border-radius: 20px; /* 设置圆角半径 */
  position:absolute;
  left: 330px;
  top: 100px;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-size: 200%;
  color:#fff
}

#info-en{
  width: 600px; /* 设置矩形宽度 */
  height: 150px; /* 设置矩形高度 */
  position:absolute;
  left: 440px;
  top: 80px;
  /* border: 2px solid black; */
  text-align: left; /* 将文本内容左对齐 */
}
#name-en{
  font-size: 150%;
  font-weight:1000;
}
#enname-en{
  font-size: 100%;
  font-weight:10;
  color:#948F8F
}
#url-en{
  font-size: 100%;
  font-weight:10;
  color:#948F8F;
  position: absolute;
  left:0px
}
#phone-en{
  font-size: 100%;
  font-weight:10;
  color:#948F8F;
  position: absolute;
  left:210px
}
#builder-en{
  font-size: 100%;
  font-weight:10;
  color:#948F8F;
  position: absolute;
  left:410px
}
#numpeople-en{
  display: flex;
  width: 170px; /* 设置矩形宽度 */
  height: 170px; /* 设置矩形高度 */
  background-color: #FF9502; /* 设置矩形背景色 */
  border-radius: 20px; /* 设置圆角半径 */
  position:absolute;
  left: 1300px;
  top: 120px;
  
}
#increase-en{
  display: flex;
  width: 170px; /* 设置矩形宽度 */
  height: 170px; /* 设置矩形高度 */
  background-color: #6F6EDD; /* 设置矩形背景色 */
  border-radius: 20px; /* 设置圆角半径 */
  position:absolute;
  left: 1500px;
  top: 120px;
}
.num1{
  position:absolute;
  left: 10%;
  top: 10%;
  text-align: left; /* 将文本内容左对齐 */
  font-size: 100%;
  font-weight:1000;
  color:#FFF;
}
.num2{
  position:absolute;
  left: 20%;
  top: 45%;
  text-align: left; /* 将文本内容左对齐 */
  font-size: 300%;
  font-weight:500;
  color:#FFF;
}
#maininfo-en{
  display: flex;
  width: 1620px; /* 设置矩形宽度 */
  height: 620px; /* 设置矩形高度 */
  background-color: #F5F7FA; /* 设置矩形背景色 */
  border-radius: 15px; /* 设置圆角半径 */
  position:absolute;
  left: 300px;
  top: 310px;
}
#infobody{
  display: flex;
  width: 1050px; /* 设置矩形宽度 */
  height: 580px; /* 设置矩形高度 */
  border-radius: 15px; /* 设置圆角半径 */
  border: 1px solid #fb5b1d; /* 设置边框 */
  background-color: #fff; /* 设置矩形背景色 */
  position:absolute;
  left: 15px;
  top: 25px;
}
#contacts{
  display: flex;
  width: 470px; /* 设置矩形宽度 */
  height: 580px; /* 设置矩形高度 */
  border-radius: 15px; /* 设置圆角半径 */
  border: 1px solid #fb5b1d; /* 设置边框 */
  background-color: #fff; /* 设置矩形背景色 */
  position:absolute;
  left: 1100px;
  top: 25px;
}
#con-title{
  display: flex;
  position:absolute;
  left: 50px;
  top: 25px;
  font-size: 20px;
  font-weight: 1000;
  color:#050505;
}
#con-peo1{
  position:absolute;
  left: 40px;
  top: 80px;
  width: 380px; /* 设置矩形宽度 */
  height: 180px; /* 设置矩形高度 */
  border-radius: 15px; /* 设置圆角半径 */
  border: 1px solid #6F6EDD; /* 设置边框 */
}
#con-peo2{
  position:absolute;
  left: 40px;
  top: 320px;
  width: 380px; /* 设置矩形宽度 */
  height: 180px; /* 设置矩形高度 */
  border-radius: 15px; /* 设置圆角半径 */
  border: 1px solid #6F6EDD; /* 设置边框 */
}
.peo-title{
  position:absolute;
  text-align: left;
  left: 30px;
}
.pi1{
  text-align: left;
  position: absolute;
  left: 70px;
  top: 50px;
}
.pi2{
  text-align: left;
  position: absolute;
  left: 70px;
  top: 80px;
}
.pi3{
  text-align: left;
  position: absolute;
  left: 70px;
  top: 110px;
}
.con-icon{
  position: absolute;
  left: 260px;
  top: 45px;
  width: 100px; /* 设置用户头像的宽度 */
  height: 100px; /* 设置用户头像的高度 */
  border-radius: 50%; /* 将头像设置为圆形 */
  margin-right: 15px;
}


#edit-button {
  position: absolute;
  left: 960px;
  top: 15px;
  width: 80px;
  height: 30px;
  background-color: #5756D7; /* 绿色背景 */
  color: white; /* 白色文字 */
  font-size: 15px; /* 设置字体大小 */
  border: none; /* 无边框 */
  border-radius: 5px; /* 设置圆角半径 */
  cursor: pointer; /* 鼠标悬停样式 */
}

/* 保存按钮样式 */
#save-button {
  position: absolute;
  left: 860px;
  top: 15px;
  width: 80px;
  height: 30px;
  background-color: #5756D7; /* 绿色背景 */
  color: white; /* 白色文字 */
  font-size: 15px; /* 设置字体大小 */
  border: none; /* 无边框 */
  border-radius: 5px; /* 设置圆角半径 */
  cursor: pointer; /* 鼠标悬停样式 */
}

/* 取消按钮样式 */
#cancel-button {
  position: absolute;
  left: 960px;
  top: 15px;
  width: 80px;
  height: 30px;
  background-color: #fff; /* 绿色背景 */
  color: rgb(36, 33, 33); /* 白色文字 */
  font-size: 15px; /* 设置字体大小 */
  border: 1px solid #050505; /* 无边框 */
  border-radius: 5px; /* 设置圆角半径 */
  cursor: pointer; /* 鼠标悬停样式 */
}

/* 编辑模式下输入框的样式 */
#maininfo-en input[type="text"] {
  width: 90%; /* 设置输入框宽度 */
  padding: 10px; /* 设置输入框内边距 */
  margin: 10px auto; /* 设置输入框居中 */
  font-size: 16px; /* 设置字体大小 */
  border: 2px solid #ccc; /* 设置边框样式 */
  border-radius: 5px; /* 设置圆角 */
  box-sizing: border-box; /* 设置盒子模型为边框盒模型 */
}

/* 编辑模式下输入框激活状态的样式 */
#maininfo-en input[type="text"]:focus {
  outline: none; /* 移除默认的焦点样式 */
  border-color: #5756D7; /* 设置输入框边框颜色 */
  box-shadow: 0 0 5px rgba(87, 86, 215, 0.5); /* 添加阴影效果 */
}

.text {
  /* 共享样式 */
  font-size: 15px;
}

.text-0 {
  /* 文字 0 的特定样式 */
  position:absolute;
  left:60px;
  top:80px;
}
#inname0{
  position:absolute;
  left:60px;
  top:50px;
}
.text-1 {
  /* 文字 1 的特定样式 */
  position:absolute;
  left:520px;
  top:80px;
}
#inname1{
  position:absolute;
  left:520px;
  top:50px;
}
.text-2 {
  /* 文字 1 的特定样式 */
  position:absolute;
  left:60px;
  top:180px;
}
#inname2{
  position:absolute;
  left:60px;
  top:150px;
}

.text-3 {
  /* 文字 1 的特定样式 */
  position:absolute;
  left:520px;
  top:180px;
}
#inname3{
  position:absolute;
  left:520px;
  top:150px;
}

.text-4 {
  /* 文字 1 的特定样式 */
  position:absolute;
  left:60px;
  top:280px;
}
#inname4{
  position:absolute;
  left:60px;
  top:250px;
}

.text-5 {
  /* 文字 1 的特定样式 */
  position:absolute;
  left:520px;
  top:280px;
}
#inname5{
  position:absolute;
  left:520px;
  top:250px;
}

.text-6 {
  /* 文字 1 的特定样式 */
  position:absolute;
  left:60px;
  top:380px;
}
#inname6{
  position:absolute;
  left:60px;
  top:350px;
}

.text-7 {
  /* 文字 1 的特定样式 */
  position:absolute;
  left:520px;
  top:380px;
}
#inname7{
  position:absolute;
  left:520px;
  top:350px;
}

.text-8 {
  /* 文字 1 的特定样式 */
  position:absolute;
  left:60px;
  top:500px;
}
#inname8{
  position:absolute;
  left:60px;
  top:470px;
}

.text-9 {
  /* 文字 1 的特定样式 */
  position:absolute;
  left:520px;
  top:500px;
}
#inname9{
  position:absolute;
  left:520px;
  top:470px;
}

/* 编辑模式下输入框的样式 */
.text-input {
  width: 30%; /* 设置输入框宽度 */
  padding: 10px; /* 设置输入框内边距 */
  margin: 10px auto; /* 设置输入框居中 */
  font-size: 16px; /* 设置字体大小 */
  border: 2px solid #ccc; /* 设置边框样式 */
  border-radius: 5px; /* 设置圆角 */
  box-sizing: border-box; /* 设置盒子模型为边框盒模型 */
}

.text-input-0{
  border: none;
  position:absolute;
  left:30px;
  top:40px;
}
.text-input-1{
  border: none;
  position:absolute;
  left:490px;
  top:40px;
}
.text-input-2{
  border: none;
  position:absolute;
  left:30px;
  top:140px;
}
.text-input-3{
  border: none;
  position:absolute;
  left:490px;
  top:140px;
}
.text-input-4{
  border: none;
  position:absolute;
  left:30px;
  top:240px;
}
.text-input-5{
  border: none;
  position:absolute;
  left:490px;
  top:240px;
}
.text-input-6{
  border: none;
  position:absolute;
  left:30px;
  top:340px;
}
.text-input-7{
  border: none;
  position:absolute;
  left:490px;
  top:340px;
}
.text-input-8{
  border: none;
  position:absolute;
  left:30px;
  top:465px;
}
.text-input-9{
  border: none;
  position:absolute;
  left:490px;
  top:465px;
}

.infoname{
  position:absolute;
  text-align: left;
  color: #B4AFAF;
}
#info-mode {
  width: 240px;
  height:40px;
  padding: 5px;
  position: absolute;
  left: 380px;
  top: 268px;
  display: flex;
  background-color:#F5F7FA;
  border-radius: 10px; /* 设置圆角半径 */
}

#mode1 {
  background-color: #F5F7FA;
  border: none;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
  margin-left: 20px;
}
#mode2 {
  background-color: #F5F7FA;
  border: none;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
  margin-left: 20px;
}

#mode1.active {
  color: #fb5b1d; /* 改变选中选项的背景颜色 */
}
#mode2.active {
  color: #fb5b1d; /* 改变选中选项的背景颜色 */
}


</style>
