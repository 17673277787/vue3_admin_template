import type { RouteRecordRaw } from "vue-router";
import type { CategoryObj } from "@/api/product/attr/type";
//定义小仓库数据state类型
export interface UserState {
    token:string|null;
    menuRoutes:RouteRecordRaw[],
    username:string,
    avatar:string
}

//定义分类仓库state对象的ts类型
export interface CategoryState {
    //存储一级分类数据的数组
    c1Arr: CategoryObj[];
    //存储一级分类id的变量
    c1Id: string | number;
    //存储二级分类数据的数组
    c2Arr: CategoryObj[];
    //存储二级分类id的变量
    c2Id: string | number;
    //存储三级分类数据的数组
    c3Arr: CategoryObj[];
    //存储三级分类id的变量
    c3Id: string | number;
}