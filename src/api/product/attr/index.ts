//这里是书写属性管理相关的api
import request from "@/utils/request";
//属性管理模块的接口地址
enum API {
  C1_URL = "/admin/product/getCategory1",
  C2_URL = "/admin/product/getCategory2/",
  C3_URL = "/admin/product/getCategory3/",
}

//获取一级分类的接口方法
export const reqC1 = () => request.get<any, any>(API.C1_URL);
//获取二级分类是接口方法
export const reqC2 = (category1Id: number) =>
  request.get<any, any>(API.C2_URL + category1Id);
//获取三级分类的接口方法
export const reqC3 = (category2Id: number) =>
  request.get<any, any>(API.C3_URL + category2Id);
