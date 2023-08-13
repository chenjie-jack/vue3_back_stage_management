<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input
        placeholder="请输入SKU名称"
        v-model="skuParams.skuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(g)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select>
            <el-option
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item
          :label="item.saleArrName"
          v-for="item in saleArr"
          :key="item.id"
        >
          <el-select>
            <el-option
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :label="saleAttrValue.saleAttrValueName"
              :key="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" size="small">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button size="default" type="primary">保存</el-button>
      <el-button size="default" type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
//引入请求api
import { reqAttr } from "@/api/product/attr";
import { reqSpuImageList, reqSpuHasSaleAttr } from "@/api/product/spu";
import { ref, reactive } from "vue";
import type { SkuData } from "@/api/product/spu/type";
//平台属性
let attrArr = ref<any>([]);
//销售属性
let saleArr = ref<any>([]);
//照片强的数据
let imgArr = ref<any>([]);
//搜集sku的参数
let skuParams = reactive<SkuData>({
  category3Id: "",
  spuId: "",
  tmId: "",
  //v-model收集
  skuName: "",
  price: "",
  weight: "",
  skuDesc: "",
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: "",
});
//自定义事件的方法
let $emit = defineEmits(["changeScene"]);
//取消按钮的回调
const cancel = () => {
  $emit("changeScene", { flag: 0, params: "" });
};
//当亲子组件的方法对外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  //收集数据
  skuParams.category3Id = spu.category3Id;
  skuParams.spuId = spu.id;
  skuParams.tmId = spu.tmId;
  //获取平台属性
  let result = await reqAttr(c1Id, c2Id, spu.category3Id);
  //获取对应的销售属性
  let result1: any = await reqSpuHasSaleAttr(spu.id);
  //获取照片墙的数据
  let result2: any = await reqSpuImageList(spu.id);
  attrArr.value = result.data;
  saleArr.value = result1.data;
  imgArr.value = result2.data;
};
//对外暴露的方法
defineExpose({
  initSkuData,
});
</script>
<script lang="ts">
export default {
  name: "SkuForm",
};
</script>

<style scoped></style>
