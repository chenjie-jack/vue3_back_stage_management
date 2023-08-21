export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}
//定义sku对象的ts类型
export interface Attr {
  attrId: number | string;
  valueId: number | string;
  id?: number;
  valueName?: string;
}
export interface SaleAttr {
  saleAttrId: number | string;
  saleAttrValueId: number | string;
  id?: number;
  saleAttrValueName?: string;
}
//sku对应的ts类型
export interface SkuData {
  category3Id?: string | number;
  spuId?: string | number;
  tmId?: string | number;
  skuName?: string;
  price?: string | number;
  weight?: string | number;
  skuDesc?: string;
  skuAttrValueList?: Attr[];
  skuSaleAttrValueList?: SaleAttr[];
  skuDefaultImg?: string;
  isSale?: number; // 控制商品的上架还是下架状态
  id?: number;
  skuImageList?: any;
}

//获取sku接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[];
    total: number;
    size: number;
    current: number;
    orders: [];
    optimizeCountSql: boolean;
    hitCount: boolean;
    countId: null;
    maxLimit: null;
    searchCount: boolean;
    pages: number;
  };
}
//获取sku商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData;
}
