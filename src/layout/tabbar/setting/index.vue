<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh" title="刷新"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen" title="全屏"></el-button>
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="click">
    <!-- 表单组件 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker @change="setColor" size="small" v-model="color" show-alpha :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch @change="changeDark" v-model="dark" active-icon="MoonNight" inactive-icon="Sunny" inline-prompt />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle title="设置"></el-button>
    </template>
  </el-popover>

  <img :src="userStore.avatar" style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%" />
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
import { ref } from 'vue'
import { useRouter, useRoute } from "vue-router";
//获取骨架的小仓库
import useLayoutSettingStore from "@/store/modules/setting";
//获取用户相关的小仓库
import useUserStore from "@/store/modules/user";
let layoutSettingStore = useLayoutSettingStore();
let userStore = useUserStore();
let $router = useRouter();
let $route = useRoute();
//收集开关的数据
let dark = ref<boolean>(false)

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
//switch开关的change事件
const changeDark = () => {
  //获取html根节点
  const html = document.documentElement
  //判断html标签是否有类名dark
  dark.value ? html.className = 'dark' : html.className = ''
}
//主题颜色的设置
const setColor=()=>{
  console.log(123)
  //通知修改根节点的样式对象的属性与属性值
  const html=document.documentElement
  html.style.setProperty('--el-color-primary',color.value)

}

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
</script>

<script lang="ts">
export default {
  name: "Setting",
};
</script>

<style scoped></style>
