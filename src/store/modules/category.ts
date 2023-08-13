//属性管理模块的商品分类全局组件的小仓库
import { defineStore } from "pinia";
import { reqC1, reqC2, reqC3 } from "@/api/product/attr";
import type { CategoryResponseData } from "@/api/product/attr/type";
import type { CategoryState } from "./types/types";
const useCategoryStore = defineStore("Category", {
  state: (): CategoryState => {
    return {
      //存储一级分类的数据
      c1Arr: [],
      //存储一级分类的id
      c1Id: "",
      //存储对应一级分类下的二级数据
      c2Arr: [],
      c2Id: "",
      c3Arr: [],
      c3Id: "",
    };
  },
  actions: {
    async getC1() {
      const result: CategoryResponseData = await reqC1();
      if (result.code == 200) {
        this.c1Arr = result.data;
      }
    },
    //获取二级分类的数据
    async getC2() {
      const result: CategoryResponseData = await reqC2(this.c1Id);
      if (result.code == 200) {
        this.c2Arr = result.data;
      }
    },
    async getC3() {
      const result: CategoryResponseData = await reqC3(this.c2Id);
      if (result.code == 200) {
        this.c3Arr = result.data;
      }
    },
  },
  getters: {},
});

export default useCategoryStore;
