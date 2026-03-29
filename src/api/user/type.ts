//定义用户相关数据的ts类型
//用户登录接口需要携带参数ts类型
export interface loginFormData {
    username: string,
    password: string
}

//定义全部接口返回数据都拥有的ts类型
export interface ResponseData {
    code:number,
    message:string,
    ok:boolean
}

//登录接口返回数据类型
export interface loginResponseData extends ResponseData {
    data: string
}

//定义获取用户信息返回数据类型
export interface userInfoResponseData extends ResponseData {
    data: {
        avatar: string,
        name: string,
        roles: string[],
        buttons: string[],
        routes: string[]
    }
}











/* //登录接口需要携带参数ts类型
export interface loginForm {
    username: string,
    password: string
}

interface dataType {
    token?: string,//加？表示可选属性
    message?:string
}
//登录接口返回数据类型
export interface loginResponseData {
    code: number,
    data: dataType
}

interface userInfo {
    userId: number,
    avatar: string,
    username: string,
    password: string,
    desc: string,
    roles: string[],
    buttons: string[],
    routes: string[],
    token: string
}

//定义服务器返回用户信息相关的数据类型
interface user {
    checkUser: userInfo
}

export interface userResponseData {
    code: number,
    data: user
}
 */