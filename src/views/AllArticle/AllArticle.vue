<template>
    <div class="article" v-for="(article, indexe) in articleList" :key="article.id" @click="toAticle(article.id)">
        <div class="info">
            <span>{{ article.nickname }}</span>
            <span>2月前</span>
            <span>Vue.js</span>
        </div>
        <div class="content">
            <div class="l">
                <!-- 标题 -->
                <h4 class="title">{{ article.title }}</h4>
                <!-- 简介 -->
                <p>
                    {{ article.introduction ? article.introduction : _toChString(article.content) }}
                </p>
                <!-- 文章访问信息 -->
                <div class="floot">
                    <button>
                        <el-icon>
                            <View />
                        </el-icon>
                        <i>{{ article.pageviews }}</i>
                    </button>
                    <button @click.stop="increment('like', article, indexe)">
                        <i class="iconfont icon-dianzan">
                        </i>
                        <i :key="article.like">{{ article.like }}</i>
                    </button>
                    <button @click="toComment">
                        <el-icon>
                            <ChatLineRound />
                        </el-icon>
                        {{ article.comments }}
                    </button>
                </div>
            </div>
            <!-- 封面 -->
            <img :src="BASEURL + article.cover_url" alt="" v-if="article.cover_url">
        </div>
    </div>
    <!-- 加载动画 -->
    <div class="loading" v-show="loading">
        <div class="loader">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    </div>
    <!-- 没有更多 -->
    <div class="empty" v-if="emptyShow">
        <div class="loader">
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
        </div>
        <img src="@/assets/imgs/empty.png" alt="">
    </div>
</template>
    
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"
import { getAllArticleApi, incrementApi } from '@/api/article';
import { useArticleStore } from '@/stores/article';
import { ChatLineRound, View, } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
const aticleStore = useArticleStore()
const router = useRouter()

// 是否在发送请求获取文章
const newApi = ref<boolean>(false)
const loading = ref<boolean>(false)
const emptyShow = ref<boolean>(false)
onMounted(() => {
    // 挂载时获取文章列表
    getAticleList()
    // 滚动到底，再加载的处理事件
    window.addEventListener('scroll', lazyLoading);
})

onBeforeRouteLeave((to, from, next) => {
    window.removeEventListener('scroll', lazyLoading)
    next()
})
/**
 * @description: 滚动到底，加载文章数据 
 * @return {object}
 */
async function lazyLoading() {
    // 滚动到底部，再加载的处理事件
    // 获取 可视区高度`、`滚动高度`、`页面高度`
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let clientHeight = document.documentElement.clientHeight;
    let scrollHeight = document.documentElement.scrollHeight;
    if (scrollTop + clientHeight >= scrollHeight - 200) { // 滚动到底部，逻辑代码
        //事件处理
        if (newApi.value) return
        newApi.value = true
        if (queryInfo.offset < count.value) {
            queryInfo.offset += queryInfo.limit
            loading.value = true
            setTimeout(async () => {
                const res = await getAllArticleApi(queryInfo)
                count.value = res.count
                if (res.code === 200) {
                    articleList.push(...res.data)

                    newApi.value = false
                    loading.value = false
                    if (res.data.length == 0) {
                        emptyShow.value = true
                    }
                }
            }, 400);
        }

    }
}



// 文章信息列表
let articleList: Array<any> | Array<{
    id: number,
    title: string,
    content: string,
    cover_url: string,
    nickname: string,
    user_id: number,
    createdAt: string,
    introduction: string,
    like: number,
    pageviews: number,
    comments: number
    updatedAt: string
}> = reactive([])
// 文章总数
const count = ref(0)
// 文章分页信息
const queryInfo = reactive({
    offset: 0,
    limit: 15
})



// 获取文章列表
async function getAticleList() {
    try {
        const res = await getAllArticleApi(queryInfo)
        if (res.code === 200) {
            articleList.push(...res.data)
            count.value = res.count
        }
    } catch (error) {
        console.log('获取文章数据失败', error)
    }
}

// 没有introduction时对content的操作
const _toChString = (str: string) => str.replace(/([^\u4e00-\u9fa5 。，’‘、？！&%{}（）])/g, "")


// 路由跳转-->article
async function toAticle(id: number) {
    await aticleStore.getArticleIno(id)
    router.push('/home/article')
    incrementApi({ id, increment_item: "pageviews" })
}

// 点赞 或 递增浏览量
async function increment(increment_item: "like" | "pageviews", article: any, index: number) {
    const res = await incrementApi({ id: article.id, increment_item })
    articleList[index] = res.data
}

// 进入评论区
async function toComment() {
    router.push({
        name: "article",
        params: {
            toComment: "toComment"
        }
    })
}


</script>
    
<style lang='less' scoped>
// 文章
.article {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 720px;
    height: 140px;
    // background-color: rgb(238, 235, 235);
    padding: 12px 20px 0 20px;
    font-size: 14px;
    color: rgb(134, 144, 156);

    .info {
        line-height: 22px;
        font-size: 14px;
        color: rgb(144, 144, 144);

        span {
            // padding-left: 10px;
            padding-right: 10px;
        }

        span:nth-child(n+2) {
            padding-left: 10px;
            border-left: 1px solid rgba(144, 144, 144, .25);
        }
    }

    .content {
        width: 680px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(228, 230, 235, .8);
        // margin-top: 10px;
        height: 97px;
        // background-color: pink;
        padding-bottom: 10px;

        .l {
            flex: 1;
            // width: 516px;
            width: 78%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 84px;

            .title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: rgb(29, 33, 41);
                font-size: 16px;
                font-weight: 700;
                line-height: 24px;
            }

            p {
                line-height: 22px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .floot {
                line-height: 22px;
            }
        }

        img {
            width: 120px;
            height: 80px;
            margin-left: 24px;
        }

        .floot {
            // width: 190px;
            // display: flex;
            line-height: 20px;
            height: 20px;
            justify-content: space-between;

            >button {

                background-color: transparent;
                margin-right: 15px;
                color: rgb(134, 144, 156);

                .el-icon,
                .icon-dianzan {
                    // margin-left: 8px;
                    vertical-align: -1px;
                    margin-right: 3px;
                }

                .icon-dianzan {
                    vertical-align: 1px;
                }


            }
        }
    }

}

// 没有更多
.empty {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70px;
    margin: 20px 0;
    font-family: "Lato";
    color: #1d1d1d;

    img {
        width: 200px;
    }

    body {

        margin: 0;
        padding: 0;
    }

    .loader {
        // position: absolute;
        // left: 50%;
        // top: 50%;
        width: 48px;
        height: 48px;
        margin-right: 15px;

        border-radius: 100%;
        -webkit-animation-name: loader;
        animation-name: loader;
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-animation-duration: 4s;
        animation-duration: 4s;
    }

    .loader .side {
        display: block;
        width: 6px;
        height: 20px;
        background-color: #046380;
        margin: 2px;
        position: absolute;
        border-radius: 50%;
        -webkit-animation-duration: 1.5s;
        animation-duration: 1.5s;
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
        -webkit-animation-timing-function: ease;
        animation-timing-function: ease;
    }

    .loader .side:nth-child(1),
    .loader .side:nth-child(5) {
        transform: rotate(0deg);
        -webkit-animation-name: rotate0;
        animation-name: rotate0;
    }

    .loader .side:nth-child(3),
    .loader .side:nth-child(7) {
        transform: rotate(90deg);
        -webkit-animation-name: rotate90;
        animation-name: rotate90;
    }

    .loader .side:nth-child(2),
    .loader .side:nth-child(6) {
        transform: rotate(45deg);
        -webkit-animation-name: rotate45;
        animation-name: rotate45;
    }

    .loader .side:nth-child(4),
    .loader .side:nth-child(8) {
        transform: rotate(135deg);
        -webkit-animation-name: rotate135;
        animation-name: rotate135;
    }

    .loader .side:nth-child(1) {
        top: 24.14213562373095px;
        left: 48px;
        margin-left: -3px;
        margin-top: -10px;
        -webkit-animation-delay: 0;
        animation-delay: 0;
    }

    .loader .side:nth-child(2) {
        top: 41.21320343109277px;
        left: 41.21320343109277px;
        margin-left: -3px;
        margin-top: -10px;
        -webkit-animation-delay: 0;
        animation-delay: 0;
    }

    .loader .side:nth-child(3) {
        top: 48px;
        left: 24.14213562373095px;
        margin-left: -3px;
        margin-top: -10px;
        -webkit-animation-delay: 0;
        animation-delay: 0;
    }

    .loader .side:nth-child(4) {
        top: 41.21320343109277px;
        left: 7.07106781636913px;
        margin-left: -3px;
        margin-top: -10px;
        -webkit-animation-delay: 0;
        animation-delay: 0;
    }

    .loader .side:nth-child(5) {
        top: 24.14213562373095px;
        left: 0px;
        margin-left: -3px;
        margin-top: -10px;
        -webkit-animation-delay: 0;
        animation-delay: 0;
    }

    .loader .side:nth-child(6) {
        top: 7.07106781636913px;
        left: 7.07106781636913px;
        margin-left: -3px;
        margin-top: -10px;
        -webkit-animation-delay: 0;
        animation-delay: 0;
    }

    .loader .side:nth-child(7) {
        top: 0px;
        left: 24.14213562373095px;
        margin-left: -3px;
        margin-top: -10px;
        -webkit-animation-delay: 0;
        animation-delay: 0;
    }

    .loader .side:nth-child(8) {
        top: 7.07106781636913px;
        left: 41.21320343109277px;
        margin-left: -3px;
        margin-top: -10px;
        -webkit-animation-delay: 0;
        animation-delay: 0;
    }

    @-webkit-keyframes rotate0 {
        0% {
            transform: rotate(0deg);
        }

        60% {
            transform: rotate(180deg);
        }

        100% {
            transform: rotate(180deg);
        }
    }

    @keyframes rotate0 {
        0% {
            transform: rotate(0deg);
        }

        60% {
            transform: rotate(180deg);
        }

        100% {
            transform: rotate(180deg);
        }
    }

    @-webkit-keyframes rotate90 {
        0% {
            transform: rotate(90deg);
        }

        60% {
            transform: rotate(270deg);
        }

        100% {
            transform: rotate(270deg);
        }
    }

    @keyframes rotate90 {
        0% {
            transform: rotate(90deg);
        }

        60% {
            transform: rotate(270deg);
        }

        100% {
            transform: rotate(270deg);
        }
    }

    @-webkit-keyframes rotate45 {
        0% {
            transform: rotate(45deg);
        }

        60% {
            transform: rotate(225deg);
        }

        100% {
            transform: rotate(225deg);
        }
    }

    @keyframes rotate45 {
        0% {
            transform: rotate(45deg);
        }

        60% {
            transform: rotate(225deg);
        }

        100% {
            transform: rotate(225deg);
        }
    }

    @-webkit-keyframes rotate135 {
        0% {
            transform: rotate(135deg);
        }

        60% {
            transform: rotate(315deg);
        }

        100% {
            transform: rotate(315deg);
        }
    }

    @keyframes rotate135 {
        0% {
            transform: rotate(135deg);
        }

        60% {
            transform: rotate(315deg);
        }

        100% {
            transform: rotate(315deg);
        }
    }

    @-webkit-keyframes loader {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes loader {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }





    @keyframes rotate {
        0% {
            transform: translate(-50%, -50%) rotate(0);
        }

        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }


}

// 加载动画
.loading {
    width: 100%;
    height: 100px;
    margin: 20px 0;
    position: relative;


    .loader {
        position: absolute;
        top: 50%;
        left: 40%;
        margin-left: 10%;
        transform: translate3d(-50%, -50%, 0);
    }

    .dot {
        width: 24px;
        height: 24px;
        background: #3ac;
        border-radius: 100%;
        display: inline-block;
        animation: slide 1s infinite;
    }

    .dot:nth-child(1) {
        animation-delay: 0.1s;
        background: #32aacc;
    }

    .dot:nth-child(2) {
        animation-delay: 0.2s;
        background: #64aacc;
    }

    .dot:nth-child(3) {
        animation-delay: 0.3s;
        background: #96aacc;
    }

    .dot:nth-child(4) {
        animation-delay: 0.4s;
        background: #c8aacc;
    }

    .dot:nth-child(5) {
        animation-delay: 0.5s;
        background: #faaacc;
    }

    @-moz-keyframes slide {
        0% {
            transform: scale(1);
        }

        50% {
            opacity: 0.3;
            transform: scale(2);
        }

        100% {
            transform: scale(1);
        }
    }

    @-webkit-keyframes slide {
        0% {
            transform: scale(1);
        }

        50% {
            opacity: 0.3;
            transform: scale(2);
        }

        100% {
            transform: scale(1);
        }
    }

    @-o-keyframes slide {
        0% {
            transform: scale(1);
        }

        50% {
            opacity: 0.3;
            transform: scale(2);
        }

        100% {
            transform: scale(1);
        }
    }

    @keyframes slide {
        0% {
            transform: scale(1);
        }

        50% {
            opacity: 0.3;
            transform: scale(2);
        }

        100% {
            transform: scale(1);
        }
    }

}
</style>