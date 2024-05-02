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
        { path: '/', redirect: '/login' }
    ]
})
const app = createApp(App);
app.use(router);
app.component('fa', FontAwesomeIcon);
app.mount('#app');
