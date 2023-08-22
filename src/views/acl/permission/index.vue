<template>
  <el-table
    :data="permissionArr"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
  >
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <!-- row为已有菜单对象或者按钮对象 -->
      <template #default="{ row }">
        <el-button
          @click="addPermission(row)"
          type="primary"
          size="small"
          icon="Plus"
          :disabled="row.level == 4 ? true : false"
          >{{ row.level == 3 ? "添加功能" : "添加菜单" }}</el-button
        >
        <el-button
          type="primary"
          size="small"
          icon="Edit"
          :disabled="row.level == 1 ? true : false"
          @click="editPermission(row)"
          >编辑</el-button
        >
        <el-popconfirm
          @confirm="deletePermission(row.id)"
          :title="`你确定要删除${row.name}?`"
          width="260px"
        >
          <template #reference>
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              :disabled="row.level == 1 ? true : false"
              >删除</el-button
            >
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框组件：添加或者更新已有的菜单的数据结构 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
  >
    <!-- 表单组件：将来收集新增与已有的菜单数据 -->
    <el-form>
      <el-form-item label="名称">
        <el-input
          placeholder="情你输入菜单的名称"
          v-model="menuData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input
          placeholder="情你输入权限值"
          v-model="menuData.code"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
//引入获取菜单的请求api
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from "@/api/acl/menu";
import type {
  PermissionResponseData,
  PermissionList,
  Permission,
  MenuParams,
} from "@/api/acl/menu/type";
import { ElMessage } from "element-plus";
//存储菜单的数据
let permissionArr = ref<PermissionList>([]);
//控制dialog组件的显示与隐藏
let dialogVisible = ref<boolean>(false);
//携带的参数
let menuData = reactive<MenuParams>({
  code: "",
  level: 0,
  name: "",
  pid: 0,
});
//获取菜单数据的方法
const getHasPermission = async () => {
  let result: PermissionResponseData = await reqAllPermission();
  if (result.code == 200) {
    permissionArr.value = result.data;
  }
};
//添加菜单按钮的回调
const addPermission = (row: Permission) => {
  //每次添加钱清空一下输入框中的数据
  Object.assign(menuData, {
    id: 0,
    code: "",
    level: 0,
    name: "",
    pid: 0,
  });
  dialogVisible.value = true;
  //收集新增的菜单的level数值
  menuData.level = row.level + 1;
  //给谁新增子菜单
  menuData.pid = row.id;
};
//编辑按钮的回调
const editPermission = (row: Permission) => {
  dialogVisible.value = true;
  //点击编辑按钮，收集已有的菜单数据进行更新
  Object.assign(menuData, row);
};
//确定按钮的回调
const confirm = async () => {
  //发请求 更新或者新增一个子菜单
  let result: any = await reqAddOrUpdateMenu(menuData);
  console.log(result);
  if (result.code == 200) {
    dialogVisible.value = false;
    ElMessage({
      type: "success",
      message: menuData.id ? "更新成功" : "添加成功",
    });
    //再次获取全部最新的菜单的数据
    getHasPermission();
  } else if (result.code == 201) {
    ElMessage({ type: "error", message: "系统数据，不能修改" });
    return;
  }
};
//删除菜单按钮的回调
const deletePermission = async (id: number) => {
  let result: any = await reqRemoveMenu(id);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHasPermission();
  } else if (result.code == 201) {
    ElMessage({ type: "error", message: "系统数据，不能删除" });
  }
};
onMounted(() => {
  getHasPermission();
});
</script>
<script lang="ts">
export default {
  name: "Permission",
};
</script>

<style scoped></style>
