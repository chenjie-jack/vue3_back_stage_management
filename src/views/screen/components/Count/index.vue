<template>
  <div class="box8">
    <div class="title">
      <p>数据统计</p>
      <img src="../../images/dataScreen-title.png" alt="景区排行" />
    </div>
    <!-- 图形图表容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted } from "vue";

let charts = ref<any>();
onMounted(() => {
  //一个容器可以展示多种类型的图形图标
  let myCharts: any = echarts.init(charts.value);
  let option: any = {
    title: {
      text: '游客消费统计',
      textStyle: {
        color: 'white'
      }
    },
    radar: {
      indicator: [
        { name: '消费', max: 6500 },
        { name: '好感度', max: 16000 },
        { name: '出行', max: 30000 },
        { name: '小吃', max: 38000 },
        { name: '爱好', max: 52000 },
        { name: '景点', max: 25000 },
      ]
    },
    series: [
      {
        name: '雷达图',
        type: 'radar',
        data: [
          { value: [4200, 3000, 20000, 35000, 50000, 18000], name: '购物' },
          { value: [5000, 3000, 20000, 35000, 50000, 18000], name: '吃饭' }
        ]
      }
    ]
  }
  myCharts.setOption(option);
});
</script>
<script lang="ts">
export default {
  name: "Count",
};
</script>

<style scoped  lang="scss">
.box8 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;

  .title {
    p {
      color: white;
      font-size: 18px;
    }
  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>
