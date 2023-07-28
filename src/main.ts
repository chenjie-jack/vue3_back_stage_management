/*
 * @Author: chenjie 3232581941@qq.com
 * @Date: 2023-07-23 12:01:45
 * @LastEditors: chenjie 3232581941@qq.com
 * @LastEditTime: 2023-07-25 00:05:16
 * @FilePath: \vue3_admin_template\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from "vue";
import App from "@/App.vue";

//引入模板的全局样式
import "@/styles/index.scss";

//引入element-plus插件与样式
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

//svg插件需要的配置代码
import "virtual:svg-icons-register";

//引入自定义插件对象：注册整个项目的全局组件
import globalComponent from "@/components/index";

//配置element-plus国际化配置 中文
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

//引入路由进行注册
import router from "./router/index";

//引入仓库
import pinia from "./store";

//获取应用实例对象
const app = createApp(App);

//安装使用element-plus插件
app.use(ElementPlus, {
  locale: zhCn, //element-plus国际化配置
});

//安装使用自定义插件
app.use(globalComponent);

//安装仓库
app.use(pinia);
//注册模板路由
app.use(router);
//引入路由鉴权文件
import './permission'

//将应用挂载到挂载点上
app.mount("#app");
