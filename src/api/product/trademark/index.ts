//书写品牌管理模块接口
import request from '@/utils/request';
import type { TradeMarkResponseData,Trademark } from './type';
//品牌管理模块接口地址
const API = {
  //获取品牌列表接口地址
  TRADEMARK_URL: '/admin/product/baseTrademark/',
  //添加品牌接口地址
  ADDTRADEMARK_URL: '/admin/product/baseTrademark/save',
  //修改品牌接口地址
  UPDATETRADEMARK_URL: '/admin/product/baseTrademark/update',
  //删除品牌接口地址
  DELETETRADEMARK_URL: '/admin/product/baseTrademark/remove/'    
}
//获取品牌列表接口方法
//page:当前页,默认第一页 limit:每页条数
export const reqHasTrademark = (page: number, limit: number) => {
  return request.get<any,TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`);
}

//添加与修改品牌接口方法
//tradeMark:品牌对象,包含品牌id(修改时需要) 品牌名称 品牌logo地址
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  if (data.id) {
    // 修改品牌
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data);
  } else {
    // 添加品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data);
  }
}

//删除品牌接口方法
//id:品牌id
export const reqDeleteTrademark = (id: number) => {
  return request.delete<any, any>(API.DELETETRADEMARK_URL + id);
}