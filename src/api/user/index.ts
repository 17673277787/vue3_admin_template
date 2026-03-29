//统一管理项目用户相关的接口
import request from "@/utils/request";
import type { loginFormData, loginResponseData,userInfoResponseData } from "./type";
//真实调用后端接口与参数格式
//项目用户相关的请求地址
const API = {
    LOGIN_URL: "/admin/acl/index/login",
    USERINFO_URL: "/admin/acl/index/info",
    LOGOUT_URL: "/admin/acl/index/logout"
};

//登录接口
export const reqLogin = (data: loginFormData) => request.post<any, loginResponseData>(API.LOGIN_URL, data);
//post第一个参数：指定请求体（data）的类型。第二个参数：指定响应数据（response）的类型。
//获取用户信息接口
export const reqUserInfo = () => request.get<any, userInfoResponseData>(API.USERINFO_URL);
//退出登录接口
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL);  


/* import type { loginForm,loginResponseData, userResponseData } from "./type";
//统一管理接口
const API = {
    LOGIN_URL: "/user/login",
    USERINFO_URL: "/user/info"
};
//暴露请求函数
//登录接口方法
export const reqLogin = (data:loginForm) => request.post<any,loginResponseData>(API.LOGIN_URL,data);
//获取用户信息接口方法
export const reqUserInfo = () => request.get<any,userResponseData>(API.USERINFO_URL); */