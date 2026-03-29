//SKU模块接口管理
import request from "@/utils/request";
import type { SkuInfoData, SkuResponseData } from "./type";
const API = {
    //获取已有的商品的数据——SKU
    SKU_URL: '/admin/product/list/',
    //上架
    SALE_URL: '/admin/product/onSale/',
    //下架
    CANCEL_URL: '/admin/product/cancelSale/',
    //获取商品详情的接口
    SKUINFO_URL: '/admin/product/getSkuInfo/',
    //删除已有的商品
    DELETESKU_URL: '/admin/product/deleteSku/'
}

//获取商品SKU的接口
export const reqSkuList = (page: number, limit: number) => request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`);

//上架
export const reqSaleSku = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId);

//下架
export const reqCancelSale = (skuId: number) => request.get<any, any>(API.CANCEL_URL + skuId);

//获取商品详情的接口
export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId);

//删除已有的商品
export const reqRemoveSku = (skuId: number) => request.delete<any, any>(API.DELETESKU_URL + skuId);