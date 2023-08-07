<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefresh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
  />
  <!-- 退出登录 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
//获取骨架的小仓库
import useLayoutSettingStore from "@/store/modules/setting";
//获取用户相关的小仓库
import useUserStore from "@/store/modules/user";
const layoutSettingStore = useLayoutSettingStore();
const userStore = useUserStore();
const $router = useRouter();
const $route = useRoute();

//刷新按钮的回调
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh;
};
//全屏按钮的回调
const fullScreen = () => {
  //DOM对象的属性：如果全屏返回true 不是全屏null
  if (!document.fullscreenElement) {
    //文档根节点的方法documentElement，实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //退出全屏模式
    document.exitFullscreen();
  }
};
//退出登录点击回调
const logout = async () => {
  //第一：需要向服务器请求【退出登录接口】
  //第二：仓库当中关于用户相关的数据清空
  //第三：跳转到登录页面
  await userStore.userLogout();
  $router.push({ path: "/login", query: { redirect: $route.path } });
};
</script>

<script lang="ts">
export default {
  name: "Setting",
};
</script>

<style scoped></style>
