<template>
  <div class="box5">
    <div class="title">
      <p>未来七天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="line"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
let line = ref<any>();

onMounted(() => {
  let myCharts = echarts.init(line.value);
  myCharts.setOption({
    title: {
      text: "访问量",
    },
    xAxis: {
      type: "category",
      //x轴两边不留白
      boundaryGap: false,
    },
    yAxis: {},
    grid: {
      top: 0,
      left: 40,
      bottom: 20,
      right: 0,
    },
    series: [
      {
        type: "line",
        data: [0, 120, 240, 66, 99, 321, 890, 1200],
        //平滑曲线的设置
        smooth: true,
        //区域填充样式
        areaStyle: {
          color: "blue", //也支持渐变
        },
      },
    ],
  });
});
</script>
<script lang="ts">
export default {
  name: "BrokenLine",
};
</script>

<style scoped lang="scss">
.box5 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;

  .title {
    margin-left: 10px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>
