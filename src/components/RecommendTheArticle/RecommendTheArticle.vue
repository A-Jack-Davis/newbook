<template>
    <div class="recommended">
        <h4>推荐文章</h4>
        <div class="content" v-for="randomArticle in articleStore.randomArticleList" :key="randomArticle.id"
            @click="toAticle(randomArticle.id)">
            <div class="title">{{ randomArticle.title }}</div>
            <div class="about">
                <span>{{ randomArticle.like }}&#8197;点赞</span>
                <i class="iconfont icon-dian"></i>
                <!-- <span>{{ randomArticle.comments }}&#8197;评论</span> -->
                <span>{{ randomArticle.pageviews }}&#8197;阅读</span>
            </div>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { addPageviewsApi } from '@/api/article';
import { useArticleStore } from '@/stores/article';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const articleStore = useArticleStore()
const router = useRouter()

const emit = defineEmits(['toArticle'])

onMounted(() => {
    articleStore.getAandomArticle(props.limit)
})

// 路由跳转-->article
async function toAticle(id: number) {
    try {
        await articleStore.getArticleIno(id)
        router.push('/home/article')
        addPageviewsApi(id)
        emit('toArticle')
    } catch (error) {
        console.log('error', error)
    }
}
const props = defineProps<{
    limit: number
}>()

</script>
    
<style lang='less' scoped>
.recommended {
    width: 100%;
    background-color: #ffffff;

    h4 {
        margin: 0 20px;
        height: 56px;
        line-height: 56px;
        font-size: 15px;
        color: #1d2129;
        font-weight: 500;
        border-bottom: 1px solid #e4e6eb;
        margin-bottom: 8px;
    }

    .content {
        cursor: pointer;
        height: 64px;
        padding: 8px 20px;
        font-size: 13px;
        font-weight: 400;

        .title {
            line-height: 22px;
            color: #252933;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 4px;
        }

        .about {
            line-height: 22px;
            color: #8a919f;

            .icon-dian {
                padding: 0 4px;
                line-height: 22px;

            }

        }
    }

    .content:hover .title {
        color: #1171f1 !important;
    }
}

.hover {
    color: #1171ee;
}
</style>