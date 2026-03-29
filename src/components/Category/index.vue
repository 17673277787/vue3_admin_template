<template>
    <el-card>
        <el-form :inline="true">
            <el-form-item label="一级分类">
                <!-- change:选中值发送变化时触发 -->
                <el-select :disabled="scene==0?false:true" placeholder="请选择" style="width: 200px" v-model="categoryStore.c1Id" @change="handler"><!-- v-model使得这个下拉框选中的值，会存到 c1Id 里 -->
                    <!-- option:label即为el-option的显示文本，option:value即为el-option的值，select下拉菜单收集的数据 -->
                    <el-option v-for="(c1) in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select :disabled="scene==0?false:true" placeholder="请选择" style="width: 200px" v-model="categoryStore.c2Id" @change="handler1">
                    <el-option v-for="(c2) in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select :disabled="scene==0?false:true" placeholder="请选择" style="width: 200px" v-model="categoryStore.c3Id">
                    <el-option v-for="(c3) in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
//引入生命周期函数钩子
import { onMounted } from 'vue';
//引入分类相关的仓库
import useCategoryStore from '@/store/modules/category';

let categoryStore = useCategoryStore();

//组件挂载完成后发送请求获取一级分类数据
onMounted(() => {
    getC1();
});

//通知仓库获取一级分类数据的方法
const getC1 = () => {
    //通知分类仓库发请求获取一级分类的数据
    categoryStore.getC1();
};

//此方法即为一级分类下拉菜单的change事件（选中值的时候会触发，保证一级分类ID有了）
const handler = () => {
    //通知分类仓库把二级分类和三级分类的数据清空，保证二级分类和三级分类的下拉菜单数据是当前一级分类对应的
    categoryStore.c2Id = '';
    categoryStore.c3Id = '';
    categoryStore.c3Arr = [];
    //通知分类仓库发请求获取二级分类的数据
    categoryStore.getC2();
};

//此方法即为二级分类下拉菜单的change事件（选中值的时候会触发，保证二级分类ID有了）
const handler1 = () => {
    //通知分类仓库把三级分类的数据清空，保证三级分类的下拉菜单数据是当前二级分类对应的
    categoryStore.c3Id = '';
    //通知分类仓库发请求获取三级分类的数据
    categoryStore.getC3();
};

//接收父组件传递过来scene变量
defineProps(['scene']);

</script>

<style scoped>

</style>