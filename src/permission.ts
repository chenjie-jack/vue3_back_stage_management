//用来做路由鉴权，项目中的路由什么条件能被访问，什么时候不能被访问
import router from '@/router'
//引入进度条插件nprogress
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
import setting from './setting'
//获取用户相关的仓库内部的token数据，去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
const userStore = useUserStore(pinia)

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    document.title = `${setting.title} - ${to.meta.title}`
    nprogress.start()
    const token = userStore.token
    const username = userStore.username
    if (token) {
        //有token，用户登录成功
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            if (username) {
                //有用户信息放行
                next()
            } else {
                try {
                    await userStore.userInfo();  //获取用户信息
                    next()
                } catch (error) {
                    //token过期：获取不到用户信息 或者用户手动修改了本地token
                    //退出登录：用户相关的信息数据清空
                    await userStore.userLogout()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }

        }
    } else {
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})

//全局后置守卫
router.afterEach((to, from) => {
    // console.log(to,from)
    nprogress.done()
})