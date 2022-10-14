
export default [
  // 登录
  {
    path: '/adlogin',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/', redirect: '/login' },
      { path: '/adlogin', component: './User/login' },
      // { path: '/user/register', component: './User/Register' },
    ],
  },
   // 用户登录
   {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/', redirect: '/login' },
      { path: '/login', component: './User/UserLogin' },
    ],
  },
   // 使用手册
   {
    path: '/manual/user_manual',
    name: 'user_manual',
    component:'./ManualPDF/index',
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // 系统首页
      { path: '/', redirect: '/customer/management/index' },
      
      {
        path: '/customer/management/index',
        name: 'customerlist',
        icon: 'user',
        component: './Customerlist',
        routes: [
          {
            path: '/',
            redirect: '/customer/management/index'
          },
          {
            path: '/customer/management/index',
            name: 'customer_list',
            icon: 'home',
            level: '1',
            hideInMenu: true,
            component: './Customerlist',
          },
          {
            path: '/customer/management/index/columnar_details',
            name: 'columnar_details',
            component:'./Customerlist/detailsList'
          },
          
        ]
      },
      //    账户管理
      {
        path: '/user/management/index',
        name: 'AccountManagement',
        icon: 'user',
        component: './Account/account',
      },
      // 角色管理
      // {
      //   path: '/role/management/index',
      //   name: 'account',
      //   icon: 'setting',
      //   component: './UserRole/userRole',
      // },
      {
        path: '/role/management/index',
        name: 'commission',
        icon: 'setting',
        component: './Commission/commission',
      },
      // 个人信息
      {
        path: '/current_userInfo/userInfo',
        name: 'userInfo',
        component:'./UserInfo/userInfo',
      },
      
      // 没有权限、404
      {
        path: '/exception',
        name: '404',
        hideInMenu: true,
        routes: [
          {
            path: '/exception/404',
            name: '404',
            component: './Exception/404',
          },
        ],
      },
    ],
  },
 
];
