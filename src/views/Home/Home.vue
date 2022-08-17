<template>
    <div class="home">
        <div class="head" v-show="!route.meta.hideHeader">
            <HeadNav class="fixed"></HeadNav>
        </div>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { useUserStore } from "@/stores/user.js";
import { onMounted } from 'vue';
import HeadNav from '@/components/HeadNav/HeadNav.vue'
import { useRoute } from "vue-router";
const route = useRoute()
// 使用user store
const userStore = useUserStore();

onMounted(async () => {
    // // 组件激活发送请求获取用户数据
    // const res = await userStore.getUserInfo()
    // console.log('res', res)
})
</script>
    
<style lang='less' scoped>
.home {

    width: 100%;
    height: 100%;
    background-color: #f4f5f5;

    .head {
        width: 100%;
        height: 60px;
        margin-bottom: 10px;


        .fixed {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
        }
    }

    .main {
        width: 100%;
        background-color: #f4f5f5;
    }
}
</style>    