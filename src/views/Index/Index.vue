<template>
    <div class="container">
        <!-- 文章列表 -->
        <div class="left">
            <AllArticle :key="$route.query.search + ''"></AllArticle>
        </div>
        <!-- 推荐文章 和 作者榜单 -->
        <el-affix :offset="70">
            <RecommendTheArticle :limit="5"></RecommendTheArticle>
            <AuthorList style="margin-top: 20px;"></AuthorList>
        </el-affix>
    </div>
</template>
    
<script setup lang='ts'>
import AllArticle from '@/views/AllArticle/AllArticle.vue';
import AuthorList from '@/components/AuthorList/AuthorList.vue';
import RecommendTheArticle from "@/components/RecommendTheArticle/RecommendTheArticle.vue"
</script>
    
<style lang='less' scoped>
.container {
    display: flex;
    justify-content: space-between;
    max-width: 980px;
    min-height: 1000px;
    margin: 0 auto;

    .left {
        overflow: auto;
        width: 720px;
        background-color: #ffffff;

        .header {
            height: 45px;
            line-height: 45px;
            padding-left: 15px;
            font-size: 14px;
            color: rgb(144, 144, 144);
            border-bottom: 1px solid rgba(151, 151, 151, .15);

            span {
                padding: 0 15px;
            }

            span:nth-child(n+2) {
                border-left: 1px solid rgba(144, 144, 144, .25);
            }
        }
    }

    .el-affix {
        width: 245px;

        .el-empty {
            margin-top: 20px;
            height: 460px;
            background-color: #ffffff;
        }
    }



}

// .active {
//     color: #007fff;
// }
</style>