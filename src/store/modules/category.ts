//商品分类全局组件的小仓库
import { defineStore } from 'pinia';
import { reqC1,reqC2,reqC3 } from '@/api/product/attr';
import type { CategoryResponseData } from '@/api/product/attr/type';
import type { CategoryState } from './types/type';
let useCategoryStore = defineStore('Category', {
  //小仓库的state数据
    state: (): CategoryState => {
    return {
        //存储一级分类数据的数组
        c1Arr: [],
        //存储一级分类id的变量
        c1Id: '',
        //存储对应一级分类的二级分类数据的数组
        c2Arr: [],
        //存储二级分类id的变量
        c2Id: '',
        //存储对应二级分类的三级分类数据的数组
        c3Arr: [],
        //存储三级分类id的变量
        c3Id: ''
    }
  },
  actions: {
    //获取一级分类的方法
    async getC1() {
        //发请求获取一级分类数据
        let result: CategoryResponseData = await reqC1();
        if(result.code === 200) {
            //将获取到的一级分类数据存储到state中
            this.c1Arr = result.data;
        }
    },
    //获取二级分类的方法
    async getC2() {
        //发请求获取二级分类数据
        let result: CategoryResponseData = await reqC2(this.c1Id);
        if(result.code === 200) {
            //将获取到的二级分类数据存储到state中
            this.c2Arr = result.data;
        }
    },
    //获取三级分类的方法
    async getC3() {
        //发请求获取三级分类数据
        let result: CategoryResponseData = await reqC3(this.c2Id);
        if(result.code === 200) {
            //将获取到的三级分类数据存储到state中
            this.c3Arr = result.data;
        }
    }
  },
  getters: {

  }
})
export default useCategoryStore;