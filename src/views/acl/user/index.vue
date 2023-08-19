<template>
  <el-card style="height: 80px">
    <el-form inline class="form">
      <el-form-item label="用户名">
        <el-input placeholder="请输入搜索的用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-button
      type="primary"
      :disabled="selectIdArr.length ? false : true"
      @click="deleteSelect"
      >批量删除</el-button
    >
    <!-- table展示用户的信息 -->
    <el-table
      @selection-change="selectChange"
      style="margin: 10px 0"
      border
      :data="userArr"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        width="240px"
        align="center"
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template #default="{ row }">
          <el-button
            icon="User"
            size="small"
            type="primary"
            @click="setRole(row)"
            >分配角色</el-button
          >
          <el-button
            icon="Edit"
            size="small"
            type="primary"
            @click="updateUser(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`你确定要删除${row.username}?`"
            width="260px"
            @confirm="deleteUser(row.id)"
          >
            <template #reference>
              <el-button size="samll" type="primary" icon="Delete"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :total="total"
      :background="true"
      layout=",prev,pager,next,jumper,->,sizes,total"
      @current-change="getHasUser"
      @size-change="handler"
    >
    </el-pagination>
  </el-card>
  <!-- 抽屉结构：完成添加用户账号|更新已有的账号信息 -->
  <el-drawer v-model="drawer">
    <!-- 头部的标题：将来文字内容是动态 -->
    <template #header>
      <h4>{{ userParams.id ? "更新用户" : "添加用户" }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请你输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请你输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请你输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉结构：用于某一个账号进行角色分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配用户角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <!-- 显示职位的复选框 -->
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
              >{{ role.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqBatchRemoveUser,
} from "@/api/acl/user";
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from "@/api/acl/user/type";
import { ElMessage } from "element-plus";
//默认的页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(5);
//用户的总个数
let total = ref<number>(0);
//存储全部用户的数组
let userArr = ref<Records>([]);
//定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false);
//控制分配角色的抽屉的显示与隐藏
let drawer1 = ref<boolean>(false);
//存储全部职位的数据
let allRole = ref<AllRole>([]);
//当前用户已有的职位
let userRole = ref<AllRole>([]);
//获取抽屉组件from组件实例
let formRef = ref<any>();
//收集用户信息的响应式数据
let userParams = reactive<User>({
  username: "",
  password: "",
  name: "",
});
//准备一个数组存储批量删除的用户的ID
let selectIdArr = ref<User[]>([]);
//组件一挂载获取全部已有的用户信息
const getHasUser = async (pager: number = 1) => {
  //收集当前的页码
  pageNo.value = pager;
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
  );
  if (result.code == 200) {
    total.value = result.data.total;
    userArr.value = result.data.records;
  }
};
onMounted(() => {
  getHasUser();
});
//分页器下拉菜单的自定义事件的回调
const handler = () => {
  getHasUser();
};
//添加用户按钮的回调
const addUser = () => {
  drawer.value = true;
  Object.assign(userParams, {
    id: 0,
    username: "",
    name: "",
    password: "",
  });
  nextTick(() => {
    //清楚上一次表单的错误的校验信息
    formRef.value.clearValidate("username");
    formRef.value.clearValidate("name");
    formRef.value.clearValidate("password");
  });
};
//更新已有的用户按钮的回调
const updateUser = (row: User) => {
  drawer.value = true;
  Object.assign(userParams, row);
  nextTick(() => {
    //清楚上一次表单的错误的校验信息
    formRef.value.clearValidate("username");
    formRef.value.clearValidate("name");
  });
};
//确定按钮的回调
const save = async () => {
  //点击确定按钮，务必保证表单的校验规则通过才发请求
  await formRef.value.validate();
  //点击确定按钮：添加新的用户或者更新已有的新的用户信息
  let result: any = await reqAddOrUpdateUser(userParams);
  //添加成功，关闭抽屉
  if (result.code == 200) {
    drawer.value = false;
    ElMessage({
      type: "success",
      message: userParams.id ? "更新成功" : "添加成功",
    });
    //立马获取最近的全部账号信息
    // getHasUser(userParams.id ? pageNo.value : 1)
    //浏览器自动刷新一次
    window.location.reload();
  } else {
    drawer.value = false;
    ElMessage({
      type: "error",
      message: userParams.id ? "更新失败" : "添加失败",
    });
  }
};
//取消按钮的回调
const cancel = () => {
  drawer.value = false;
};
//检验用户名的回调函数
const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5 && rule.required) {
    callback();
  } else {
    callback(new Error("用户名长度至少为5位"));
  }
};
const validatorName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5 && rule.required) {
    callback();
  } else {
    callback(new Error("昵称长度至少5位"));
  }
};
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6 && rule.required) {
    callback();
  } else {
    callback(new Error("用户密码至少5位"));
  }
};
//抽屉组件表单校验规则对象
const rules = {
  username: [{ required: true, trigger: "blur", validator: validatorUsername }],
  name: [{ required: true, trigger: "blur", validator: validatorName }],
  password: [{ required: true, trigger: "blur", validator: validatorPassword }],
};
//分配角色按钮的回调
const setRole = async (row: User) => {
  drawer1.value = true;
  //存储已有的用户信息
  Object.assign(userParams, row);
  //发请求获取全部职位的数据与当前用户已有的职位数据
  let result: AllRoleResponseData = await reqAllRole(userParams.id);
  if (result.code == 200) {
    allRole.value = result.data.allRolesList;
    userRole.value = result.data.assignRoles;
    drawer1.value = true;
  }
};

//收集复选框全选获取全不选的
let checkAll = ref<boolean>(false);
//控制顶部复选框不确定的样式
let isIndeterminate = ref<boolean>(true);
//复选框全选或者全不选的change事件
const handleCheckAllChange = (val: boolean) => {
  //val位true代表复选框全选
  userRole.value = val ? allRole.value : [];
  isIndeterminate.value = false;
};
//底部全部复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  checkAll.value = value.length === allRole.value.length;
  //不确定是否全部勾选的样式
  isIndeterminate.value = value.length !== allRole.value.length;
};
//分配职位的确定按钮回调
const confirmClick = async () => {
  //收集参数
  let data: SetRoleData = {
    userId: userParams.id,
    roleIdList: userRole.value.map((item) => {
      return item.id as number;
    }),
  };
  let result: any = await reqSetUserRole(data);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "分配职位成功" });
    drawer1.value = false;
    getHasUser(pageNo.value);
  }
};
//删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};
//table组件复选框勾选的时候会触发发事件
const selectChange = (value) => {
  selectIdArr.value = value;
};
//批量删除按钮的回调
const deleteSelect = async () => {
  //整理批量删除的参数
  let idList: any = selectIdArr.value.map((item) => {
    return item.id;
  });
  //批量删除的请求
  let result: any = await reqBatchRemoveUser(idList);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};
</script>
<script lang="ts">
export default {
  name: "User",
};
</script>

<style scoped lang="css">
.box {
  width: 100%;
  height: 400px;
  background-color: blue;
}

.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
