//属性管理模块的商品分类全局组件的小仓库
import { defineStore } from "pinia";
import { reqC1 } from "@/api/product/attr";
const useCategory = defineStore('Category', {
    state: () => {
        return {
            //存储一级分类的数据
            c1Arr: [],
            //存储一级分类的id
            c1Id:''

        }
    },
    actions: {
        async getC1() {
            const result: any = await reqC1()
            if (result.code == 200) {
                 this.c1Arr=result.data
            }
        }
    },
    getters: {

    }

})

export default useCategory