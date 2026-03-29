<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button type="primary" icon="Plus" size="default" @click="addTrademark">添加品牌</el-button>
      <!-- 表格组件：用于展示已有的平台数据 -->
      <!-- 
    table
    ---border:可以设置表格纵向是否有边框
    table-column
    ---label:设置列标题
    ---width:设置列宽
    ---align:设置列对齐方式
     -->
      <el-table style="margin: 10px 0px;" border:true :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <!-- table-column:默认展示数据用div -->
        <el-table-column label="品牌名称">
          <template #="{ row }">
            <pre style="color: brown;">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px;" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, }">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`你确定要删除${row.tmName}吗?`" width="250px" icon="Delete" @confirm="removeTradeMark(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件
           pagination
           v-model:current-page:设置分页器当前页码
           v-model:page-size:设置分页器每页显示的条数
           :page-sizes:设置每页显示多少条数据
           :size:设置分页器大小
           :disabled:设置分页器是否禁用
           :background:设置分页器背景色
           layout:设置分页器六个子组件布局
           :total:设置总数据条数
           @size-change:设置每页显示条数变化时的回调函数
           @current-change:设置当前页码变化时的回调函数
     -->
      <el-pagination @current-change="getHasTrademark" @size-change="sizeChange" v-model:current-page="pageNo"
        v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
        layout="prev, pager, next, jumper,->, sizes, total" :total="total" />
    </el-card>
    <!-- 对话框组件:在添品牌与修改已有品牌的业务时候使用结构 -->
    <!-- 
    v—model:属性用户控制对话框的显示与隐藏的 true显示 false隐藏
    title:设置对话框左上角标题
     -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <!-- 对话框内容：表单组件 -->
      <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- upload组件属性:action图片上传路径书写/api,代理服务器不发送这次post请求  -->
          <el-upload :headers="uploadHeaders" class="avatar-uploader" action="/api/admin/product/fileUpload"
            :show-file-list="false" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
            <img :src="trademarkParams.logoUrl" v-if="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 对话框底部：按钮组件,即具名插槽footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取 消</el-button>
        <el-button type="primary" size="default" @click="confirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
//引入组合式API函数ref，用于创建响应式数据
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark';
import type { Records, TradeMarkResponseData, Trademark } from '@/api/product/trademark/type';
import { ElMessage } from 'element-plus';
import type { UploadProps } from 'element-plus';
import useUserStore from '@/store/modules/user';
//当前页码
let pageNo = ref<number>(1);
//每一页展示多少条数据
let limit = ref<number>(3);
//总数据条数
let total = ref<number>(0);
//存储已有品牌的数据
let trademarkArr = ref<Records>([]);
//控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false);
//定义收集新增品牌数据的对象
let trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: ''
});

//获取el-form组件实例
let formRef = ref();

//上传图片请求头携带token
//获取用户信息的store实例
const userStore = useUserStore()
const uploadHeaders = {
  token: userStore.token
}

//获取已有品牌的接口封装为一个函数：在任何情况下想获取数据，调用此函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager;
  let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value);
  if (result.code == 200) {
    //获取数据成功，存储数据
    trademarkArr.value = result.data.records;
    //获取总数据条数
    total.value = result.data.total;
  }
}
//组件挂载完成后，调用获取已有品牌的函数，获取数据
onMounted(() => {
  getHasTrademark();
})

//分页器当前页码变化时的回调函数
//对于当前页码发送变化自定义事件，组件pagination父组件回传了数据（当前的页码）
//@ current-change="getHasTrademark"：当分页器当前页码发生变化时，调用getHasTrademark函数，并将新的页码作为参数传递给函数

//当下拉菜单发送变化的时候触发此方法
//这个自定义组件pagination父组件回传了数据（每页显示的条数,即下拉菜单选中数据返回）
const sizeChange = () => {
  //当前每一页的数据量发送变化的时候，当前页码归1，重新获取数据
  //pageNo.value = 1;
  getHasTrademark();
}

//添加品牌按钮的点击事件
const addTrademark = () => {
  //对话框显示
  dialogFormVisible.value = true;
  //清空表单数据
  trademarkParams.id = 0;
  trademarkParams.tmName = '';
  trademarkParams.logoUrl = '';
  //第一种写法：ts的问号语法
  /* formRef.value?.clearValidate('tmName');
  formRef.value?.clearValidate('logoUrl'); */
  nextTick(() => {
    //第二种写法：调用el-form组件实例的clearValidate方法，清除掉对应表单项的校验结果
    formRef.value.clearValidate('tmName');
    formRef.value.clearValidate('logoUrl');
  });
}

//修改品牌按钮的点击事件
//row:当前已有的品牌数据，包含品牌名称与品牌logo地址
const updateTrademark = (row: Trademark) => {
  //清空表单校验规则错误信息  
  nextTick(() => {
    //第二种写法：调用el-form组件实例的clearValidate方法，清除掉对应表单项的校验结果
    formRef.value.clearValidate('tmName');
    formRef.value.clearValidate('logoUrl');
  });
  //对话框显示
  dialogFormVisible.value = true;
  //ES6语法合并对象
  Object.assign(trademarkParams, row);
  /*   trademarkParams.id = row.id;
    //将选中品牌的数据填充到表单中
    trademarkParams.tmName = row.tmName;
    trademarkParams.logoUrl = row.logoUrl; */
}

//对话框取消按钮的点击事件
const cancel = () => {
  //对话框隐藏
  dialogFormVisible.value = false;
}

//对话框确定按钮的点击事件
const confirm = async () => {
  //表单验证：调用el-form组件实例的validate方法，进行表单验证，验证成功后才发送请求
  await formRef.value.validate();
  let result: any = await reqAddOrUpdateTrademark(trademarkParams);
  if (result.code == 200) {
    //对话框隐藏
    dialogFormVisible.value = false;
    //添加|修改品牌成功，提示用户，并重新获取数据
    ElMessage({
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
      type: 'success',
    });
    //重新获取数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1);
  } else {
    //添加品牌失败，提示用户
    ElMessage({
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
      type: 'error',
    });
    dialogFormVisible.value = false;
  }
}

//上传图片之前的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发，上传文件之前可以约束文件类型与大小，判断上传的文件是否是图片
  //要求：上传文件格式png/jpg/jpeg/gif等图片格式
  if (rawFile.type === 'image/png' || rawFile.type === 'image/jpg' || rawFile.type === 'image/jpeg' || rawFile.type === 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      //上传文件大小不能超过4MB
      return true;
    } else {
      //上传文件过大，提示用户，并禁止上传
      ElMessage({
        message: '请上传小于4MB的图片',
        type: 'error',
      });
      return false;
    }
  } else {
    //上传文件格式错误，提示用户，并禁止上传
    ElMessage({
      message: '请上传正确的图片格式',
      type: 'error',
    });
    return false;
  }
}

//上传图片成功的钩子函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  //钩子是在图片上传成功之后触发，上传文件成功之后可以获取服务器返回的数据，获取到图片的url地址
  //将图片的url地址存储到trademarkParams对象中
  trademarkParams.logoUrl = response.data;
  //图片上传成功，清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl');
}

//品牌自定义验证规则
//rule:验证规则对象，value:表单项的值，callback:回调函数
const validatorTmName = ( value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback();
  } else {
    callback(new Error('品牌名称长度必须大于2个字符'));
  }
}

//品牌logo自定义验证规则
const validatorLogoUrl = ( value: any, callback: any) => {
  if (value) {
    callback();
  } else {
    callback(new Error('请上传品牌logo图片'));
  }
}

//表单验证规则
const rules = {
  tmName: [
    //required:必填项，message:提示信息，trigger:触发验证的事件 blur：失去焦点时触发验证,change:内容发生变化时触发验证
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl }
  ]
}

//气泡确认框确定按钮的回调函数
const removeTradeMark = async (id: number) => {
  //发送删除品牌的请求
  let result: any = await reqDeleteTrademark(id);
  if (result.code == 200) {
    //删除品牌成功，提示用户，并重新获取数据
    ElMessage({
      message: '删除品牌成功',
      type: 'success',
    });
    //重新获取数据
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    //删除品牌失败，提示用户
    ElMessage({
      message: '删除品牌失败',
      type: 'error',
    });
  }
}
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