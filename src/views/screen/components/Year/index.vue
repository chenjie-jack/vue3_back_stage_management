<template>
  <div class="box7">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="景区排行" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted } from "vue";

let charts = ref<any>();
onMounted(() => {
  //一个容器可以展示多种类型的图形图标
  let myCharts = echarts.init(charts.value);
  myCharts.setOption({
    title: {
      text: '散点图',
      left: '40%',
      textStyle: {
        color: 'white'
      }
    },
    xAxis: {
      type: 'category', //均匀分布
      show: true
    },
    yAxis: {
      show: false
    },
    grid: {
      left: 20,
      top: 20,
      right: 0,
      bottom: 20
    },
    series: {
      type: 'scatter',
      data: [33, 88, 21, 9, 788, 234, 133, 234, 555, 333, 55, 67, 324, 543, 212],
      //标记的图形设置
      symbol: 'diamond',
      symbolSize: 16,
      //图文标签
      label: {
        show: true,
        position: 'top',
        color: 'red'
      },
      //散点图标记颜色
      itemStyle:{
        color:'cyan'
      }
    }

  });
});

</script>
<script lang="ts">
export default {
  name: "Year",
};
</script>

<style scoped lang="scss">
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;

  .title {
    p {
      color: white;
      font-size: 18px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }

}
</style>

