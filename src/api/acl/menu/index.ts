//菜单管理模块相关的接口
import request from "@/utils/request";
import type { PermissionResponseData, MenuParams } from "./type";
//枚举地址
enum API {
  //获取全部菜单与按钮的标识数据
  ALLPERMISSION_URL = "/admin/acl/permission",
  //给某一级新增子菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  //更新某一个已有的菜单
  UPDATEMENU_URL = '/admin/acl/permission/update',
  //删除已有的菜单
  DELETEMENU_URL = '/admin/acl/permission/remove/',
}
//获取菜单数据
export const reqAllPermission = () => request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL);
//更新或者添加菜单的方法
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}
//删除某一个已有的菜单
export const reqRemoveMenu = (menuId: number) => request.delete<any, any>(API.DELETEMENU_URL + menuId)