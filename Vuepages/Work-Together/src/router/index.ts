// router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// 动态导入所有 Vue 组件
const views = import.meta.glob('../components/**/*.vue');

const dynamicRoutes: RouteRecordRaw[] = Object.entries(views).map(([path, defineComponent]) => {
  // 将文件路径转换为路由名称（删除文件扩展名并将 / 转换为 -）
  const match = path.match(/\/components\/(?:.*\/)?([^\/]+)\.vue$/);
  const name = match ? match[1] : '';
  const routePath = match ? '/' + match[1].toLowerCase() : '';


  // 创建路由配置
  return {
    path: routePath,
    component: defineComponent,
    name,
  };
});

// 手动定义的路由
const staticRoutes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: () => import('../components/Login/Login.vue') },
  // 添加其他手动路由...
  { path: '', redirect: '/login' }, // 将根路径重定向到默认页面
  { path: '/', redirect: '/login' },
];

// 合并动态路由和静态路由
const routes: RouteRecordRaw[] = [
  ...staticRoutes,
  ...dynamicRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
