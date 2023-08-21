export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,
}
//角色(职位)的数据类型
export interface RoleData {
    id?: number,
    createTime?: string,
    updateTime?: string,
    roleName?: string,
    remark?: unknown,
}

//全部职位的数组类型
export type Records = RoleData[]
//全部职位数据的相应的ts类型
export interface RoleResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        orders: []
        optimizeCountSql: boolean
        hitCount: boolean
        countId: null
        maxLimit: null
        searchCount: boolean
        pages: number
    }
}

//菜单与按钮数据的ts类型
export interface MenuData {
    id: number,
    createTime: string,
    updateTime: string,
    pid: number,
    name: string,
    code: string,
    toCode: string,
    type: number,
    status: null,
    level: number, //多重数组，代表几级
    children?: MenuList,
    select: boolean,
}

export type MenuList = MenuData[]
//菜单权限与按钮权限接口返回的ts类型
export interface MenuResponseData extends ResponseData {
    data: MenuList
}
//给相应的职位分配权限接口返回的ts类型
export interface PermissionResponseData {
    code: number,
    data: null,
    message: string,
    ok: boolean
}
//删除已有职位接口返回的ts类型
export interface RemoveResponseData{
    code:number,
    data:null,
    message:string,
    ok:boolean
}