//小仓库：layout组件相关配置的仓库
import { defineStore } from "pinia";
const useLayoutSettingStore = defineStore("SettingStore", {
  state: () => {
    return {
      fold: false, //用于控制菜单折叠还是收起的控制
      refresh: false, //仓库这个属性用于控制刷新效果 false代表不重置
    };
  },
});
export default useLayoutSettingStore;
