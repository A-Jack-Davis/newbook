<template>
    <div class="container">
        <el-menu :default-active="$route.fullPath" class="el-menu-demo" mode="horizontal" router>
            <el-menu-item :index="`/home/personalcenter/userarticle?t=1`">文章</el-menu-item>
            <el-menu-item :index="`/home/personalcenter/usercollect?t=2`">收藏</el-menu-item>
            <el-menu-item :index="`/home/personalcenter/userlike?t=3`">点赞</el-menu-item>
            <el-menu-item :index="`/home/personalcenter/userfocuson?t=4`">关注</el-menu-item>
            <el-menu-item :index="`/home/personalcenter/userfans?t=5`">粉丝</el-menu-item>
        </el-menu>
        <div class="main">
            <router-view :key="$route.query.t + ''"></router-view>
        </div>
    </div>
</template>
    
<script setup lang='ts'>


</script>
    
<style lang='less' scoped>
.container {
    width: 100%;
    // height: 1000px;
    min-height: 400px;

    background-color: #ffffff;

    .el-menu {
        border: 0;
        height: 46px;
    }

    .main {
        width: 100%;
    }
}
</style>