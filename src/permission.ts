//用来做路由鉴权，项目中的路由什么条件能被访问，什么时候不能被访问
import router from '@/router'

//全局前置守卫
router.beforeEach((to: any, from: any, next: any) => {
    console.log(123)
})

//全局后置守卫
router.afterEach((to, from) => {

})