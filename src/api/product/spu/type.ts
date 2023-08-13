//服务器全部接口返回的数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
//SPU数据的ts类型
export interface SpuData {
    id?: number,
    spuName?: string,
    description?: string,
    category3Id?: string | number,
    tmId?: number | string,
    spuImageList?: null | SpuImg[],
    spuSaleAttrList?: null | SaleAttr[],
}
//数组：包含元素都是已有SPU数据类型
export type Records = SpuData[]
//定义获取已有的SPU接口返回的ts数据类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}

//所以品牌数据的ts类型
export interface Trademark {
    id: number,
    tmName: string,
    logoUrl: string,
    createTime?: string,
    updateTime?: string
}
//品牌接口返回的数据ts类型
export interface AllTrademark extends ResponseData {
    data: Trademark[]
}
//商品图片的ts类型
export interface SpuImg {
    id?: number,
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    imgName?: string,
    imgUrl?: string
    name?:string,
    url?:string
}
//已有的spu的照片墙数据的类型
export interface SpuHasImg extends ResponseData {
    data: SpuImg[]
}
//已有的销售属性值对象ts类型
export interface SaleAttrValue {
    id?: number,
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    baseSaleAttrId: number|string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: null
}

//存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]
//销售属性对象的ts类型
export interface SaleAttr {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number|string,
    saleAttrName: string,
    spuSaleAttrValueList: SpuSaleAttrValueList,
    flag?:boolean,
    saleAttrValue?:string
}
//spu已有的销售属性接口返回的数据的ts类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}
//已有的全部spu的返回数据的ts类型
export interface HasSaleAttr {
    id: number,
    name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
}