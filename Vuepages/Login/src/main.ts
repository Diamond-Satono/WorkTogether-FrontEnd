import './assets/main.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Register2 from './components/Register2.vue'
import Register3 from './components/Register3.vue'
import Register3Create from './components/Register3Create.vue'
import Register3Join from './components/Register3Join.vue'
import RegisterSuccess from './components/RegisterSuccess.vue'
import App from './App.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login',name:'Login', component: Login },
        { path: '/register',name:'Register', component: Register },
        { path: '/register2',name:'Register2', component: Register2 },
        { path: '/register3',name:'Register3', component: Register3 },
        { path: '/register3create',name:'Register3Create', component: Register3Create },
        { path: '/register3join',name:'Register3Join', component: Register3Join },
        { path: '/registersuccess',name:'RegisterSuccess', component: RegisterSuccess },
        { path: '/', redirect: '/login' } 
    ]
})
const app = createApp(App);
app.use(router);
app.mount('#app');
