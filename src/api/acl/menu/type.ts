//菜单管理模块相关的ts类型
export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}
//菜单数据与按钮数据的ts类型
export interface Permission {
  id?: number;
  createTime: string;
  updateTime: string;
  pid: number;
  name: string;
  code: null;
  toCode: null;
  type: number;
  status: null;
  level: number;
  children?: PermissionList;
  select: boolean;
}
export type PermissionList = Permission[];
//获取全部菜单与按钮的标识数据接口返沪的数据ts类型
export interface PermissionResponseData extends ResponseData {
  data: PermissionList;
}

//添加与修改菜单携带的参数类型
export interface MenuParams {
  code: string;
  id?: number;
  level: number;
  name: string; //菜单名字
  pid: number; //已有菜单的id
}
