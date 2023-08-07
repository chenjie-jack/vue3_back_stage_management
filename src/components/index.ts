//引入项目在全部的全局组件
import SvgIcon from "./SvgIcon/index.vue";
import Pagination from "./Pagination/index.vue";
import Category from "./Category/index.vue";
//引入element-plus提供的全部图标组件
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

//全局对象
const allGlobalComponent: any = { SvgIcon, Pagination, Category };

//对外暴露插件对象
export default {
  install(app) {
    //注册项目全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(key, allGlobalComponent[key]);
    });
    //将element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
