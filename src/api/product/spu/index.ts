//SPU管理模块的接口
import request from '@/utils/request';
import type { SkuInfoData, HasSpuResponseData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData,SpuData, SkuData } from './type';
const API = {
    //获取已有的SPU的数据
    HASSPU_URL: '/admin/product/',
    //获取全部品牌的数据
    ALLTRADEMARK_URL: '/admin/product/baseTrademark/getTrademarkList',
    //获取某个SPU下的全部的售卖商品的图片数据
    IMAGE_URL: '/admin/product/spuImageList/',
    //获取某一个SPU下全部的已有的销售属性的数据
    SPUHASSALEATTR_URL: '/admin/product/spuSaleAttrList/',
    //获取整个项目全部的销售属性[颜色、版本、尺码]
    ALLSALEATTR_URL: '/admin/product/baseSaleAttrList',
    //追加一个新的SPU数据
    ADDSPU_URL: '/admin/product/saveSpuInfo',
    //更新已有的SPU数据
    UPDATESPU_URL: '/admin/product/updateSpuInfo',
    //追加一个新增的SKU地址
    ADDSKU_URL: '/admin/product/saveSkuInfo',
    //查看某一个已有的SPU下的全部的SKU数据
    SKUINFO_URL: '/admin/product/findBySpuId/',
    //删除某一个已有的SPU
    REMOVESPU_URL: '/admin/product/deleteSpu/'
}
//获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (page: number, limit:number, category3Id: string|number) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`);

//获取全部的SPU的品牌的数据
export const reqAllTradeMark = ()=> request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL);

//获取某一个SPU下的全部的图片数据
export const reqSpuImageList = (spuId: number) => request.get<any, SpuHasImg>(API.IMAGE_URL + spuId);

//获取某一个SPU下全部的已有的销售属性的数据
export const reqSpuHasSaleAttr = (spuId: number) => request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId);

//获取全部的销售属性
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL);

//添加或者修改已有的SPU数据
export const reqAddOrUpdateSpu = (data: SpuData) => request.post<any, any>(data.id ? API.UPDATESPU_URL : API.ADDSPU_URL, data);

//添加SKU的请求方法
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data);

//获取SKU数据
export const reqSkuList = (spuId: number|string) => request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId);

//删除已有的SPU
export const reqRemoveSpu = (spuId: number|string) => request.delete<any, any>(API.REMOVESPU_URL + spuId);