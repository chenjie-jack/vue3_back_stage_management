<template>
    <!-- 顶部左侧静态 -->
    <el-icon style="margin-right: 10px;" @click="changeIcon" class="icon">
        <!-- <component></component>可动态的加载渲染某个组件 -->
        <component :is="LayoutSettingStore.fold ? 'Fold':'Expand'"></component>
    </el-icon>
    <!-- 左侧的面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
        <!-- 面包屑动态展示路由名字与标题 -->
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
            <!-- 面包屑图标 -->
            <el-icon>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <!-- 面包屑展示匹配路由的标题 -->
            <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import useLayoutSettingStore from '@/store/modules/setting'

const LayoutSettingStore = useLayoutSettingStore()

//点击图标方法
const changeIcon = () => {
    LayoutSettingStore.fold = !LayoutSettingStore.fold
}
const $route = useRoute()

</script>

<script lang="ts">
export default {
    name: 'Breadcrumb'
}
</script>

<style scoped lang="scss">
.icon {
    cursor: pointer;
}
</style>