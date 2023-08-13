//SPU管理模块的接口
import request from "@/utils/request";
import type { HasSpuResponseData, AllTrademark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData,SpuData } from "./type";
enum API {
    //获取已有的SPU的数据
    HASSPU_URL = "/admin/product/",
    //获取全部品牌的数据
    ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    //获取某一个spu下的全部的售卖商品的图片数据
    IMAGE_URL = '/admin/product/spuImageList/',
    //获取某一个spu下的全部已有的销售属性接口地址
    SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    //获取整个项目全部的销售属性【颜色、版本、尺码】
    ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
    //追加一个新的spu
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    //修改一个已有的spu
    UPDATESPU_URL = '/admin/product/updateSpuInfo',
}
//获取某一个三级分类下分类已有是SPU数据
export const reqHasSpu = (page: number, limit: number, category3Id: string | number) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
//获取全部apu品牌的数据
export const reqAllTrademark = () => request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)
//获取某一个已有的spu下的全部商品的图片地址
export const reqSpuImageList = (spuId: number) => request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
//获取某一个已有的spu拥有多少个销售属性
export const reqSpuHasSaleAttr = (spuId: number) => request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)
//获取全部的销售属性
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
//添加一个新的spu
//更新已有的spu接口
//data:即为新增的spu获取已有的spu对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
    //如果spu有id,则是更新已有spu,新增spu不需要id
    if (data.id) {
        //更新spu
        return request.post<any, any>(API.UPDATESPU_URL, data)
    } else {
        //添加spu
        return request.post<any, any>(API.ADDSPU_URL, data)
    }
}