<template>
    <div class="home">
        <!-- 头部导航 -->
        <div class="head" v-show="!$route.meta.hideHeader">
            <HeadNav class="fixed"></HeadNav>
        </div>
        <!-- 主体 -->
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import HeadNav from '@/components/HeadNav/HeadNav.vue'



</script>
    
<style lang='less' scoped>
.home {

    // padding-left: calc(100vw - 100%);

    // margin-right: calc(100vw - 100%);
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