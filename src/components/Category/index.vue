<template>
  <!-- 属性管理中的三级分类全局组件 -->
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <!-- label：即为展示数据 value:即为select下拉菜单收集的数据 -->
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c1Id" @change="handler">
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c2Id" @change="handler1">
          <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c3Id">
          <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
//引入分类相关的仓库
import useCategoryStore from "@/store/modules/category";
const categoryStore = useCategoryStore();

//通知仓库获取一级分类的方法
const getC1 = () => {
  //通知分类相关仓库发请求获取一级分类的数据
  categoryStore.getC1();
};

//此方法是一级分类的change事件(选中值的时候会触发，保证一级分类的id有了后去发请求获取二级分类的数据)
const handler = () => {
  // 当一级分类的数据发生变化的时候，需要把二级三级的数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  //通知仓库获取二级分类的数据
  categoryStore.getC2()
}
//此方法为二级分类是change方法
const handler1 = () => {
  //当二级下拉菜单发生变化，清空3级的数据
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
//解释父组件传递过来的scene
defineProps(['scene'])
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
