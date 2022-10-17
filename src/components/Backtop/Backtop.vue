<template>
    <!--回到顶部 -->
    <el-backtop :bottom="80">
        <i class="iconfont icon-18huidaodingbu"></i>
    </el-backtop>
</template>
    
<script setup lang='ts'>

</script>
    
<style lang='less' scoped>
// 回到顶部
.el-backtop {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #ffffff;
    text-align: center;
    line-height: 50px;

    i {
        font-size: 20px;
        font-weight: 600;
    }
}
</style>