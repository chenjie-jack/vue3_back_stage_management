<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu :collapse="LayoutSettingStore.fold ? true : false" background-color="#001529" text-color="#fff"
          active-text-color="yellowgreen" :default-active="$route.path">
          <!-- 动态生成 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: LayoutSettingStore.fold ? true : false }">
      <!-- layout组件的顶部导航Tarbar -->
      <Tabbar></Tabbar>
    </div>
    <!-- 主要内容展示区 -->
    <div class="layout_main" :class="{ fold: LayoutSettingStore.fold ? true : false }">
      <Main></Main>
    </div>
  </div>
</template>
<script setup lang="ts">
//获取User相关的小仓库
import useUserStore from "@/store/modules/user";
//获取路由对象
import { useRoute } from "vue-router";
//引入左侧菜单的logo子组件
import Logo from "./logo/index.vue";
//引入菜单组件
import Menu from "./menu/index.vue";
//引入右侧主要内容展示区域
import Main from './main/index.vue'

//引入顶部barbar组件
import Tabbar from './tabbar/index.vue'

//引入SettingStore小仓库
import useLayoutSettingStore from '@/store/modules/setting'

const $route = useRoute()
const userStore = useUserStore();
const LayoutSettingStore = useLayoutSettingStore()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>
<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    color: white;
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0;
    left: $base-menu-width;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
      transition: all 0.3s;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background-color: #fff;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
      transition: all 0.3s;
    }
  }
}
</style>
