<template>
    <div class="cpages">
        <div id="sidebar">
            <img src="../assets/logo.png" alt="Logo" class="logo">
            <ul>
                <li id="home"><a href="#" @click="toggleSubmenu"><i class="fas fa-file"></i>  首页</a></li>
                <li id="organization"><a href="#" @click="toggleSubmenu"><i class="fas fa-file"></i>  组织架构</a>
                <ul class="submenu">
                    <li><a href="#" style="color: #ff7f50;" @click="toggleSubmenu"><i class="fas fa-file"></i>  成员管理</a></li>
                    <li><a href="#" @click="toggleSubmenu"><i class="fas fa-file"></i>  团队管理</a></li>
                    <li><a href="#" @click="toggleSubmenu"><i class="fas fa-file"></i>  部门管理</a></li>
                </ul>
                </li>
                <li id="enterprise"><a href="#" @click="toggleSubmenu"><i class="fas fa-file"></i>  企业管理</a>
                <ul class="submenu">
                    <li><a href="#" @click="toggleSubmenu"><i class="fas fa-file"></i>  企业概览</a></li>
                </ul>
                </li>
                <li id="authority"><a href="#" @click="toggleSubmenu"><i class="fas fa-file"></i>  权限列表 </a>
                <ul class="submenu">
                    <li><a href="#" @click="toggleSubmenu"><i class="fas fa-users"></i>  用户列表</a></li>
                    <li><a href="#" @click="toggleSubmenu"><i class="fas fa-user-tag"></i>  角色列表</a></li>
                    <li><a href="#" @click="toggleSubmenu"><i class="fas fa-list"></i>  菜单列表</a></li>
                    <li><a href="#" @click="toggleSubmenu"><i class="fas fa-server"></i>  资源列表</a></li>
                </ul>
                </li>
            
            </ul>
        </div>
        <div class="content">
            <div class="path">
                <span class="symbol">深</span>
                <span class="company">深大/</span>
                <span class="first-level">成员架构/</span>
                <span class="second-level">成员管理</span>
            </div>
            <br>
            <div class="search-filter-box">
                <span class="search-box">
                    <i class="fas fa-search"></i>
                    名称：<input type="text" placeholder="输入成员名">
                </span>
                <span class="search-position">
                    职位：<input type="text" placeholder="输入职位">
                </span>                
                <span class="search-tel">
                    联系电话：<input type="text" placeholder="输入邮箱">
                </span>
                <span class="search-dept">
                    部门：<input type="text" placeholder="输入部门">
                </span>
            </div>
            <!-- <div class="separator"></div> -->
            <div class="data-list-box">
                <!-- <div class="data-list-title"><i class="fas fa-list"></i> 数据列表</div> -->
                <div id="topbar">
                    <div class="topbar-left">
                        <img src="../assets/changeDept.png" alt="Icon"><button class="bnt1"> 变更部门</button>
                        <img src="../assets/delsymbol.png" alt="Icon"><button class="bnt2"> 删除</button>
                        <img src="../assets/allselect.png" alt="Icon"><button class="bnt3" @click="selectAll"> 全选</button>                        
                        <img src="../assets/diselect.png" alt="Icon"><button class="bnt4" @click="invertSelection"> 反选</button>
                    </div>
                </div>
                <button class="btn-secondary">邀请成员</button>
            </div>
            <!-- <div class="separator"></div> -->
            <table>
                <!-- Table structure and data -->
                <thead>
                <tr>
                    <th><input type="checkbox" class="select-all"> <!-- 全选复选框 --></th>
                    <th>成员</th>
                    <th>职位</th>
                    <th>邮箱</th>
                    <th>部门</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <!-- Sample row -->
                <tr v-for="user in users" :key="user.id">
                    <td><input type="checkbox" class="row-selector" @click="selectUser(user)" v-model="user.selected"></td>
                    <td class="memName">{{ user.name }}</td>
                    <td>{{ user.position }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.deptName }}</td>
                    <td class="button-container">
                        <button class="assign_dept" @click="assignDept(user)">变更部门</button>
                        <button class="edit_button" @click="editUser(user)">编辑</button>
                        <button class="delete_button" @click="deleteUser(user)">删除</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!-- 点击邀请成员后弹窗 -->
        <div class="modal-background"></div>
        <div class="modal">
            <div class="modal-content">
                <!-- 在这里放置弹窗内容 -->
                <span class="close">&times;</span>
                <p class="add_title">邀请成员</p>
                <div class="emailname">
                    <div class="email-container">
                        <span>邀请对象邮箱</span>
                        <br>
                        <br>
                        <input type="text" class="emailinput" placeholder="  请输入邮箱" v-model="newemail">
                    </div>
                </div>
                <div class="confirmbutton">
                    <button class="confirm" @click="inviteconfirm">确认发送邀请码</button> 
                </div>
            </div>
        </div>
        <!-- 点击编辑后弹窗 -->
        <div class="edit-modal-background"></div>
        <div class="edit-modal">  <!-- 新的唯一标识符 -->
            <div class="edit-modal-content">
                <!-- 在这里放置弹窗内容 -->
                <span class="edit-close" @click="editclose">&times;</span>
                <p class="edit_title">编辑成员</p>
                <div class="edit-position">
                    <span>职位：</span>
                    <input type="text" class="edit-name-input" placeholder="  请输入姓名" v-model="editPosition">
                </div>
                <div class="edit-confirmbutton">
                    <button class="edit-confirm" @click="editconfirm">确认保存</button> 
                </div>
            </div>
        </div>
        <!-- 点击删除后弹窗 -->
        <div class="del-modal-background"></div>
        <div class="del-modal">  <!-- 新的唯一标识符 -->
            <div class="del-modal-content">
                <!-- 在这里放置弹窗内容 -->
                <span class="del-close" @click="delclose">&times;</span>
                <p class="del_title">编辑成员</p>
                <div class="del-name">
                    <span>姓名：{{ delName }}</span>
                </div>
                <div class="del-confirmbutton">
                    <button class="del-confirm" @click="delconfirm">确认删除</button> 
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import { ref } from 'vue';
// const newemail = ref('');
export default {
    name: "MemberList",
    data() {
        return {
            users: [], // 用于存储从服务器获取的用户数据
            newemail: "",
            selectAllCheckbox: true, // 全选复选框的状态
            editPosition: "",
            delemail: "",
            delName: ""
        };
    },
    mounted() {
        //侧边导航栏
        this.initSubmenus();

        // 获取搜索框元素-成员名
        const searchMember = document.querySelector('.search-box input[type="text"]');
        // 获取搜索框元素-职位
        const searchPosition = document.querySelector('.search-position input[type="text"]');
        // 获取搜索框元素-联系电话
        const searchTel = document.querySelector('.search-tel input[type="text"]');
        // 获取搜索框元素-部门
        const searchDept = document.querySelector('.search-dept input[type="text"]');        
        
        // 添加查询成员事件监听器-
        searchMember.addEventListener('keypress', function (event) {
            // 判断是否按下的是回车键
            if (event.key === 'Enter') {
                performSearchMember();
            }
        });

        // 定义查询功能函数
        function performSearchMember() {
            // 获取输入框中的关键字
            var keyword = searchMember.value.trim().toLowerCase();

            // 获取所有的表格行
            var rows = document.querySelectorAll('tbody tr');

            // 遍历每一行
            rows.forEach(function (row) {
                // 获取当前行的角色名称单元格的内容
                var memberName = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();

                // 如果角色名称包含关键字，则显示该行，否则隐藏该行
                if (memberName.includes(keyword)) {
                    row.style.display = 'table-row';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        // 添加查询职位事件监听器-
        searchPosition.addEventListener('keypress', function (event) {
            // 判断是否按下的是回车键
            if (event.key === 'Enter') {
                performSearchPosition();
            }
        });

        // 定义查询功能函数
        function performSearchPosition() {
            // 获取输入框中的关键字
            var keyword = searchPosition.value.trim().toLowerCase();

            // 获取所有的表格行
            var rows = document.querySelectorAll('tbody tr');

            // 遍历每一行
            rows.forEach(function (row) {
                // 获取当前行的职位名称单元格的内容
                var positionName = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();

                // 如果职位名称包含关键字，则显示该行，否则隐藏该行
                if (positionName.includes(keyword)) {
                    row.style.display = 'table-row';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        // 添加查询部门事件监听器-
        searchTel.addEventListener('keypress', function (event) {
            // 判断是否按下的是回车键
            if (event.key === 'Enter') {
                performSearchTel();
            }
        });

        // 定义查询功能函数
        function performSearchTel() {
            // 获取输入框中的关键字
            var keyword = searchTel.value.trim().toLowerCase();

            // 获取所有的表格行
            var rows = document.querySelectorAll('tbody tr');

            // 遍历每一行
            rows.forEach(function (row) {
                // 获取当前行的部门名称单元格的内容
                var telName = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();

                // 如果部门名称包含关键字，则显示该行，否则隐藏该行
                if (telName.includes(keyword)) {
                    row.style.display = 'table-row';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        // 添加查询部门事件监听器-
        searchDept.addEventListener('keypress', function (event) {
            // 判断是否按下的是回车键
            if (event.key === 'Enter') {
                performSearchDept();
            }
        });

        // 定义查询功能函数
        function performSearchDept() {
            // 获取输入框中的关键字
            var keyword = searchDept.value.trim().toLowerCase();

            // 获取所有的表格行
            var rows = document.querySelectorAll('tbody tr');

            // 遍历每一行
            rows.forEach(function (row) {
                // 获取当前行的部门名称单元格的内容
                var deptName = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();

                // 如果部门名称包含关键字，则显示该行，否则隐藏该行
                if (deptName.includes(keyword)) {
                    row.style.display = 'table-row';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        //拉取列表
        this.fetchUserData();

        //点击添加后添加弹窗
        var addButton = document.querySelector('.btn-secondary');
        var modal = document.querySelector('.modal');
        var modalBackground = document.querySelector('.modal-background');
        var closeButton = document.querySelector('.close');
        var confirmButton = document.querySelector('.confirm');

        // 打开弹窗
        addButton.addEventListener('click', function () {
            openAddModal();
        });

        // 关闭弹窗（点击关闭按钮）
        closeButton.addEventListener('click', function () {
            closeModal();
        });

        // 打开邀请成员弹窗
        function openAddModal() {
            var modal = document.querySelector('.modal');
            var modalBackground = document.querySelector('.modal-background');
            modal.style.display = 'block';
            modalBackground.style.display = 'block';

            setTimeout(function () {
                modal.style.opacity = '1';
                modalBackground.style.opacity = '1';
            }, 50); // 设置一个小延迟以确保动画生效
        }
        //关闭邀请成员弹窗
        function closeModal() {
            modal.style.opacity = '0';
            modalBackground.style.opacity = '0';

            setTimeout(function () {
                modal.style.display = 'none';
                modalBackground.style.display = 'none';
            }, 300); // 与动画时间保持一致
        }
    },
    methods: {
        //侧边栏
        toggleSubmenu(event) {
            event.preventDefault();
            const submenu = event.target.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle('open');
                const sidebarState = submenu.classList.contains('open') ? 'expanded' : 'collapsed';
                localStorage.setItem(submenu.parentElement.id, sidebarState);
            }
        },
        initSubmenus() {
            const submenus = document.querySelectorAll('.submenu');
            submenus.forEach(submenu => {
                const sidebarState = localStorage.getItem(submenu.parentElement.id);
                if (sidebarState === 'expanded') {
                    submenu.classList.add('open');
                } else {
                    // 默认展开“成员管理”子菜单
                    if (submenu.parentElement.id === 'organization') {
                        submenu.classList.add('open');
                        localStorage.setItem(submenu.parentElement.id, 'expanded');
                    }
                }
            });
        },

        //邀请成员确认按钮
        inviteconfirm() {
            console.log('email='+this.newemail);
            // 创建要发送的数据对象
            var data = {
                email: this.newemail,
                companyId: 1 //后面改
            };

            // 使用Fetch API发送POST请求到API端点
            fetch('http://localhost:8080/api/email/sendInviteCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAABWLQQ7CIBBF7zLrkgDDMNBzmLgehGo1pk2hC2O8u7D877_3hWdbYYZAHrUsrKyVrBylRUXSSbGIDx7xFkTDBKs0mA0bdBqRwgT1TL2un9rKe_y19nndjtdlu5f2KEeHcuYOZd-HkEfPkZy3MQTiaLRl9_sDvTIS7IgAAAA.mUCEDwZmF6gbUx3XILikOf9maeZk8NRBQZEaYv1pe4CN-_KhvDHqU_b33D7ilxsRmT6mVrygm5KZy1buVUTFAg', // 设置 Authorization 请求头，用于身份验证
                    'companyId': 1
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.ok) {
                        // 数据成功发送到服务器
                        console.log('Data sent successfully.');
                        alert("邀请码发送成功！");
                        location.reload();//刷新页面
                    } else {
                        // 数据发送失败
                        console.error('Failed to send data to server.');
                        alert("邀请码发送失败！");
                    }
                })
                .catch(error => {
                    // 捕获网络错误或其他错误
                    console.error('Error:', error);
                    alert("异常错误");
                });
        },

        //拉取列表
        fetchUserData() {
            const url = 'http://localhost:8080/api/company_user/getAllMember?companyId=1';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
                    'Authorization': 'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAABWLQQ7CIBBF7zLrkgDDMNBzmLgehGo1pk2hC2O8u7D877_3hWdbYYZAHrUsrKyVrBylRUXSSbGIDx7xFkTDBKs0mA0bdBqRwgT1TL2un9rKe_y19nndjtdlu5f2KEeHcuYOZd-HkEfPkZy3MQTiaLRl9_sDvTIS7IgAAAA.mUCEDwZmF6gbUx3XILikOf9maeZk8NRBQZEaYv1pe4CN-_KhvDHqU_b33D7ilxsRmT6mVrygm5KZy1buVUTFAg', // 设置 Authorization 请求头，用于身份验证
                    'companyId': 1 // 设置 companyId 请求头，用于传递公司 ID
                }
            })
                .then(response => {
                    console.log(response);
                    // 检查响应状态
                    if (!response.ok) {
                        alert("拉取失败")
                        throw new Error('Network error');
                    }
                    // 解析响应为 JSON 格式
                    return response.json();
                })
                .then(data => {
                    // this.users = data.map(item => ({
                    //     id: item.id,
                    //     name: item.name,
                    //     position: item.position,
                    //     email: item.email,
                    //     dept: item.deptName
                    // }));
                    // 请求成功，更新用户数据
                    this.users = data.data;                    
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    // Handle the error, e.g., show a message to the user
                });
            },
            // 全选功能
            selectAll() {
            // 将所有用户的选中状态设置为全选复选框的状态
            this.users.forEach(user => (user.selected = this.selectAllCheckbox));
            },

            // 反选功能
            invertSelection() {
            // 反转每个用户的选中状态
            this.users.forEach(user => (user.selected = !user.selected));
            },
            // selectAll() {
            // const checkboxes = document.querySelectorAll('.row-selector');
            // for (let checkbox of checkboxes) {
            //     checkbox.checked = document.querySelector('.select-all').checked;
            // }
            // },
            selectUser(user) {
            user.selected = !user.selected;
            },
            assignDept(user) {
            console.log('Assigning department to user:', user);
            // Implement department assignment logic here
            },
            //打开编辑窗口
            editUser(user) {
                console.log('Editing user:', user);
                this.editPosition = user.position;
                // Implement user edit logic here
                var modal = document.querySelector('.edit-modal');
                var modalBackground = document.querySelector('.edit-modal-background');
                modal.style.display = 'block';
                modalBackground.style.display = 'block';

                setTimeout(function () {
                    modal.style.opacity = '1';
                    modalBackground.style.opacity = '1';
                }, 50); // 设置一个小延迟以确保动画生效
            },
            //关闭编辑窗口
            editclose() {
                var modal = document.querySelector('.edit-modal');
                var modalBackground = document.querySelector('.edit-modal-background');
                modal.style.opacity = '0';
                modalBackground.style.opacity = '0';

                setTimeout(function () {
                    modal.style.display = 'none';
                    modalBackground.style.display = 'none';
                }, 300); // 与动画时间保持一致
            },
            //确认编辑
            editconfirm() {
                alert("编辑成功！");
                location.reload();//刷新页面
            },
            //打开删除窗口
            deleteUser(user) {
                console.log('Deleting user:', user);
                // Implement user delete logic here
                this.delName = user.name;
                this.delemail = user.email;
                var modal = document.querySelector('.del-modal');
                var modalBackground = document.querySelector('.del-modal-background');
                modal.style.display = 'block';
                modalBackground.style.display = 'block';

                setTimeout(function () {
                    modal.style.opacity = '1';
                    modalBackground.style.opacity = '1';
                }, 50); // 设置一个小延迟以确保动画生效
            },
            //关闭删除窗口
            delclose() {
                var modal = document.querySelector('.del-modal');
                var modalBackground = document.querySelector('.del-modal-background');
                modal.style.opacity = '0';
                modalBackground.style.opacity = '0';

                setTimeout(function () {
                    modal.style.display = 'none';
                    modalBackground.style.display = 'none';
                }, 300); // 与动画时间保持一致
            },
            //确认删除
            delconfirm() {
                console.log("delemail=" + this.delemail);
                // 使用Fetch API发送DELETE请求到API端点
                fetch('http://localhost:8080/api/user/delete_member?email=' + this.delemail + '&companyId=1', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAABWLQQ7CIBBF7zLrkgDDMNBzmLgehGo1pk2hC2O8u7D877_3hWdbYYZAHrUsrKyVrBylRUXSSbGIDx7xFkTDBKs0mA0bdBqRwgT1TL2un9rKe_y19nndjtdlu5f2KEeHcuYOZd-HkEfPkZy3MQTiaLRl9_sDvTIS7IgAAAA.mUCEDwZmF6gbUx3XILikOf9maeZk8NRBQZEaYv1pe4CN-_KhvDHqU_b33D7ilxsRmT6mVrygm5KZy1buVUTFAg'// 设置 Authorization 请求头，用于身份验证
                    }
                })
                    .then(response => {
                        console.log("response="+ response);
                        if (response.ok) {
                            // 数据成功发送到服务器
                            console.log('Data delete successfully.');
                            alert("删除成功！");
                            location.reload();//刷新页面
                        } else {
                            // 数据发送失败
                            console.error('Failed to delete data to server.');
                            alert("删除失败！");
                        }
                    })
                    .catch(error => {
                        // 捕获网络错误或其他错误
                        console.error('Error:', error);
                        alert("异常错误");
                    });
            },
    }
}
</script>
<style scoped>
template{
    background-color: #f8f9fa;
}
.cpages{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
    height: 100%;
    background: #f8f9fa;
}
#sidebar {
  position: fixed;
  width: 200px;
  height: 100%;
  background: #fff;
  color: #fff;
  padding-top: 20px;
}
.submenu {
  display: none;
  padding-left: 20px;
}
.submenu.open {
  display: block;
}

#sidebar {
  position: fixed;
  width: 200px;
  height: 100%;
  background: #FFF; /* 设置侧边栏背景色 */
  color: #948F8F; /* 设置文字颜色 */
  padding-top: 20px;
  /* padding-left: 25px; */
}

ul {
  list-style: none; /* 移除默认的列表样式 */
  padding: 0;
}

li {
  padding: 10px 0;
}

a {
  text-decoration: none; /* 移除链接下划线 */
  color: inherit; /* 继承父元素文字颜色 */
  display: block;
  padding: 5px 10px; /* 设置菜单项的内边距 */
  transition: background-color 0.3s ease; /* 添加悬停效果的过渡动画 */
}

#sidebar a {
  text-decoration: none;
  color: #948F8F; /* 设置默认文字颜色 */
  display: block;
  padding: 8px 20px;
  transition: color 0.3s; /* 添加颜色过渡动画 */
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
/* Content Styles */
.content {
    margin-left: 200px;
    /* Same width as sidebar */
    padding: 20px;
}

.path {
    /* display: flex; */
    text-align: left;
    font-weight: bold;
    display: flex;
    align-items: center;
    font-family: "阿里巴巴普惠体";
}
.path .symbol {
    font-size: 32px;
    color: white;
    background-color: #FB5B1D;
    width: 48px;
    height: 48px;
    text-align: center;
    border-radius: 10px;
}
.path .company {
    padding-left: 10px;
    font-size: 32px;
}
.path .first-level {
    font-size: 26px;
}
.path .second-level {
    font-size: 20px;
}

/* Search and Filter Box */
.search-filter-box,
.data-list-box {
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    padding: 10px;
    background: #f8f9fa;
    /* border: 1px solid #ccc; */
    margin-bottom: 10px;
}

.search-box {
    display: flex;
    align-items: center;
}

.search-box i {
    margin-right: 5px;
    color: #333;
}

.search-box input[type="text"] {
    /* border: none; */
    border-radius: 10px;
    border: 1px solid #DCDFE6;
    padding: 5px 10px;
    width: 100px;
    font-style: italic;
}
.search-position {
    display: flex;
    align-items: center;
    margin-left: 15px;
}
.search-position input[type="text"] {
    /* border: none; */
    border-radius: 10px;
    border: 1px solid #DCDFE6;
    padding: 5px 10px;
    width: 100px;
    font-style: italic;
}
.search-dept {
    display: flex;
    align-items: center;
    margin-left: 15px;
}
.search-dept input[type="text"] {
    /* border: none; */
    border-radius: 10px;
    border: 1px solid #DCDFE6;
    padding: 5px 10px;
    width: 100px;
    font-style: italic;
}
.search-tel {
    display: flex;
    align-items: center;
    margin-left: 15px;
}
.search-tel input[type="text"] {
    /* border: none; */
    border-radius: 10px;
    border: 1px solid #DCDFE6;
    padding: 5px 10px;
    width: 100px;
    font-style: italic;
}

.btn-primary {
    padding: 5px 10px;
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
    margin-right: 10px;
}

/* Data List Box */
.data-list-box {
    display: flex;
    height: 50px;
    justify-content: space-between;
    align-items: center;
    /* border: 1px solid #ccc; */
    padding: 5px;
}

.data-list-title {
    display: flex;
    align-items: center;
    padding-left: 5px;
}

.data-list-title .fa-list {
    margin-right: 12px;
}

#topbar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
}

.topbar-left {
  display: flex;
  /* margin-left: 250px; */
}



/* 设置顶部栏按钮的样式 */
.topbar-left .bnt1 {
    width: 102px;
    height: 30px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: rgba(52, 199, 88, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(52, 199, 88, 1); /* 文字颜色，不透明 */
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}
.topbar-left .bnt2 {
    width: 102px;
    height: 30px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: rgba(255, 58, 48, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(255, 58, 48, 1); /* 文字颜色，不透明 */
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}
.topbar-left .bnt3 {
    width: 102px;
    height: 30px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: rgba(175, 82, 222, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(175, 82, 222, 1); /* 文字颜色，不透明 */
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}
.topbar-left .bnt4 {
    width: 102px;
    height: 30px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: rgba(87, 86, 215, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(87, 86, 215, 1); /* 文字颜色，不透明 */
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}

.topbar-left img {
  margin-right: 5px; /* 图标与文字之间的右侧间距 */
  width: 25px;
  height: 25px;
  /* margin-top: 5px; */
}

.btn-secondary {
    width: 152px;
    height: 35px;
    font-size: 15px;
    padding: 5px 10px;
    background-color: #FB682F;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}

/* Separator Style */
.separator {
    height: 1px;
    background-color: #ccc;
    margin-top: 10px;
    /* Spacing above the separator */
    margin-bottom: 10px;
    /* Spacing below the separator */
}

/* Table Styles */
table {
    width: 100%;
    border-collapse: separate; /* 改变表格的边框合并方式 */
    border-spacing: 0; /* 设置单元格间距为0 */
    margin-top: 10px;
    background-color: #FFFFFF;
    border-radius: 20px;
    /* Spacing above the table */
}

table,
th,
td {
    /* border: 1px solid #ccc; */
    border: 0; /* 移除所有边框 */
    font-size: 15px;
    text-align: center;
}

th {
    /* background-color: #0f6096ed; */
    color: #101010;
    font-size: 16px;
    padding: 10px;
    border-bottom: 1px solid #ccc; /* 保留表头下方的横线 */
}

td {
    padding: 10px;
    border-bottom: 1px solid #ccc; /* 保留每行下方的横线 */
}

/* 复选框样式 */
input[type="checkbox"] {
    margin: 0; /* 移除默认的外边距 */
    padding: 0; /* 移除外边距 */
    height: 16px; /* 设置复选框的大小 */
    width: 16px; /* 设置复选框的大小 */
    vertical-align: middle; /* 垂直居中对齐 */
}

/* 全选复选框样式 */
.select-all {
    margin-right: 10px; /* 添加一些右边距 */
}

/* 行选择复选框样式 */
.row-selector {
    padding-left: 10px; /* 添加一些左边距，用于对齐文本 */
}

/* tr:nth-child(even) {
    background-color: #f2f2f2;
} */

/* Button Styles */
.button-container {
    display: flex;
    justify-content: space-between;
    padding: 10px;
}
.button-container .assign_dept {
    /* padding: 5px 10px; */
    padding: 3% 5%;
    background-color: rgba(52, 199, 88, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(52, 199, 88, 1); /* 文字颜色，不透明 */
    border-radius: 20px;
    border: none;
    cursor: pointer;
}

.button-container .edit_button {
    /* padding: 5px 10px; */
    padding: 3% 10%;
    background-color: rgba(0, 122, 255, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(0, 122, 255, 1); /* 文字颜色，不透明 */
    border-radius: 20px;
    border: none;
    cursor: pointer;
}

.button-container .delete_button {
    /* padding: 5px 10px; */
    padding: 3% 10%;
    background-color: rgba(255, 58, 48, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(255, 58, 48, 1); /* 文字颜色，不透明 */
    border-radius: 20px;
    border: none;
    cursor: pointer;
}

.modal-background {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fefefe;
    padding: 20px;
    border-radius: 5px;
    z-index: 10000;
    width: 400px;
    height: 230px;
    opacity: 0;
    /* 初始透明度为0 */
    transition: opacity 0.3s ease;
    /* 设置渐变动画 */
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
}

.modal-content {
    padding: 20px;
    position: relative; /* 添加此行 */
}

.add_title {
    line-height: 20px;
    font-size: 18px;
    color: #101010;
    position: absolute; /* 添加此行 */
    top: 0; /* 添加此行 */
    left: 20px; /* 调整左边距 */
}

.emailname {
    text-align: center; /* 让输入框水平居中 */
    margin-top: 40px; /* 调整间距 */
    position: relative; /* 添加此行 */
}
.email-container{
    text-align: left;
    padding: 0 20%;
}

.emailinput {
    width: 200px; /* 设置输入框宽度 */
    border-radius: 10px;
    height: 20px;
    border: none;
    background-color: rgba(187, 187, 187, 0.22); /* 使用 RGBA 表示颜色和不透明度 */
    color: #888888;
    font-size: 10px;
}

.confirmbutton {
    text-align: center; /* 按钮水平居中 */
    margin-top: 20px; /* 调整间距 */
}
.confirm {
    width: 130px;
    height: 32px;
    background-color: #FF6200;
    color: white;
    border: 2px solid #FF6200;
    border-radius: 10px;
    cursor: pointer;
}
/* 编辑窗口 */
.edit-modal-background {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.edit-modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fefefe;
    padding: 20px;
    border-radius: 5px;
    z-index: 10000;
    width: 400px;
    height: 230px;
    opacity: 0;
    /* 初始透明度为0 */
    transition: opacity 0.3s ease;
    /* 设置渐变动画 */
}

.edit-close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
}

.edit-modal-content {
    padding: 20px;
    position: relative; /* 添加此行 */
}

.edit_title {
    line-height: 20px;
    font-size: 18px;
    color: #101010;
    position: absolute; /* 添加此行 */
    top: 0; /* 添加此行 */
    left: 20px; /* 调整左边距 */
}

.edit-position {
    text-align: center; /* 让输入框水平居中 */
    margin-top: 40px; /* 调整间距 */
    position: relative; /* 添加此行 */
}

.edit-name-input {
    width: 200px; /* 设置输入框宽度 */
    border-radius: 10px;
    height: 20px;
    border: none;
    background-color: rgba(187, 187, 187, 0.22); /* 使用 RGBA 表示颜色和不透明度 */
    color: #888888;
    font-size: 10px;
}

.edit-confirmbutton {
    text-align: center; /* 按钮水平居中 */
    margin-top: 50px; /* 调整间距 */
}
.edit-confirm {
    width: 130px;
    height: 32px;
    background-color: #FF6200;
    color: white;
    border: 2px solid #FF6200;
    border-radius: 10px;
    cursor: pointer;
}

/* 删除窗口 */
.del-modal-background {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.del-modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fefefe;
    padding: 20px;
    border-radius: 5px;
    z-index: 10000;
    width: 400px;
    height: 230px;
    opacity: 0;
    /* 初始透明度为0 */
    transition: opacity 0.3s ease;
    /* 设置渐变动画 */
}

.del-close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
}

.del-modal-content {
    padding: 20px;
    position: relative; /* 添加此行 */
}

.del_title {
    line-height: 20px;
    font-size: 18px;
    color: #101010;
    position: absolute; /* 添加此行 */
    top: 0; /* 添加此行 */
    left: 20px; /* 调整左边距 */
}

.del-name {
    text-align: center; /* 让输入框水平居中 */
    margin-top: 40px; /* 调整间距 */
    position: relative; /* 添加此行 */
}

.del-confirmbutton {
    text-align: center; /* 按钮水平居中 */
    margin-top: 50px; /* 调整间距 */
}
.del-confirm {
    width: 130px;
    height: 32px;
    background-color: #FF6200;
    color: white;
    border: 2px solid #FF6200;
    border-radius: 10px;
    cursor: pointer;
}
</style>