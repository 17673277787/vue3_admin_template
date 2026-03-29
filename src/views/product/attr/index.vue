<template>
    <div>
        <!-- 三级分类全局组件 -->
        <Category :scene="scene" /><!-- 父组件与子组件通信 -->
        <el-card style="margin: 10px 0px;">
            <div v-show="scene == 0">
                <el-button @click="addAttr" type="primary" size="default" icon="Plus"
                    :disabled="categoryStore.c3Id ? false : true">添加平台属性</el-button>
                <el-table border style="margin: 10px 0px;" :data="attrArr">
                    <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
                    <el-table-column label="属性名称" width="150px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{ row}">
                            <el-tag style="margin:5px" v-for="(item) in row.attrValueList" :key="item.id">{{
                                item.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150px">
                        <template #="{ row }">
                            <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>

                            <el-popconfirm :title="`你确定要删除${row.attrName}吗？`" width="200px"
                                @confirm="deleteAttr(row.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="scene == 1">
                <!-- 添加属性的表单 -->
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="addAttrValue" :disabled="attrParams.attrName ? false : true" type="primary"
                    size="default" icon="Plus">添加属性值</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
                <el-table border style="margin: 10px 0px;" :data="attrParams.attrValueList">
                    <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
                    <el-table-column label="属性值名称">
                        <!-- row: 当前行数据,即当前属性值对象 $index: 当前行索引 -->
                        <template #="{ row, $index }">
                            <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
                                placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
                            <div v-else @blur="toEdit(row, $index)">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作">
                        <template #="{ $index }">
                            <el-button type="primary" size="small" icon="Delete"
                                @click="attrParams.attrValueList.splice($index, 1)"></el-button>
                            <!-- attrParams.attrValueList.splice($index, 1)是删除当前行的属性值，其中splice方法的第一个参数是起始索引，第二个参数是删除的元素个数 -->
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" size="default" @click="save"
                    :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
//组合式API函数watch
import { watch, ref, reactive, nextTick,onBeforeMount } from 'vue';
//nextTick:在下次DOM更新完成后执行回调函数
//onBeforeMount:在组件挂载之前执行回调函数
//引入获取已有属性与属性值接口
import { reqAttr, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
//获取分类的仓库
import useCategoryStore from '@/store/modules/category';
import { ElMessage } from 'element-plus';
let categoryStore = useCategoryStore();
//存储已有的属性与属性值
let attrArr = ref<Attr[]>([]);
//定义card组件内容切换变量
let scene = ref<number>(0);//scene=0显示属性列表，scene=1显示添加属性的表单
//收集新增的属性的数据
let attrParams = reactive<Attr>({
    attrName: "",
    attrValueList: [//新增的属性值数组
    ],
    categoryId: '',//三级分类的ID
    categoryLevel: 3,//代表的是三级分类
})
//准备一个数组，专门用来存储添加属性值的输入框的组件实例对象
let inputArr = ref<any[]>([]);
//监听仓库三级分类ID的变化
watch(() => categoryStore.c3Id, () => {
    //清空上一次查询的属性与属性值
    attrArr.value = [];
    //保证三级分类ID存在才发送请求
    if (!categoryStore.c3Id) return;
    //获取分类的ID
    getAttr();
});

//获取已有属性与属性值接口
const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore;
    //获取分类下的已有属性与属性值
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
    if (result.code === 200) {
        attrArr.value = result.data;
    }
}

//添加属性按钮的事件处理函数
const addAttr = () => {
    //清空上一次添加的属性数据
    Object.assign(attrParams, {
        attrName: "",
        attrValueList: [],
        categoryId: categoryStore.c3Id,//三级分类的ID
        categoryLevel: 3,
    });
    //切换card组件内容为添加属性的表单
    scene.value = 1;
    //把三级分类的ID和分类级别存到attrParams中，方便添加属性的时候携带给服务器
    attrParams.categoryId = categoryStore.c3Id;
}

//修改属性按钮的事件处理函数
const updateAttr = (row: Attr) => {
    //切换card组件内容为修改属性的表单
    scene.value = 1;
    //将已有的属性对象赋值给attrParams，方便修改属性的时候携带给服务器
    //Object.assign（attrParams,row）是浅拷贝，会导致修改属性值的时候，属性列表的属性值也会跟着修改，所以需要深拷贝
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
}

//取消按钮的事件处理函数
const cancel = () => {
    //切换card组件内容为属性列表
    scene.value = 0;
}

//添加属性值按钮的回调
const addAttrValue = () => {
    //点击添加属性值按钮的时候，向数组添加一个属性值对象
    attrParams.attrValueList.push({
        flag: true,//控制每一个属性值编辑模式与查看模式的切换
        valueName: ''
    });
    //获取最后el-input组件聚焦
    nextTick(() => {
        //让最后一个添加的属性值输入框获得焦点
        inputArr.value[attrParams.attrValueList.length - 1].focus();
    });
}

//保存按钮的事件处理函数
const save = async () => {
    //发送请求把新增的属性数据保存到服务器
    let result: any = await reqAddOrUpdateAttr(attrParams);
    //添加或者修改成功，切换card组件内容为属性列表，重新获取属性列表数据
    if (result.code === 200) {
        //切换card组件内容为属性列表
        scene.value = 0;
        //提示信息
        ElMessage({
            message: attrParams.id ? '修改成功' : '添加成功',
            type: 'success',
        });
        getAttr();
    } else {
        ElMessage({
            message: attrParams.id ? '修改失败' : '添加失败',
            type: 'error',
        });
    }
}

//失去焦点切换查看模式
const toLook = (row: AttrValue, $index: number) => {
    //非法情况判断1
    if (row.valueName.trim() == '') {
        //删除调用对应属性值为空的元素
        attrParams.attrValueList.splice($index, 1);
        //提示信息
        ElMessage({
            type: "error",
            message: '属性值不能为空'
        })
        return;
    }
    //非法情况2
    let repeat = attrParams.attrValueList.find((item) => {
        //切记把当前失去焦点属性值对象从当前数组扣除判断
        if (item != row) {
            return item.valueName === row.valueName;
        }
    })

    if (repeat) {
        //将重复的属性值从数组中删除掉
        attrParams.attrValueList.splice($index, 1);
        ElMessage({
            type: 'error',
            message: '属性值不能重复'
        })
        return;
    }

    row.flag = false;
}

//失去焦点切换编辑模式
const toEdit = (row: AttrValue, $index: number) => {
    row.flag = true;
    //nextTick:在下次DOM更新完成后执行回调函数
    nextTick(() => {
        //让当前失去焦点的输入框重新获得焦点
        inputArr.value[$index].focus();
    })
}

//删除某一个已有的属性的事件处理函数
const deleteAttr = async (attrId: number | string) => {
    //发送请求删除属性
    let result: any = await reqDeleteAttr(attrId);
    if (result.code === 200) {
        //提示信息
        ElMessage({
            type: 'success',
            message: '删除成功'
        });
        //重新获取属性列表数据
        getAttr();
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        });
    }
}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeMount(() => {
    //清空仓库的数据
    categoryStore.$reset();
})
</script>

<style scoped></style>