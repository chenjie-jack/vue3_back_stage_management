<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请你输入搜索的职位关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="职位名称" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template #default="{ row }">
          <!-- row:代表一个职位对象 -->
          <el-button size="small" type="primary" icon="User" @click="setPermission(row)">分配权限</el-button>
          <el-button size="small" type="primary" icon="Edit" @click="editRole(row)">编辑</el-button>
          <el-popconfirm :title="`你确定删除${row.roleName}?`" width="260px" @confirm="deleteRole(row.id)">
            <template #reference>
              <el-button size="small" type="primary" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasRole"
      @size-change="sizeChange" />
  </el-card>
  <!-- 添加职位与更新已有职位的结构：对话框 -->
  <el-dialog v-model="dialogVisite" :title="roleParams.id ? '更新职位' : '添加职位'">
    <el-form :model="roleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请输入职位名称" v-model="roleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="dialogVisite = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 抽屉组件：分配职位的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
        :default-checked-keys="selectArray" :props="{ children: 'children', label: 'name' }" />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
//请求的方法
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
  reqRemoveRole,
} from "@/api/acl/role";
//接口相关的ts类型
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList,
  PermissionResponseData,
  RemoveResponseData,
} from "@/api/acl/role/type";
import { ElMessage } from "element-plus";
//引入骨架仓库
import useLayoutSettingStore from "@/store/modules/setting";
//获取仓库
let settingStore = useLayoutSettingStore();
//当前的页码 默认第一页
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(10);
//搜索职位关键字
let keyword = ref<string>("");
//存储所有已有的职位(角色)
let allRole = ref<Records>([]);
//职位的总个数
let total = ref<number>(0);
//控制对话框的显示与隐藏
let dialogVisite = ref<boolean>(false);
//获取form表单组件实例
let form = ref<any>();
//收集新增角色的数据
let roleParams = reactive<RoleData>({
  roleName: "",
});
//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([]);
//控制抽屉组件显示与隐藏
let drawer = ref<boolean>(false);
//准备一个数组，数组用来存储勾选节点的id(四级的) 存储四级select为true的id
let selectArray = ref<number[]>([]);
//获取tree组件实例
let tree = ref<any>();
//组件挂载完毕
onMounted(() => {
  //获取职位的请求
  getHasRole();
});
//获取全部用户职位的方法||分页器页码发送变化的回调
const getHasRole = async (pager: number = 1) => {
  pageNo.value = pager;
  let result: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  );
  if (result.code == 200) {
    total.value = result.data.total;
    allRole.value = result.data.records;
  }
};
//下拉菜单的回调
const sizeChange = () => {
  getHasRole();
};
//搜索按钮的回调
const search = () => {
  getHasRole();
  keyword.value = "";
};
//重置按钮的回调
const reset = () => {
  settingStore.refresh = !settingStore.refresh;
};
//添加职位按钮的回调
const addRole = () => {
  dialogVisite.value = true;
  //每次添加职位之前，清空添加职位输入框中的数据
  Object.assign(roleParams, {
    roleName: "",
    id: 0,
  });
  //清空上一次表单校验错误的结果
  nextTick(() => {
    form.value.clearValidate("roleName");
  });
};
//编辑按钮的回调，更新已有职位的按钮回调
const editRole = (row: RoleData) => {
  dialogVisite.value = true;
  //存储已有的职位---待遇ID的
  Object.assign(roleParams, row);
  nextTick(() => {
    form.value.clearValidate("roleName");
  });
};
//自定义校验规则的回调
const vaildatorRoleName = (rule: any, value: any, callback: any) => {
  if (rule.required && value.trim().length >= 2) {
    callback();
  } else {
    ElMessage({ type: "error", message: "职位名称至少两位" });
    callback(new Error("职位名称至少两位"));
  }
};
//职位相关的校验规则
const rules = {
  roleName: [{ required: true, trigger: "blur", validator: vaildatorRoleName }],
};
//确定按钮的回调
const save = async () => {
  //表单校验结果，结果通过则发请求，不通过则不发请求(下面则是会返回一个失败的promise对象，代码将不会执行)
  await form.value.validate();
  //更新职位的请求
  let result: any = await reqAddOrUpdateRole(roleParams);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: roleParams.id ? "更新成功" : "添加成功",
    });
    dialogVisite.value = false;
    getHasRole(roleParams.id ? pageNo.value : 1);
  } else {
    ElMessage({ type: "error", message: "添加失败" });
  }
};
//分配权限按钮的回调
const setPermission = async (row: RoleData) => {
  // row:代表一个职位对象
  drawer.value = true;
  // 收集当前要分类权限的职位的数据
  Object.assign(roleParams, row);
  //根据职位获取权限的数据
  let result: MenuResponseData = await reqAllMenuList(roleParams.id);
  if (result.code == 200) {
    menuArr.value = result.data;
    selectArray.value = filterSelectArray(menuArr.value, []);
  }
};

const filterSelectArray = (allData: any, initedArray: number[]): number[] => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initedArray.push(item.id);
    }
    if (item.children && item.children.length > 0) {
      filterSelectArray(item.children, initedArray);
    }
  });
  return initedArray;
};
//抽屉组件确定按钮的回调
const confirm = async () => {
  //职位的id
  let roleId: number = roleParams.id;
  //选中节点的id
  let arr: number[] = tree.value.getCheckedKeys();
  //半选的id
  let arr1: number[] = tree.value.getHalfCheckedKeys();
  let permissionId: number[] = arr.concat(arr1);
  //发请求，下发对应的权限
  let result: PermissionResponseData = await reqSetPermission(
    roleId,
    permissionId,
  );
  if (result.code == 200) {
    //关闭抽屉
    drawer.value = false;
    //提示信息
    ElMessage({ type: "success", message: "角色权限分配成功" });
    //刷新页面
    window.location.reload();
  }
};
//删除某个已有职位角色的按钮回调
const deleteRole = async (roleId: number) => {
  let result: RemoveResponseData = await reqRemoveRole(roleId);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};
</script>

<script lang="ts">
export default {
  name: "Role",
};
</script>

<style scoped lang="css">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
