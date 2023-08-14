//SKU模块接口管理
import request from "@/utils/request";
import type { SkuResponseData, SkuInfoData } from "./type";
//枚举地址
enum API {
  //获取已有的商品数据-SKU
  SKU_URL = "/admin/product/list/",
  //sku商品上架
  SALE_URL = "/admin/product/onSale/",
  //下架的接口地址
  CANCELSALE_URL = "/admin/product/cancelSale/",
  //获取sku商品详情的接口
  SKUINFO_URL = "/admin/product/getSkuInfo/",
}
//获取商品SKU的接口方法
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`);
//已有商品上架的请求
export const reqSaleSku = (skuId: number) =>
  request.get<any, any>(API.SALE_URL + skuId);
//下架的请求
export const reqCancelSale = (skuId: number) =>
  request.get<any.any>(API.CANCELSALE_URL + skuId);
//获取商品详情的接口
export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId);
