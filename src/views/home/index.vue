<template>
  <el-card>
    <div class="card">
      <img :src="userStore.avatar" alt="" class="avatar" />
      <div class="bottom">
        <h3 class="hello">{{ hello }}</h3>
        <p class="subtitle">硅谷甄选运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="background-image">
    <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
//引入用户相关的仓库。获取用户的头像和信息
import useUserStore from "@/store/modules/user";
import { getTime } from "@/utils/time";

//获取存储用户新的的仓库对象
let userStore = useUserStore();
//首页的hello提示
let hello = ref<string>(`${getTime()}好,${userStore.username}`);
</script>
<script lang="ts">
export default {
  name: "Home",
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .hello {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }
  }

  .subtitle {
    font-style: italic;
    color: skyblue;
  }
}
.background-image {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
