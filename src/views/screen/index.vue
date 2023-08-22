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
        <div class="center">中间</div>
        <div class="right">右侧</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//引入顶部的子组件
import Top from './components/Top/index.vue'
//引入左侧三个子组件
import Tourist from './components/Tourist/index.vue'
import Sex from './components/Sex/index.vue'
import Age from './components/Age/index.vue'

//获取数据大屏展示内容盒子的DOM元素
let screen = ref<any>()
onMounted(() => {
  console.log(screen.value)
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
//定义大屏的缩放发比例
const getScale = (w: number = 1920, h: number = 1080) => {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}
//监听视口的变化
window.onreset = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

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
          background-color: pink;
        }
      }

      .center {
        flex: 2;
      }
    }
  }
}</style>
