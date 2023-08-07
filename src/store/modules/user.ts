//创建用户相关的小仓库
import { defineStore } from "pinia";

//引入登录请求的接口
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";

//引入数据类型
import type {
  LoginFormData,
  LoginResponseData,
  UserInfoResponseData,
} from "@/api/user/type";
import type { UserState } from "./types/types";

//引入操作本地存储的工具ff
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/utils/token";

//引入路由(常量路由)
import { constantRoute } from "@/router/routes";

//创建用户小仓库
const useUserStore = defineStore("User", {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      // token: localStorage.getItem('TOKEN'),//用户唯一标识
      token: GET_TOKEN(), //用户唯一标识token
      menuRoutes: constantRoute, //仓库存储生成菜单需要的数组(路由)
      username: "",
      avatar: "",
    };
  },
  //处理异步和逻辑的地方
  actions: {
    //处理用户登录的方法
    async userLogin(data: LoginFormData) {
      const result: LoginResponseData = await reqLogin(data);
      if (result.code == 200) {
        //pinia仓库存储一下token
        this.token = result.data as string; //类型断言 保证result.data.token是字符串型
        //本地存储持久化存储一份
        // localStorage.setItem('TOKEN', result.data.token)
        SET_TOKEN(result.data);
        //保证当前async函数返回一个成功的promise
        return "ok";
      } else {
        return Promise.reject(new Error(result.data));
      }
    },
    //获取用户信息的方法
    async userInfo() {
      //获取用户信息存储在仓库中(用户头像。名字)
      const result: UserInfoResponseData = await reqUserInfo();
      //如果获取用户信息成功，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    //退出登录
    async userLogout() {
      const result: any = await reqLogout();
      if (result.code == 200) {
        //目前没有mock接口:退出登录接口(跳通知服务器本地用户唯一标识失效)
        this.token = "";
        this.username = "";
        this.avatar = "";
        REMOVE_TOKEN();
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
  },
  //计算属性
  getters: {},
});

//对外暴露获取小仓库的方法
export default useUserStore;
