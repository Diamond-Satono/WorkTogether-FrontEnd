// JavaScript 用来控制侧边栏的折叠和展开
const submenus = document.querySelectorAll('.submenu');

submenus.forEach(submenu => {
  submenu.parentElement.querySelector('a').addEventListener('click', function(e) {
    e.preventDefault();
    submenu.classList.toggle('open');
    
    // 存储展开状态到 localStorage
    const sidebarState = submenu.classList.contains('open') ? 'expanded' : 'collapsed';
    localStorage.setItem(submenu.parentElement.id, sidebarState); // 使用菜单项的ID作为键
  });
});

// 页面加载时恢复侧边栏的展开状态
window.onload = function() {
  const submenus = document.querySelectorAll('.submenu');
  submenus.forEach(submenu => {
    const sidebarState = localStorage.getItem(submenu.parentElement.id);
    if (sidebarState === 'expanded') {
      submenu.classList.add('open');
    }
  });
};
