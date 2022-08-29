<template>
    <!-- 选项导航 -->
    <div class="header">
        <span @click="order = 'recommended'" :class="{ active: order === 'recommended' }">推荐</span>
        <span @click="order = 'theLatest'" :class="{ active: order === 'theLatest' }">最新</span>
        <span @click="order = 'hotList'" :class="{ active: order === 'hotList' }">热榜</span>
    </div>

    <!-- 文章列表 -->
    <div class="article" v-for="(article, index) in articleList" :key="article.id" @click="toAticle(article.id)">
        <!-- 作者名  创建时间 -->
        <div class="info">
            <span class="nickname" @click.stop="toOtherUser(article.user.id)">{{  article.user.nickname  }}</span>
            <span>{{  timeAgo(article.createdAt)  }}</span>
        </div>
        <!-- 文章相关内容 -->
        <div class="content">
            <div class="l">
                <!-- 标题 -->
                <h4 class="title">{{  article.title  }}</h4>
                <!-- 简介 -->
                <p> {{  article.introduction ? article.introduction : _toChString(article.content)  }} </p>
                <!-- 文章访问信息 -->
                <div class="floot">
                    <!-- 浏览量 -->
                    <button>
                        <el-icon>
                            <View />
                        </el-icon>
                        <i>{{  article.pageviews  }}</i>
                    </button>
                    <!-- 点赞 -->
                    <button @click.stop="add_of_delete_like(article.id, index)">
                        <i class="iconfont" :class="{
                            'icon-dianzan': !article.articleLikes.includes(userStore.userInfo.id),
                            'icon-dianzan_kuai': article.articleLikes.includes(userStore.userInfo.id)
                        }"> </i>
                        <i>{{  article.like  }}</i>
                    </button>
                    <!-- 去评论区 -->
                    <button @click="toComment">
                        <el-icon>
                            <ChatLineRound />
                        </el-icon>
                        {{  article.comments  }}
                    </button>
                    <!-- 编辑或删除 -->
                    <el-dropdown v-if="route.path == '/home/personalcenter/userarticle'" trigger="click"
                        @command="handleCommand">
                        <span class="iconfont icon-qita" @click.stop=""></span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item :command="{ article_id: article.id, command: 'editor' }">编辑
                                </el-dropdown-item>
                                <el-dropdown-item :command="{ article_id: article.id, command: 'delete' }">删除
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <!-- 封面 -->
            <img :src="BASEURL + article.cover_url" alt="" v-if="article.cover_url">
        </div>
    </div>

    <!-- 没有文章显示空 -->
    <el-empty v-if="articleList.length === 0" description="空" />

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
        {{  route.path === '/home/index' ? '我也是有底线哦...' : ' '  }}
    </div>

    <!--回到顶部 -->
    <el-backtop :bottom="80">
        <i class="iconfont icon-18huidaodingbu"></i>
    </el-backtop>
</template>
    
<script setup lang='ts'>
import timeAgo from '@/utils/timeAgo'
import { BASEURL } from "@/const/VARIABLE"
import { getAllArticleApi, addPageviewsApi, getUserArticleApi, getCollectArticleListApi, getLikeArticleListApi, getFovusOnArticleListApi, getArticlebySearchApi, deleteArticleApi, changeLike } from '@/api/article';
import { useArticleStore } from '@/stores/article';
import { ChatLineRound, View, } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { successNotify, warningNotify } from '@/utils/notification';
import { useUpComponentsStore } from '@/stores/upComponents';
const articleStore = useArticleStore()
const router = useRouter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const route = useRoute()
const up = useUpComponentsStore()

onMounted(() => {
    // 挂载时获取文章列表
    getAticleList()
    // 滚动到底再加载的处理事件
    window.addEventListener('scroll', lazyLoading);

})

onBeforeRouteLeave((to, from, next) => {
    window.removeEventListener('scroll', lazyLoading)
    next()
})



// 是否在发送请求获取文章
const isRequesting = ref<boolean>(false)
// 显示 加载中
const loading = ref<boolean>(false)
// 显示没有更多
const emptyShow = ref<boolean>(false)


// 滚动到底，加载文章数据 ，动态判断是否显示“回到顶部”
async function lazyLoading() {
    // 滚动到底部，再加载的处理事件
    // 获取 可视区高度`、`滚动高度`、`页面高度`
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let clientHeight = document.documentElement.clientHeight;
    let scrollHeight = document.documentElement.scrollHeight;
    if (scrollTop + clientHeight >= scrollHeight - 200) { // 滚动到底部，逻辑代码
        //事件处理
        if (queryInfo.offset < count.value) {
            if (isRequesting.value) return
            isRequesting.value = true
            queryInfo.offset += queryInfo.limit
            loading.value = true
            setTimeout(async () => {
                const res = await getAticleList()
                count.value = res.count
                if (res.code === 200) {
                    articleList.push(...res.data)
                    isRequesting.value = false
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
    introduction: string,
    pageviews: number,
    comments: number
    createdAt: string,
    like: number,
    user: Array<{
        id: number
        nickname: string,
        avatar: string
    }>,
    articleLikes: Array<number>
}> = reactive([])

// 文章总数
const count = ref(0)

// 文章分页信息
const queryInfo = reactive({
    offset: 0,
    limit: 7,
    order: JSON.stringify([['like', 'DESC']]),
})

// 获取文章方式  推荐（热）/ 最新 / 热榜(热+新)
const order = ref<'recommended' | "theLatest" | "hotList">('recommended')


// 监控 -->获取文章方式
watch(order, (newValue) => {
    if (newValue === 'recommended') {
        queryInfo.order = JSON.stringify([['like', 'DESC'], ['pageviews', 'DESC']])
    } else if (newValue === "theLatest") {
        queryInfo.order = JSON.stringify([['createdAt', 'DESC']])
    } else if (newValue === "hotList") {
        queryInfo.order = JSON.stringify([['pageviews', 'DESC'], ['like', 'DESC'], ['createdAt', 'DESC']])
    }
    queryInfo.offset = 0
    getAticleList("clear")
})

// 获取文章列表
async function getAticleList(clear?: string) {
    // 返回文章信息
    let res
    const path = route.path
    const user_id = userStore.is_self ? userStore.userInfo.id : userStore.otherInfo.id
    const querys = Object.assign({ user_id }, queryInfo)
    try {
        switch (path) {
            case '/home/index':
                // 搜索
                if (route.query.search) {
                    const search: string = route.query.search as string
                    res = await getArticlebySearchApi(Object.assign({ search }, queryInfo))
                    // 首页
                } else {
                    res = await getAllArticleApi(queryInfo)
                }
                break;
            // 个人用户发布的文章
            case '/home/personalcenter/userarticle':
                res = await getUserArticleApi(querys)
                break;
            // 个人用户收藏的文章
            case '/home/personalcenter/usercollect':
                res = await getCollectArticleListApi(querys)
                break;
            // 个人用户点赞的文章
            case '/home/personalcenter/userlike':
                res = await getLikeArticleListApi(querys)
                break;
            // 个人用户关注所有用户的文章列表
            case '/home/focuson':
                res = await getFovusOnArticleListApi(querys)
                break;
            default:
                break;
        }
    } catch (error) {
        console.log('error', error)
    }

    if (res.code == 200) {
        if (clear == 'clear') {
            articleList.length = 0
        }
        articleList.push.apply(articleList, res.data)
        count.value = res.count
    }
    return res
}

// 没有introduction时对content的操作
const _toChString = (str: string) => str.replace(/([^\u4e00-\u9fa5 。，’‘、？！&%{}（）])/g, "")


// 路由跳转-->article
async function toAticle(id: number) {
    try {
        await articleStore.getArticleIno(id)
        router.push('/home/article')
        addPageviewsApi(id)
    } catch (error) {
        console.log('error', error)
    }
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

// 用户是否点赞 返回(true点赞)(false取消点赞)
async function add_of_delete_like(article_id: number, index: number) {
    const res = await changeLike({ article_id, user_id: userStore.userInfo.id })
    if (res.data) {
        articleList[index].like++
        articleList[index].articleLikes.push(userStore.userInfo.id)
    } else {
        articleList[index].like--
        const i = articleList[index].articleLikes.indexOf(userStore.userInfo.id)
        articleList[index].articleLikes.splice(i, 1)
    }
}

// 去文章作者的个人中心页
async function toOtherUser(user_id: number) {
    if (user_id != userInfo.value.id) {
        userStore.is_self = false
        await userStore.getOtherInfo(user_id)
    } else {
        userStore.is_self = true
    }
    router.push(`/home/personalcenter`);
}

//编辑或删除 
async function handleCommand(c: { article_id: number, command: string }) {
    const { command, article_id } = c
    switch (command) {
        case 'editor':
            await articleStore.getArticleIno(article_id)
            router.push(`/home/postarticle?editor=${Date.now()}`)
            break;
        case 'delete':
            const res = await deleteArticleApi(article_id)
            if (res.code == 200) {
                successNotify(res)
                articleList.splice(articleList.findIndex(item => item.id == article_id), 1)
                up.upUserStatistical++
            } else {
                warningNotify(res)
            }
            break;
        default:
            break;
    }
}

</script>
    
<style lang='less' scoped>
.header {
    height: 45px;
    line-height: 45px;
    padding-left: 15px;
    font-size: 14px;
    color: rgb(144, 144, 144);
    border-bottom: 1px solid rgba(151, 151, 151, .15);

    span {
        cursor: pointer;
        padding: 0 15px;
    }

    span:nth-child(n+2) {
        border-left: 1px solid rgba(144, 144, 144, .25);
    }

    .active {
        color: #007fff;
    }
}

// 文章
.article {
    cursor: pointer;
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

        .nickname {
            color: rgb(78, 89, 105);
            cursor: pointer;
        }

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
        // width: 680px;
        width: 100%;
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
            line-height: 20px;
            height: 20px;
            justify-content: space-between;
            color: #4e5969;

            >button {

                min-width: 28px;
                background-color: transparent;
                margin-right: 15px;
                // color: rgb(134, 144, 156);
                color: #4e5969;


                .el-icon,
                .icon-dianzan,
                .icon-dianzan_kuai {
                    // margin-left: 8px;
                    vertical-align: -1px;
                    margin-right: 3px;
                }

                .icon-dianzan,
                .icon-dianzan_kuai {
                    vertical-align: 1px;
                }

                // 点赞(true的样式)
                .icon-dianzan_kuai {
                    color: #1e80ff;
                }


            }

            .icon-qita {
                font-size: 13px;
                padding: 4px 8px;
            }
        }
    }

}

// 没有更多
.empty {
    text-align: center;
    height: 30px;
    color: rgb(134, 144, 156);
    font-size: 14px;
    line-height: 30px;
}

// 加载动画
.loading {
    width: 100%;
    height: 30px;
    // margin: 20px 0;
    position: relative;


    .loader {
        position: absolute;
        top: 50%;
        left: 40%;
        margin-left: 10%;
        transform: translate3d(-50%, -50%, 0);
    }

    .dot {
        width: 10px;
        height: 10px;
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