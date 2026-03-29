<template>
  <div>
    <!--    <h1>SVG测试</h1>
    <SvgIcon name="phone" color="hotpink" width="100px" height="100px"></SvgIcon>--> 
    <!-- 根据当前 URL 路径自动渲染匹配的路由组件 -->
        <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
/* import request from '@/utils/request';
import { onMounted } from 'vue'; */

//当你组件挂载完毕测试发一个请求
/* onMounted(() => {
  request({
    url: '/user/login',
    method: 'post',
    data:{
    username: 'admin',
    password: '111111'
    }
  }).then(res=>{
    console.log(res);
  })
}) */

/* import { onMounted } from 'vue';
import { reqLogin } from '@/api/user';
onMounted(()=>{
  reqLogin({username:'admin',password:'111111'})
}) */
</script>

<style scoped lang="scss">


</style>