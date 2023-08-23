<template>
    <div class="box6">
        <div class="title">
            <p>热门景区排行</p>
            <img src="../../images/dataScreen-title.png" alt="景区排行">
        </div>
        <!-- 图形图表容器 -->
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let charts = ref<any>()
onMounted(() => {
    //一个容器可以展示多种类型的图形图标
    let myCharts = echarts.init(charts.value)
    myCharts.setOption({
        title: {
            text: '景区排行',
            //点击标题进行页面跳转
            link: 'https://www.baidu.com',
            //调整标题位置
            left: '40%',
            //主标题文字样式
            textStyle: {
                color: 'yellowgreen',
                fontSize: 20,
            },
            //子标题
            subtext: '各大景区排行',
            //子标题的样式
            subtextStyle: {
                color: 'yellowgreen',
                fontSize: 16
            }

        },
        xAxis: {
            type: 'category',//代表图形图表x轴上均匀分布展示
        },
        yAxis: {},
        //布局
        grid: {
            left: 20,
            bottom: 20,
            right: 20,
        },
        // series:系列决定图形图表是哪一种的一个对象则表示展示一个，一个数组有多个对象则是展示多个图形图表
        series: [
            //柱状图
            {
                type: 'bar', data: [10, 20, 30, 40, 50, 33, 66],
                //柱状图：图形上的文本标签
                label: {
                    show: true,
                    position: 'top',
                    color: 'yellowgreen',

                },
                //是否显示背景颜色
                showBackground: true,
                backgroundStyle: {
                    // color:'#ccc',
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 0,
                        colorStops: [
                            { offset: 0, color: 'black' },
                            { offset: 1, color: 'blue' },
                        ],
                        global: false
                    },
                    //底部背景颜色

                },
                //柱条的样式
                itemStyle: {
                    borderRadius: [10, 10, 0, 0],
                    //柱条颜色
                    color: function (data) {
                        //给每一个柱条设置背景颜色
                        let arr: string[] = ['red', 'orange', 'yellowgreen', 'green', 'purple', 'pink', 'hotpink']
                        return arr[data.dataIndex]
                    }
                }
            },
            //折线图
            {
                type: 'line',
                data: [10, 20, 30, 40, 60, 90]
            }

        ],
        //提示框
        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.7)'
        }
    })
})
</script>
<script lang="ts">
export default {
    name: 'Rank'
}
</script>

<style scoped lang="scss">
.box6 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0;

    .title {
        margin-left: 5px;

        p {
            color: white;
            font-size: 20px;
        }
    }

    .charts {
        height: calc(100% - 30px);
    }

}
</style>