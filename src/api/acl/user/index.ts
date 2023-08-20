//用户管理模块的接口
import request from "@/utils/request";
import type {
  UserResponseData,
  AllRoleResponseData,
  SetRoleData,
} from "./type";
//枚举地址
enum API {
  //获取全部已有用户账号信息
  ALLUSER_URL = "/admin/acl/user/",
  //新增管理用户
  ADDUSER_URL = "/admin/acl/user/save",
  //更新已有的用户的账号信息
  UPDATEUSER_URL = "/admin/acl/user/update",
  //获取全部职位以及当前账号拥有的职位接口
  ALLROLE_URL = "/admin/acl/user/toAssign/",
  //给已有的用户分配角色的接口
  SETROLE_URL = "/admin/acl/user/doAssignRole",
  //删除某一个账号接口
  DELETEUSER_URL = "/admin/acl/user/remove/",
  //批量删除账号的接口
  DELETEALLUSER_URL = "/admin/acl/user/batchRemove",
}
//获取用户账号信息的接口
export const reqUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(
    API.ALLUSER_URL + `${page}/${limit}/?username=${username}`,
  );
//添加与更新已有用户的接口
export const reqAddOrUpdateUser = (data: any) => {
  //携带的参数有id就是更新，没有就是新增
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data);
  } else {
    return request.post<any.any>(API.ADDUSER_URL, data);
  }
};
//获取全部职位以及当前用户账号拥有的职位接口方法
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId);
//分配职位
export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data);
//删除某一个账号的接口
export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + userId);
//批量删除账号的接口
export const reqBatchRemoveUser = (idList: number[]) =>
  request.delete(API.DELETEALLUSER_URL, { data: idList });
