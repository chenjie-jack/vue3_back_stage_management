<template>
  <div class="container">
    <!-- 数据大屏内容展示区域 -->
    <div class="screen" ref="screen">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">
          <Map class="map"></Map>
          <BrokenLine class="line"></BrokenLine>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Count class="count"></Count>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
//引入顶部的子组件
import Top from "./components/Top/index.vue";
//引入左侧三个子组件
import Tourist from "./components/Tourist/index.vue";
import Sex from "./components/Sex/index.vue";
import Age from "./components/Age/index.vue";
//引入中间的两个子组件
import Map from "./components/Map/index.vue";
import BrokenLine from "./components/BrokenLine/index.vue";
//引入右侧三个子组件
import Rank from "./components/Rank/index.vue";
import Year from "./components/Year/index.vue";
import Count from "./components/Count/index.vue";

//获取数据大屏展示内容盒子的DOM元素
let screen = ref<any>();
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
});
//定义大屏的缩放发比例
const getScale = (w: number = 1920, h: number = 1080) => {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww < wh ? ww : wh;
};
//监听视口的变化
window.onreset = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
};
</script>
<script lang="ts">
export default {
  name: "Screen",
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  .screen {
    width: 1920px;
    height: 1080px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 40px;
        .rank {
          flex: 1.5;
        }
        .year {
          flex: 1;
        }
        .count {
          flex: 1;
        }
      }

      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;

        .tourist {
          flex: 1.2;
        }

        .sex {
          flex: 1;
        }

        .age {
          flex: 1;
        }
      }

      .center {
        flex: 1.5;
        display: flex;
        flex-direction: column;
        .map {
          flex: 3;
        }
        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>
