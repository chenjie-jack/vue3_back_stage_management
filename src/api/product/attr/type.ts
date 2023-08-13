export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

export interface CategoryObj {
    id: number | string,
    category1Id?: number,
    category2Id?: number,
    name: string
}

//相应的分类接口返回的数据类型
export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}

//属性管理模块下的属性与属性值的ts类型
//已有属性值对象的ts类型
export interface AttrValue {
    id?: number,
    valueName: string,
    attrId?: number,
    flag?:boolean
}
//存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]
//属性对象
export interface Attr {
    id?: number,
    attrName: string,
    categoryId: number|string,
    categoryLevel: number,
    attrValueList:AttrValueList,
}
//存储没有属性对象的数组ts类型
export type AttrList = Attr[]
//属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
    data: Attr[],
}