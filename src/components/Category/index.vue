<template>
  <!-- 属性管理中的三级分类全局组件 -->
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <!-- label：即为展示数据 value:即为select下拉菜单收集的数据 -->
        <el-select v-model="categoryStore.c1Id">
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select>
          <el-option label="北京"></el-option>
          <el-option label="上海"></el-option>
          <el-option label="广州"></el-option>
          <el-option label="深圳"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select>
          <el-option label="北京"></el-option>
          <el-option label="上海"></el-option>
          <el-option label="广州"></el-option>
          <el-option label="深圳"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
//引入分类相关的仓库
import useCategory from "@/store/modules/category";
const categoryStore = useCategory();
console.log(categoryStore, "@@");

//通知仓库获取一级分类的方法
const getC1 = () => {
  //通知分类相关仓库发请求获取一级分类的数据
  categoryStore.getC1();
};
onMounted(() => {
  //全局组件挂载完毕，通知仓库发请求获取一级分类的数据
  getC1();
});
</script>
<script lang="ts">
export default {
  name: "GlobalCategory",
};
</script>

<style scoped></style>
