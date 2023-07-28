<template>
  <!-- <p>{{ menuList }}</p> -->
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
        <el-icon>
          <!-- 加载element-plus图标 -->
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但是子路由只有一个 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden" @click="goRoute">
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但是子路由个数大于一个 -->
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 递归组件 -->
      <MenuSelf :menuList="item.children"></MenuSelf>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
//获取父组件传递过来的全部路由数组
defineProps(["menuList"]);
//获取路由器对象
const $router = useRouter()
//点击菜单的回调
const goRoute = (vc: any) => {
  $router.push(vc.index)
}
</script>

<script lang="ts">
export default {
  name: 'MenuSelf'
}
</script>
<style lang="scss" scoped></style>
