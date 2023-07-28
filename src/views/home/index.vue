<template>
  <div>
    <h1>我也是一级理由展示登录成功后的数据{{ userStore.username }}</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useUserStore from "@/store/modules/user";

const userStore =useUserStore()
onMounted(()=>{
  userStore.userInfo()
})
</script>
<script lang="ts">
export default {
  name:'Home'
}
</script>

<style lang="scss" scoped></style>
