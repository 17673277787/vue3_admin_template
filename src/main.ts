import { createApp } from 'vue'
import App from '@/App.vue'
//引入element-plus插件与样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
//配置element-plus国际化
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//svg插件需要配置代码
import 'virtual:svg-icons-register'
//将SvgIcon注册为全局组件
//import SvgIcon from '@/components/SvgIcon/index.vue';

//获取应用实例对象
const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn
});
//引入自定义插件对象：注册整个项目全局组件
import gloablComponent from '@/components';
//安装自定义插件
app.use(gloablComponent);
//引入模板的全局的样式
import '@/styles/index.scss'

//app.component('SvgIcon',SvgIcon);

//测试代码
/* import axios from 'axios';
axios({
    url:'/api/user/login',
    method:"post",
    data:{
        username:'admin',
        password:'111111'
    }
}) */

//引入路由
import router from './router'
//注册模板路由
app.use(router);

//引入仓库
import pinia from './store';
//安装仓库
app.use(pinia);

//引入路由鉴权文件
import './permission';
//将应用挂载到挂载点上
app.mount('#app')
