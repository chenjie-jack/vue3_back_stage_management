<template>
  <div class="box">
    <div class="top clearfix">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量<span>99999人</span></p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 下面的盒子来echarts展示图形图标的节点 -->
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
//水球图拓展插件
import "echarts-liquidfill";
console.log(echarts);
let people = ref<string>("215908人");

//获取DOM节点
let charts = ref<any>();
onMounted(() => {
  //获取echarts类的实例
  let myCharts = echarts.init(charts.value);
  //设置实例的配置项
  myCharts.setOption({
    //标题组件
    title: {
      text: "水球图",
    },
    //x轴||y轴组件
    xAxis: {},
    yAxis: {},
    //系列：决定你展示什么样的图形图标
    series: {
      // type: 'pie',
      // type:'bar',
      // data: [10, 20, 30, 40]
      type: "liquidFill",
      data: [0.6, 0.4, 0.2],
      waveAnimation: true,
      animationDuration: 3,
      animationDurationUpdate: 2,
      radius: "100%",
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: "skyblue",
          borderColor: "#294D99",
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: "rgba(0, 0, 0, 0.25)",
        },
      },
    },
    //布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  });
});
</script>

<style scoped lang="scss">
@import "../../../../styles/clearfloat.scss";

.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    margin-left: 20px;

    .title {
      color: white;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }

    .right {
      float: right;
      color: white;
      font-size: 20px;

      span {
        color: yellowgreen;
      }
    }
  }

  .number {
    margin-top: 30px;
    display: flex;
    padding: 10px;

    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png);
      background-size: 100% 100%;
      color: #29fcff;
    }
  }

  .charts {
    width: 100%;
    height: 250px;
  }
}
</style>
