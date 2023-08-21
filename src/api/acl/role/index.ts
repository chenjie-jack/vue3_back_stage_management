//角色管理模块相关的接口
import request from "@/utils/request";
import type {
  RoleResponseData,
  RoleData,
  MenuResponseData,
  PermissionResponseData,
  RemoveResponseData,
} from "./type";
//枚举地址
enum API {
  //获取全部的职位接口
  ALLROLE_URL = "/admin/acl/role/",
  //新增一个角色(职位)的接口
  ADDROLE_URL = "/admin/acl/role/save",
  //更新已有的职位
  UPDATEROLE_URL = "/admin/acl/role/update",
  //获取全部菜单与按钮的数据，根据角色的id获取对应的菜单
  ALLPERMISSION_URL = "/admin/acl/permission/toAssign/",
  //给相应的职位分配权限
  SETPERMISSION_URL = "/admin/acl/permission/doAssign/?",
  //根据职位的id删除已有职位(角色)
  REMOVEROLE_URL = "/admin/acl/role/remove/",
}
//获取全部角色
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  );
//添加职位与更新已有职位的接口
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data);
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data);
  }
};
//获取全部菜单与按钮权限数据
export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId);
//给相应的职位下发权限
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, PermissionResponseData>(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  );
//删除已有的职位
export const reqRemoveRole = (roleId: number) =>
  request.delete<any, RemoveResponseData>(API.REMOVEROLE_URL + roleId);
