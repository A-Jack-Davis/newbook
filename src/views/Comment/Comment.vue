<template>
    <div class="commentbox">
        <!-- 共n条评论 -->
        <div class="conut" :key="commentsStore.commentList.length">
            共 <el-tag round> {{  commentsStore.commentList.length  }} </el-tag> 条评论
            <i class="iconfont icon-huo"></i>
        </div>
        <!-- 遍历评论 -->
        <div class="main" v-for="comment  in commentsStore.commentList" :key="comment.id">
            <!-- 评论组件 -->
            <OneLevelComment :comment="comment"></OneLevelComment>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { onMounted } from 'vue';
import { useCommentsStore } from '@/stores/comment';
import { useArticleStore } from '@/stores/article';
import OneLevelComment from './OneLevelComment/OneLevelComment.vue';

const commentsStore = useCommentsStore()

onMounted(() => {
    commentsStore.getCommentlist(useArticleStore().articleInfo.id)
})



</script>
    
<style lang='less' scoped>
.commentbox {
    .conut {
        cursor: default;
        display: flex;
        align-items: center;
        font-size: 18px;
        line-height: 30px;
        font-weight: 600;
        color: #252933;
        margin-bottom: 24px;

        .el-tag {
            margin-right: 5px;
            margin-left: 5px;
        }

        >i {
            color: red;
            margin-left: 10px;
            font-size: 26px;
        }

    }

}
</style>