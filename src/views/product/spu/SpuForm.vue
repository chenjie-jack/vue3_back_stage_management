<template label-width="100px">
  <el-form>
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="spuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="spuParams.tmId">
        <el-option
          v-for="item in allTrademark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入SPU的描述"
        v-model="spuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- v-model:file-list:展示的图片列表数组
                action:上传图片的接口地址
             -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
      >
        <!-- 展示销售属性的下拉菜单 -->
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        :disabled="saleAttrIdAndValueName ? false : true"
        icon="Plus"
        style="margin-left: 10px"
        type="primary"
        size="default"
        @click="addSaleAttr"
        >添加销售属性</el-button
      >
      <!-- table展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名称"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row：当前spu已有的销售属性对象 -->
          <template #default="{ row, index }">
            <el-tag
              style="margin: 0 5px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              v-for="item in row.spuSaleAttrValueList"
              :key="item.id"
              class="mx-1"
              closable
              >{{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag == true"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Plus"
              @click="toEdit(row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="{ row, $index }">
            <el-button
              type="primary"
              :key="row"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="default"
        @click="save"
        :disabled="saleAttr.length > 0 ? false : true"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {
  reqAllTrademark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from "@/api/product/spu";
import type {
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  SpuData,
  AllTrademark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SaleAttrValue,
} from "@/api/product/spu/type";
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
let $emit = defineEmits(["changeScene"]);
//子组件点击取消按钮：通知父组件切换场景为1，展示有的SPU数据
const cancel = () => {
  $emit("changeScene", { flag: 0, params: "update" });
};
//存储已有的spu这些数据
let allTrademark = ref<Trademark[]>([]);
//商品图片
let imgList = ref<SpuImg[]>();
//已有的spu销售属性
let saleAttr = ref<SaleAttr[]>([]);
//所以的销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]);
//控制照片强的对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);
//存储预览图片的地址
let dialogImageUrl = ref<string>("");
//存储已有的spu对象
let spuParams = ref<SpuData>({
  category3Id: "", //收集的三级分类的id
  spuName: "", //收集新增或者修改spu的名字
  description: "", //spu描述
  tmId: "", //品牌的id
  spuImageList: [],
  spuSaleAttrList: [],
});
//将来收集还未选择的销售属性的id与属性值名字
let saleAttrIdAndValueName = ref<string>("");
//子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  //存储已有的spu对象，将来再模板中展示,修改spu
  spuParams.value = spu;
  //spu是父组件传递过来的已有的spu对象(不完整)
  //获取全部品牌的数据
  let result: AllTrademark = await reqAllTrademark();
  //获取某一个品牌旗下全部售卖商品的图片
  let result1: SpuHasImg = await reqSpuImageList(spu.id);
  //获取已有的spu销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id);
  //获取整个项目全部spu的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
  //存储全部品牌的数据
  allTrademark.value = result.data;
  //spu对应的商品图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    };
  });
  //存储已有的spu的销售属性
  saleAttr.value = result2.data;
  //全部的销售属性
  allSaleAttr.value = result3.data;
};
//照片墙点击预览的时候会触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
//照片强删除文件钩子
const handleRemove = () => {};
//照片墙上传成功之前钩子(约束文件的大小与类型)
const handlerUpload = (file: any) => {
  if (
    file.type == "image/png" ||
    file.type == "image/jpeg" ||
    file.type == "image/gif"
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "文件大小要小于3M",
      });
    }
  } else {
    ElMessage({
      type: "error",
      message: "文件的类型只能为png、jpeg、gif格式",
    });
    return false;
  }
};
//计算出当前spu还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  //全部销售属性：颜色、版本、尺码
  //已有的销售属性：颜色、版本
  let unSelectAttr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName;
    });
  });
  return unSelectAttr;
});
//添加销售属性的回调方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] =
    saleAttrIdAndValueName.value.split(":");
  //准备一个新的的销售属性对象，将来带给服务器即可
  let newSaleAttr: any = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  };
  //追加到数组当中
  saleAttr.value.push(newSaleAttr);
  //清空收集的数据
  saleAttrIdAndValueName.value = "";
};
//添加属性值按钮的回调
const toEdit = (row: SaleAttr) => {
  row.flag = true;
  row.saleAttrValue = "";
};

//表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  //整理收集的属性的id和属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row;
  //整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue,
  };
  //非法情况判断
  if (saleAttrValue.trim() == "") {
    ElMessage({
      type: "error",
      message: "属性值不能为空",
    });
    return;
  }
  //判断属性值是否再数组中已有存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue;
  });
  if (repeat) {
    ElMessage({
      type: "error",
      message: "属性值重复",
    });
    return;
  }
  //追加新的销售属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue);
  //切换为查看模式，对应的button会展示
  row.flag = false;
};
//保存按钮的回调
const save = async () => {
  //整理参数
  //1.照片墙的数据
  spuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, //图片名字
      imgUrl: (item.response && item.response.data) || item.url,
    };
  });
  //2.整理销售属性的数据
  spuParams.value.spuSaleAttrList = saleAttr.value;
  //发请求：添加spu|更新已有的spu
  let result = await reqAddOrUpdateSpu(spuParams.value as SpuData);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: spuParams.value.id ? "更新成功" : "添加成功",
    });
    //成功后通知父组件切换场景为0
    $emit("changeScene", {
      flag: 0,
      params: spuParams.value.id ? "update" : "add",
    });
  } else {
    ElMessage({
      type: "error",
      message: spuParams.value.id ? "更新失败" : "添加失败",
    });
  }
};
//添加一个新的spu初始化请求的方法
const initAddSpu = async (c3Id: number | string) => {
  //清空数据
  Object.assign(spuParams.value, {
    category3Id: "",
    spuName: "",
    description: "",
    tmId: "",
    spuImageList: [],
    spuSaleAttrList: [],
  });
  //清空照片墙
  imgList.value = [];
  saleAttr.value = [];
  saleAttrIdAndValueName.value = "";
  //存储三级分类对应的id
  spuParams.value.category3Id = c3Id;
  //获取全部品牌的数据
  let result: AllTrademark = await reqAllTrademark();
  //获取所有的销售属性
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr();
  allTrademark.value = result.data;
  allSaleAttr.value = result1.data;
};
defineExpose({
  initHasSpuData,
  initAddSpu,
});
</script>
<script lang="ts">
export default {
  name: "SpuForm",
};
</script>

<style scoped lang="scss"></style>
