//统一管理项目中用户相关的接口
import request from "@/utils/request";
import type { loginForm, loginResponseData, userResponseData } from "./type"; //引入接口类型
//统一管理接口
enum API {
  LOGIN_URL = "/user/login",
  USERINFO_URL = "/user/info",
}
//对外暴露请求函数
//登录接口方法
//data是post请求的账号和密码
export const reqLogin = (data: loginForm) => {
  return request.post<any, loginResponseData>(API.LOGIN_URL, data);
};

//获取用户信息接口方法
export const reqUserInfo = () => {
  return request.get<any, userResponseData>(API.USERINFO_URL);
};
