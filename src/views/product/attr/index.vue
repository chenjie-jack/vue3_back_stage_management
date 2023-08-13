<template>
  <div>
    <!-- 属性管理中的三级分类全局组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr">添加属性</el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" align="center" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #default="{ row }">
              <el-tag style="margin: 5px" v-for="item in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作" width="120px" align="center">
            <!-- row代表已有属性对象 -->
            <template #default="{ row }">
              <!-- 修改已有属性的按钮 -->
              <el-button type="primary" size="small" icon="Edit" @click="editAttr(row)"></el-button>
              <!-- 删除已有属性的按钮 -->
              <el-popconfirm :title="`你确实删除属性${row.attrName}?`" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button size="small" type="warning" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" icon="Plus" type="primary" size="default"
          :disabled="attrParams.attrName ? false : true">添加属性值</el-button>
        <el-button type="warning" size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0" :data="attrParams.attrValueList">
          <el-table-column width="80px" type="index" align="center" label="序号"></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row是当前的属性值对象 -->
            <template #default="{ row, $index }">
              <el-input :ref="(vc: any) => inputArr[$index] = vc" size="small" v-if="row.flag" @blur="toLook(row, $index)"
                placeholder="请你输入属性名" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #default="{ row, $index }">
              <el-button type="primary" size="small" @click="attrParams.attrValueList.splice($index, 1)" icon="Delete">
                {{ row.valueName }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
        <el-button type="warning" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick,onBeforeUnmount } from "vue";
//引入获取已有属性与属性值的接口方法
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from "@/api/product/attr";
import type { AttrResponseData, Attr, AttrValue } from "@/api/product/attr/type";
import useCategoryStore from "@/store/modules/category";
import { ElMessage } from "element-plus";
const categoryStore = useCategoryStore();
//存储已有的属性管理模块下的已有的属性与属性值
let attrArr = ref<Attr[]>([]);
//定义card卡片组件内容切换变量
let scene = ref<number>(0)  //scene值0 显示table 1则展示添加属性(禁用分类下拉菜单)
//定义一个响应式数据控制编辑模式还是查看模式
//收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: "", //新增属性的名称
  categoryId: "",//三级分类的ID
  categoryLevel: 3,//3级分类
  attrValueList: [], //新增的属性值数组
})
//准备一个数组，将来存储对应的组件实例el-input
let inputArr = ref<any>([])
//监听三级分类是id变化
watch(
  () => categoryStore.c3Id,
  () => {
    //清空上次查询的属性与属性值
    attrArr.value = [];
    //保证三级分类有才能去发请求
    if (!categoryStore.c3Id) return;
    getAttr();
  }
);
//获取已有的属性与属性值的方法
const getAttr = async () => {
  //解构除三个分类是id,获取分类是id
  const { c1Id, c2Id, c3Id } = categoryStore;
  //获取分类下的已有是属性和属性值
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
  if (result.code == 200) {
    attrArr.value = result.data;
  }
};
//添加属性按钮的回调
const addAttr = () => {
  //每次点击的时候先清空数据再收集数据
  Object.assign(attrParams, {
    attrName: "", //新增属性的名称
    attrValueList: [], //新增的属性值数组
    categoryId: categoryStore.c3Id,//三级分类的ID
    categoryLevel: 3,//3级分类
  })
  //切换为添加与修改属性的结构
  scene.value = 1
  //收集新增的属性的三级分类的id
  attrParams.categoryId = categoryStore.c3Id

}
//编辑属性按钮的回调
const editAttr = (row: Attr) => {
  //切换为添加与修改属性的结构
  scene.value = 1
  //将已有的属性对象赋值给attrParams对象即可 深拷贝
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
//取消按钮的回调
const cancel = () => {
  scene.value = 0
}
//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性值按钮的时候，向数组push一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值编辑模式与切换模式的切换
  })
  //添加属性值，获取最后的el-input让它聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
//保存按钮的回调
const save = async () => {
  //发请求，保存新增属性
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    //切换场景
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    //添加成功再次获取所有已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }
}
//输入属性值后按enter
const toLook = (row: AttrValue, $index: number) => {
  //非法情况1判断
  if (row.valueName.trim() == '') {
    //删除对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  //非法情况2判断 属性值重复
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return
  }
  row.flag = false
}
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  //nextTick：响应式数据发送变化，获取更新后的DOM(组件实例)
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

//当input框发生变化的时候调用下面函数 element当前组件实例 :ref="handler"
// const handler = (element) => {
//   console.log(123, element)
// }
//删除某一个属性的回调
const deleteAttr = async (attrId: number) => {
  //发相应删除已有属性的请求
  let result: any = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    //获取剩下的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
//路由组件销毁的时候，把仓库相关的数据清空
onBeforeUnmount(()=>{
  //清空分类仓库的所以数据
  categoryStore.$reset()
})
</script>
<script lang="ts">
export default {
  name: "Attr",
};
</script>

<style scoped lang="scss"></style>
