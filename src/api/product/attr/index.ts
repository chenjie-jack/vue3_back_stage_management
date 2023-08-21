//这里是书写属性管理相关的api
import request from "@/utils/request";

import type { CategoryResponseData, AttrResponseData, Attr } from "./type";
//属性管理模块的接口地址
enum API {
  C1_URL = "/admin/product/getCategory1",
  C2_URL = "/admin/product/getCategory2/",
  C3_URL = "/admin/product/getCategory3/",
  //获取分类下已有的属性和属性值的接口地址
  ATTR_URL = "/admin/product/attrInfoList/",
  //添加或者修改已有属性的接口
  ADDORUPDATE_URL = "/admin/product/saveAttrInfo",
  //删除某个已有属性属性值的接口
  DELETEATTR_URL = "/admin/product/deleteAttr/",
}

//获取一级分类的接口方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL);
//获取二级分类是接口方法
export const reqC2 = (category1Id: number | string) =>
  request.get<any,CategoryResponseData>(API.C2_URL + `${category1Id}`);
//获取三级分类的接口方法
export const reqC3 = (category2Id: number) =>
  request.get<any,CategoryResponseData>(API.C3_URL + `${category2Id}`);
//获取对应分类下的已有的属性和属性值的接口方法
export const reqAttr = (
  category1Id: string | number,
  category2Id: string | number,
  category3Id: string | number,
) =>
  request.get<any,AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  );
//新增属性或者修改已有属性的接口方法
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATE_URL, data);
//删除某一个已有是属性接口的方法
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + `${attrId}`);
