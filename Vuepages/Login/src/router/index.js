import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/register2',
    name: 'Register2',
    component: Register2
  },
  {
    path: '/register3',
    name: 'Register3',
    component: Register3
  },
  {
    path: '/register3create',
    name: 'Register3Create',
    component: Register3Create
  },
  {
    path: '/register3join',
    name: 'Register3Join',
    component: Register3Join
  },
  {
    path: '/registersuccess',
    name: 'RegisterSuccess',
    component: RegisterSuccess
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



export default { router };
