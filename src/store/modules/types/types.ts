//RouteRecordRaw 路由对象数据类型
import type { RouteRecordRaw } from "vue-router";
//定义小仓库数据state类型
export interface UserState {
  token: string | null;
  menuRoutes: RouteRecordRaw[];
  username: string;
  avatar: string;
}
