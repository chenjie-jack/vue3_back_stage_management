<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录的表单 -->
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" :prefix-icon="User"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" :prefix-icon="Lock" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" size="default" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";

//引入获取当前时间的函数
import { getTime } from "@/utils/time";
//引入User相关的小仓库
import useUserStore from "@/store/modules/user";
const useStore = useUserStore();

//获取el-form组件
const loginForms = ref();

//获取路由器
const $router = useRouter();
const $route = useRoute()

//定义一个变量，控制按钮加载的效果
const loading = ref(false);

//收集账号和密码的数据
let loginForm = reactive({
  username: "admin",
  password: "111111",
});
//登录按钮的回调
const login = async () => {
  //保证全部表单校验通过再发请求
  await loginForms.value.validate();
  loading.value = true; //开始加载
  try {
    //登录成功
    await useStore.userLogin(loginForm);
    //编程式导航
    const redirect:any = $route.query.redirect
    $router.push({ path: redirect || '/' });
    ElNotification({
      type: "success",
      message: "欢迎回来",
      title: `hi,${getTime()}好`,
    });
    //登录成功加载效果也消失
    loading.value = false;
  } catch (error) {
    //登录失败，加载效果消失
    loading.value = false;
    ElNotification({
      type: "error",
      message: (error as Error).message,
    });
  }
};

//自定义校验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  //rule:校验规则对象
  //value:表单元素文本内容
  //callback:如果符合条件callback放行 不符合条件callback方法，注入错误提示信息
  ///^\d{5,10}$/.test(value) 正则表达式
  console.log(rule);
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error("账号长度至少五位"));
  }
};

const validatorPassword = (rule: any, value: any, callback: any) => {
  console.log(rule);
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error("密码长度至少六位"));
  }
};
//定义表单校验的配置对象
const rules = {
  username: [
    // { required: true, min: 5, max: 10, message: '账号的长度为6-10位', trigger: 'change' }
    { trigger: "change", validator: validatorUserName },
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码的长度至少6位', trigger: 'change' }
    { trigger: "change", validator: validatorPassword },
  ],
};
</script>
<script lang="ts">
export default {
  name: 'Login'
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
