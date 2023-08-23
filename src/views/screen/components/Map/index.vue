<template>
    <div class="box4" ref="map"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
//引入中国地图的数据
import chinaJSON from "./china.json";
let map = ref<any>();
//注册中国地图
echarts.registerMap("china", chinaJSON);
onMounted(() => {
    //初始化
    let myCharts = echarts.init(map.value);
    myCharts.setOption({
        geo: {
            map: "china",
            roam: true, //鼠标缩放
            //地图的位置调试
            left: 50,
            // zoom: 2, //缩放
            top: 100,
            right: 50,
            bottom: 50,
            label: {
                show: true,
                // rotate:20, 文字旋转
                color: "white", //文字颜色
                fontSize: 14,
            },
            itemStyle: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: "red" },
                        { offset: 1, color: "blue" },
                    ],
                    global: false, //缺省为false
                },
                opacity: 0.8,
            },
            //地图的高亮的效果
            emphasis: {
                itemStyle: {
                    color: 'red',
                },
                label: {
                    fontSize: 40
                }
            }
        },
        //布局位置
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        },
        series: [
            {
                type: 'lines',//航线系列
                data: [
                    {
                        coords: [
                            [116.405285, 39.904989], //起点
                            [119.306239, 26.075302],//终点
                        ],
                        //统一的样式设置
                        lineStyle: {
                            color: 'orange',
                            width: 5
                        },
                    },
                    {
                        coords: [
                            [116.405285,39.904989], //起点
                            [87.617733,43.792818],//终点
                        ],
                        //统一的样式设置
                        lineStyle: {
                            color: 'orange',
                            width: 5
                        },
                    },
                    {
                        coords: [
                            [116.405285,39.904989], //起点
                            [115.892151,28.676493],//终点
                        ],
                        //统一的样式设置
                        lineStyle: {
                            color: 'orange',
                            width: 5
                        },
                    }
                ],
                //是否显示特效
                effect: {
                    show: true,
                    symbol: 'arrow',
                    color: 'red',
                    symbolSize: 10
                }
            }
        ]
    });
});
</script>
<script lang="ts">
export default {
    name: 'ChinaMap'
}
</script>

<style scoped lang="scss"></style>
