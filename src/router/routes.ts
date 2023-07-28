import { RouteRecordRaw } from "vue-router";
//对外暴露配置的路由(常量路由)
export const constantRoute: Array<RouteRecordRaw> = [
  {
    //登录
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login", //命名路由
    meta: {
      title: "登录",  //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  false代表隐藏
      icon: "Promotion" //菜单文字左侧的图标，支持element-plue全部图标
    },
  },
  {
    //登录成功以后展示数据的路由
    path: "/",
    component: () => import("@/layout/index.vue"),
    name: "layout",
    meta: {
      title: "",
      hidden: false,
      icon: "HomeFilled"
    },
    redirect: '/home',
    children: [
      {
        path: "/home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          hidden: false,
          icon: "HomeFilled",
        },
      },
    ],
  },
  {
    //404
    path: "/404",
    component: () => import("@/views/404/index.vue"),
    name: "404",
    meta: {
      title: "404",
      hidden: true,
      icon: 'DocumentDelete'
    },
  },
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',
    meta: {
      hidden: false,
      title: '数据大屏',
      icon: 'Platform'
    }
  },
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    redirect:'/acl/user',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock',
    },
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/index.vue'),
        name: 'Acl',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User'
        }
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled'
        }
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Monitor'
        }
      }
    ]
  },
  {
    path: '/product',
    component:()=>import('@/layout/index.vue'),
    name:'Product',
    redirect:'/product/trademark',
    meta:{
      title:'商品管理',
      icon:'Goods',
      hidden:false
    },
    children:[
      {
        path:'/product/trademark',
        component:()=>import('@/views/product/trademark/index.vue'),
        name:'Trademark',
        meta:{
          title:'品牌管理',
          icon:'ShoppingCartFull',
        }
      },
      {
        path:'/product/attr',
        component:()=>import('@/views/product/attr/index.vue'),
        name:'Attr',
        meta:{
          title:'属性管理',
          icon:'ChromeFilled',
        }
      },
      {
        path:'/product/spu',
        component:()=>import('@/views/product/spu/index.vue'),
        name:'Spu',
        meta:{
          title:'SPU管理',
          icon:'Calendar',
        }
      },
      {
        path:'/product/aku',
        component:()=>import('@/views/product/aku/index.vue'),
        name:'Sku',
        meta:{
          title:'SKU管理',
          icon:'Orange',
        }
      },
    ]
  },
  {
    //任意路由，若路由没有匹配上则是匹配该路由
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    name: "Any",
    meta: {
      title: "任意路由",
      hidden: true,
      icon: 'DataLine'
    },
  },
];
