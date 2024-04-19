<template>
  <h3>shouye</h3>
  <div id="sidebar">
    <!-- Logo -->
    <img :src="require('@/assets/img/wt_logo.png')" alt="Logo" class="logo">
    <!-- Sidebar-->
    <ul>
      <li id="home" @click="toggleSubMenu('home')">
        <i class="fas fa-file"></i>
        <a>首页</a>
      </li>
      <li id="organization" @click="toggleSubMenu('organization')">
        <i class="fas fa-file"></i>  
        <a>组织架构</a>
        <ul class="submenu" v-show="subMenuStatus.organization">
          <li><i class="fas fa-file"></i> 成员管理</li>
          <li><i class="fas fa-file"></i> 团队管理</li>
          <li><i class="fas fa-file"></i> 部门管理</li>
        </ul>
      </li>
      <li id="enterprise" @click="toggleSubMenu('enterprise')">
        <i class="fas fa-file"></i>  
        <a>企业管理</a>
        <ul class="submenu" v-show="subMenuStatus.enterprise">
          <li><i class="fas fa-file"></i> <router-link to="/enterprise">企业概览</router-link></li>
        </ul>
      </li>
      <li id="authority" @click="toggleSubMenu('authority')">
        <i class="fas fa-file"></i>  
        <a>权限列表</a>
        <ul class="submenu" v-show="subMenuStatus.authority">
          <li><i class="fas fa-users"></i> 用户列表</li>
          <li><i class="fas fa-user-tag"></i> 角色列表</li>
          <li><i class="fas fa-list"></i> 菜单列表</li>
          <li><i class="fas fa-server"></i> 资源列表</li>
        </ul>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      subMenuStatus: {
        home: false,
        organization: false,
        enterprise: false,
        authority: false
      }
    }
  },
  methods: {
    toggleSubMenu(item) {
      this.subMenuStatus[item] = !this.subMenuStatus[item];
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
  width: 250px;
  height: 100%;
  background: #fff;
  color: #fff;
  padding-top: 20px;
}
.submenu {
  
  padding-left: 50px;
}
.submenu.open {
  display: block;
}

#sidebar {
  position: fixed;
  width: 250px;
  height: 100%;
  background: #FFF; /* 设置侧边栏背景色 */
  color: #948F8F; /* 设置文字颜色 */
  padding-top: 20px;
  padding-left: 24px;
}

ul {
  list-style: none; /* 移除默认的列表样式 */
  padding: 10px 0;
}

li {
  padding: 10px 0;
  font-size: 20px; /* 设置字体大小 */
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
  font-size: 20px; /* 设置字体大小 */
}

#sidebar a:hover {
  color: #ff7f50; /* 设置悬停时的文字颜色 */
}


.logo {
  display: block;
  margin: 10px auto; /* 设置logo居中并与菜单项有一定的间距 */
  width: 180px; /* 设置logo宽度 */
  height: auto; /* 根据宽度自动调整高度 */
}


#topbar {
  background-color: #fff; /* 设置顶部栏背景色 */
  color: #161515; /* 设置文字颜色 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;

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
  width: 40px; /* 设置用户头像的宽度 */
  height: 40px; /* 设置用户头像的高度 */
  border-radius: 50%; /* 将头像设置为圆形 */
  margin-right: 10px;
}

.user-details {
  font-size: 14px; /* 设置用户信息文字的字号 */
}

.username {
  font-weight: bold; /* 设置用户名字体加粗 */
}

.role {
  color: #050505; /* 设置用户身份文字颜色 */
}

#topbar-bottom-line {
  border-bottom: 2px solid #BBBBBB; /* 画出下方的实线 */
  margin-left: 250px;
  width: 83%; /* 设置线的宽度为，与页面宽度相符 */
}

#main-content {
  margin-top: 20px; /* 设置与顶部栏的间距 */
  margin-left: 250px;
  text-align: center; /* 让内容居中显示 */
  padding: 20px; /* 设置内容区域的内边距 */
}
</style>
