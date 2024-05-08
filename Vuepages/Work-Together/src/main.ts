import './assets/main.css'
import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login/Login.vue'
import Register from './components/Login/Register.vue'
import Register2 from './components/Login/Register2.vue'
import Register3 from './components/Login/Register3.vue'
import Register3Create from './components/Login/Register3Create.vue'
import Register3Join from './components/Login/Register3Join.vue'
import RegisterSuccess from './components/Login/RegisterSuccess.vue'
import RetrievePassword from './components/Login/RetrievePassword.vue'
import MemberList from './components/MemberList.vue'
import EnterpriseInfo from './components/enterprise/EnterpriseInfo.vue'
import DepartmentManage from './components/organization/DepartmentManage.vue'
import DepartmentExcel from './components/organization/DepartmentExcel.vue'
import GroupManage from './components/group/GroupManage.vue'
import GroupExcel from './components/group/GroupExcel.vue'
import HomePage from './components/HomePage.vue'
import BatchDelete from './components/organization/deptPop-upWindows/BatchDelete.vue'
import CreateDept from './components/organization/deptPop-upWindows/CreateDept.vue'
import BatchDepart from './components/organization/deptUser-upWindows/BatchDepart.vue'
import AddMember from './components/organization/deptUser-upWindows/AddMember.vue'
import MemberDetail from './components/organization/deptUser-upWindows/MemberDetail.vue'
import CreateSubDept from './components/organization/deptPop-upWindows/CreateSubDept.vue'
import DeptDetail from './components/organization/deptPop-upWindows/DeptDetail.vue'
import MoveDept from './components/organization/deptPop-upWindows/MoveDept.vue'
import DeleteDept from './components/organization/deptPop-upWindows/DeleteDept.vue'
import AssignDept from './components/organization/deptUser-upWindows/AssignDept.vue'
import DeleteMember from './components/organization/deptUser-upWindows/DeleteMember.vue'
import AddGroupMember from './components/group/groupUser-upWindows/AddGroupMember.vue'
import BatchGroupDepart from './components/group/groupUser-upWindows/BatchGroupDepart.vue'
import DeleteGroupMember from './components/group/groupUser-upWindows/DeleteGroupMember.vue'
import AssignGroup from './components/group/groupUser-upWindows/AssignGroup.vue'
import GroupMemberDetail from './components/group/groupUser-upWindows/GroupMemberDetail.vue'
import BatchDeleteGroup from './components/group/groupPop-upWindows/BatchDeleteGroup.vue'
import CreateGroup from './components/group/groupPop-upWindows/CreateGroup.vue'
import DeleteGroup from './components/group/groupPop-upWindows/DeleteGroup.vue'
import GroupDetail from './components/group/groupPop-upWindows/GroupDetail.vue'
import App from './App.vue'


library.add(fas);

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'Login', component: Login },
        { path: '/register', name: 'Register', component: Register },
        { path: '/register2', name: 'Register2', component: Register2 },
        { path: '/register3', name: 'Register3', component: Register3 },
        { path: '/register3create', name: 'Register3Create', component: Register3Create },
        { path: '/register3join', name: 'Register3Join', component: Register3Join },
        { path: '/registersuccess', name: 'RegisterSuccess', component: RegisterSuccess },
        { path: '/retrievepassword', name: 'RetrievePassword', component: RetrievePassword },
        { path: '/memberlist', name: 'MemberList', component: MemberList },
        { path: '/enterpriseinfo', name: 'EnterpriseInfo', component: EnterpriseInfo },
        { path: '/departmentmanage', name: 'DepartmentManage', component: DepartmentManage },
        { path: '/departmentexcel', name: 'DepartmentExcel', component: DepartmentExcel },
        { path: '/groupmanage', name: 'GroupManage', component: GroupManage },
        { path: '/groupexcel', name: 'GroupExcel', component: GroupExcel },
        { path: '/homepage', name: 'HomePage', component: HomePage },
        { path: '/', redirect: '/login' }
    ]
})
const app = createApp(App);
app.use(router);
app.component('fa', FontAwesomeIcon);
app.component("BatchDelete", BatchDelete);
app.component("CreateDept", CreateDept);
app.component("BatchDepart", BatchDepart);
app.component("AddMember", AddMember);
app.component("DeptDetail",DeptDetail);
app.component("CreateSubDept", CreateSubDept);
app.component('MoveDept',MoveDept);
app.component('DeleteDept',DeleteDept);
app.component('MemberDetail',MemberDetail);
app.component('AssignDept',AssignDept);
app.component('DeleteMember',DeleteMember);
app.component('AddGroupMember',AddGroupMember);
app.component('BatchGroupDepart',BatchGroupDepart);
app.component('DeleteGroupMember',DeleteGroupMember);
app.component('AssignGroup',AssignGroup);
app.component('GroupMemberDetail',GroupMemberDetail);
app.component('BatchDeleteGroup',BatchDeleteGroup);
app.component('CreateGroup',CreateGroup);
app.component('DeleteGroup',DeleteGroup);
app.component('GroupDetail',GroupDetail);
app.mount('#app');
