<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark"
        >添加品牌</el-button
      >
      <!-- 表格组件，用于展示已有的平台数据 -->
      <el-table style="margin: 10px 0" border :data="trademarkArray">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称">
          <template #default="{ row }">
            <pre style="color: black; font-weight: bold">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #default="{ row }">
            <img
              :src="
                row.logoUrl.includes('http')
                  ? row.logoUrl
                  : 'http://' + row.logoUrl
              "
              style="width: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="editTrademark(row)"
              title="编辑"
            ></el-button>
            <el-popconfirm
              :title="`您确定删除已有的${row.tmName}？`"
              width="250px"
              icon="Delete"
              icon-color="red"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  size="small"
                  icon="Delete"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :small="false"
        :disabled="false"
        :background="true"
        layout="prev, pager, next, jumper,->,total, sizes"
        @current-change="getHasTrademark"
        @size-change="sizeChange"
        :page-count="9"
        :total="total"
      />
    </el-card>
    <!-- 添加品牌 弹出的对话框  v-model控制对话框显示与隐藏 title是设置对话框的标题-->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="请您输入品牌的名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽 -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel"
          >取消</el-button
        >
        <el-button type="primary" size="default" @click="confirm"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from "@/api/product/trademark";
import type {
  Records,
  TrademarkResponseData,
  Trademark,
} from "@/api/product/trademark/type";
import { ElMessage, ElNotification } from "element-plus";
import type { UploadProps } from "element-plus";
//当前页码
let pageNo = ref<number>(1);
//每一页展示多少条数据
let limit = ref<number>(3);
//存储已有品牌数据的总数
let total = ref<number>(0);
//存储已有品牌的数据
let trademarkArray = ref<Records>([]);
//对话框的相关数据
let dialogFormVisible = ref<boolean>(false);
//定义收集新增品牌数据
let trademarkParams = reactive<Trademark>({
  tmName: "",
  logoUrl: "",
});
//获取弹话框的表单formRef组件实例对象
let formRef = ref();
//获取已有品牌的接口封装成为一个函数，任何情况下获取数据，调用此函数即可
const getHasTrademark = async (pager: number = 1) => {
  //当前页码
  pageNo.value = pager;
  let result: TrademarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  );
  if (result.code == 200) {
    //存储已有品牌总个数
    total.value = result.data.total;
    trademarkArray.value = result.data.records;
  }
};
//组件挂载完毕发请求获取第一页 一页三个已有品牌的数据
onMounted(() => {
  getHasTrademark();
});

//分页器页面发生变化的时候会触发
//对于当前页面发生自定义事件，组件pagination父组件回传数据(当前的页码)
// const changePageNo = () => {
//     //当前页面发生变化的时候再次发请求获取已有品牌的数据展示
//     getHasTrademark();
// };

//当下拉菜单发生变化的时候会触发此函数
const sizeChange = () => {
  //当前每页的的数据量发生变化的时候，当前页面归1
  pageNo.value = 1;
  getHasTrademark();
  console.log(666);
};
//添加品牌的回调
const addTrademark = () => {
  dialogFormVisible.value = true;
  //清空收集的数据
  trademarkParams.tmName = "";
  trademarkParams.logoUrl = "";
  trademarkParams.id = 0;

  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  nextTick(() => {
    formRef.value.clearValidate("tmName");
    formRef.value.clearValidate("logoUrl");
  });
};
//编辑品牌的回调
const editTrademark = (row: Trademark) => {
  //每次进入之前把表单校验的错误信息进程清除
  nextTick(() => {
    formRef.value.clearValidate("tmName");
    formRef.value.clearValidate("logoUrl");
  });
  //row当前已有的品牌
  dialogFormVisible.value = true;
  //将trademarkParams对象和row对象合并
  Object.assign(trademarkParams, row);
};

const cancel = () => {
  //对话框隐藏
  dialogFormVisible.value = false;
};
const confirm = async () => {
  //点击确认，发请求之前，对整个表单进行校验
  //await修饰的函数返回成功的结果才会执行后面的代码
  try {
    await formRef.value.validate();
    let result = await reqAddOrUpdateTrademark(trademarkParams);
    //添加||修改已有品牌
    if (result.code == 200) {
      dialogFormVisible.value = false;
      ElMessage({
        type: "success",
        message: trademarkParams.id ? "修改成功" : "添加成功",
      });
      //再次发请求获取已有的全部的品牌数据
      // 修改就留在的当前页，添加就留在第一页
      getHasTrademark(trademarkParams.id ? pageNo.value : 1);
    } else {
      ElMessage({
        type: "error",
        message: trademarkParams.id ? "修改失败" : "添加失败",
      });
    }
  } catch (error) {
    ElNotification({
      type: "error",
      message: "请按要求上传品牌名称和品牌LOGO",
    });
  }
};
//上传图片组件-->上传图片之前触发的钩子
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  //该钩子是在图片上传重成功之前触发，约束上传文件的类型和大小
  if (
    rawFile.type == "image/png" ||
    rawFile.type == "image/jpeg" ||
    rawFile.type == "image/gif"
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传的文件大于4M",
      });
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传文件的格式务必png、jpeg、gif",
    });
    return false;
  }
};
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  //response：当前上传图片post请求服务器返回的数据
  trademarkParams.logoUrl = response.data;
  //图片上传成功，清楚对应的表单检验
  formRef.value.clearValidate("logoUrl");
};
//品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2 && rule.required) {
    callback();
  } else {
    //校验没有通过，返回错误的提示信息
    callback(new Error("品牌名称位数大于等于2位！"));
  }
};
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  if (value && rule.required) {
    callback();
  } else {
    callback(new Error("LOGO的图片务必上传"));
  }
};
//表单校验规则对象
const rules = {
  tmName: [
    //required:该字段是必要的
    //trigger：代表触发校验规则的时机[blur,change]
    { required: true, trigger: "blur", validator: validatorTmName },
  ],
  logoUrl: [{ required: true, trigger: "change", validator: validatorLogoUrl }],
};

//气泡确认框确定按钮的回调
const removeTrademark = async (id: number) => {
  //点击确定按钮发请求删除已有品牌的
  let result = await reqDeleteTrademark(id);
  if (result.code == 200) {
    //删除成功提示的信息
    ElMessage({
      type: "success",
      message: "删除品牌成功",
    });
    //删除成功后再次获取已有品牌的信息 删除的品牌数组长度大于1留在当前页面，否则跳往上一页
    getHasTrademark(
      trademarkArray.value.length > 1 ? pageNo.value : pageNo.value - 1,
    );
  } else {
    ElMessage({
      type: "error",
      message: "删除品牌失败",
    });
  }
};
</script>

<script lang="ts">
export default {
  name: "Trademark",
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
