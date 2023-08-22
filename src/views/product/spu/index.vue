<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu">添加SPU</el-button>
        <el-button mb-2 @click="toggle" type="primary">Switch Language</el-button>
        <!-- 展示已有的SPU数据 -->
        <el-config-provider :locale="locale">
          <el-table style="margin: 10px 0" border :data="records">
            <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
            <el-table-column label="SPU名称" prop="spuName"></el-table-column>
            <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
            <el-table-column label="SPU操作">
              <!-- row为已有的SPU对象 -->
              <template #default="{ row }">
                <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
                <el-button type="primary" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
                <el-button type="primary" size="small" icon="View" title="查看SKU列表" @click="findSku(row)"></el-button>
                <el-popconfirm :title="`你确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
                  <template #reference>
                    <el-button type="primary" size="small" icon="Delete" title="删除SKU"></el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getHasSpu" @size-change="changeSize" />
        </el-config-provider>

      </div>
      <!-- 添加spu以及修改spu的子组件 -->
      <SpuForm ref="spuForm" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
      <!-- 添加sku的子组件 -->
      <SkuForm ref="skuForm" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
      <!-- dialog对话框：展示已有的sku数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片" prop="weight">
            <template #default="{ row }">
              <img :src="row.skuDefaultImg" :alt="row.skuName" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type {
  HasSpuResponseData,
  Records,
  SkuInfoData,
  SkuData,
} from "@/api/product/spu/type";
import { ref, watch, onBeforeUnmount, computed } from "vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from "@/api/product/spu";
import type { SpuData } from "@/api/product/spu/type";
import { ElMessage } from "element-plus";
//引入相应的子组件
import SpuForm from "./SpuForm.vue";
import SkuForm from "./SkuForm.vue";
//引入分类的仓库
import useCategoryStore from "@/store/modules/category";
let categoryStore = useCategoryStore();
//场景的数据
let scene = ref<number>(0); //0:显示已有的spu 1:添加或者已有的spu 2:添加sku的结构
//分页器默认页码
let pageNo = ref<number>(1);
//每一页展示几条数据
let pageSize = ref<number>(3);
//定义一个数组，存储已有的SPU三级分类下的数据
let records = ref<Records>([]);
//存储已有的SPU的总个数
let total = ref<number>(0);
//获取子组件实例SpuForm
let spuForm = ref<any>();
//获取子组件实例SkuForm
let skuForm = ref<any>();
//存储全部的sku数据
let skuArr = ref<SkuData[]>([]);
//控制dialog对话框的显示与隐藏
let show = ref<boolean>(false);

//监听三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    //务必保证有三级分类id发请求
    if (!categoryStore.c3Id) return;
    getHasSpu();
  },
);

//此方法执行，可以获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager: number = 1) => {
  pageNo.value = pager;
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  );
  if (result.code == 200) {
    records.value = result.data.records;
    total.value = result.data.total;
  }
};
//分页器的下拉菜单发送变化的时候触发
const changeSize = () => {
  getHasSpu();
};
//添加新的spu的按钮回调
const addSpu = () => {
  //切换为场景1：添加与修改已有spu结构-->SpuForm
  scene.value = 1;
  //点击添加spu按钮，调用子组件的方法，初始化数组
  spuForm.value.initAddSpu(categoryStore.c3Id);
};

//子组件SpuForm绑定的自定义事件：目前是让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
  //子组件SpuForm点击取消变为场景0：展示已有的SPU
  scene.value = obj.flag;
  if (obj.params == "update") {
    //发起请求，再次获取全部已有是spu 如果更新就留在当前页
    getHasSpu(pageNo.value);
  } else {
    //否则是添加留在第一页
    getHasSpu();
  }
};
//修改已有SPU按钮的回调
const updateSpu = (row: SpuData) => {
  scene.value = 1; //切换SpuForm结构
  //调用子组件的实例方法获取完整已有SPU的数据
  spuForm.value.initHasSpuData(row);
};
//添加sku按钮回调
const addSku = (row: SpuData) => {
  //点击添加sku按钮，切换为场景为2
  scene.value = 2;
  //调用子组件的方法初始化添加sku的数据
  skuForm.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
};
//查看sku列表数据
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id);
  if (result.code == 200) {
    skuArr.value = result.data;
    show.value = true;
  }
};
//删除已有spu按钮的回调
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu(row.id);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    //获取剩余已有的spu
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
//切换语言的按钮回调
const toggle = () => {
  language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
}
//路由组件销毁的时候，清空仓库的数据
onBeforeUnmount(() => {
  categoryStore.$reset();
});
</script>
<script lang="ts">
export default {
  name: "Spu",
};
</script>

<style scoped lang="scss"></style>
