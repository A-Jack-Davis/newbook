<template>
    <div class="container">
        <div class="item">
            <!-- <h4><i class="iconfont icon-jinpai1"></i>作者榜🎖️</h4> -->
            <div class="author" v-for="(author) in authorList" :key="author.id" @click="toUser(author.id)">
                <div>
                    <img :src="BASEURL + author.avatar" alt="">
                    <div class="content">
                        <div class="username">{{  author.nickname  }}</div>
                        <div class="describe">
                            <span class="likes">{{  author.likes  }}赞</span>
                            <span class="pageviews">{{  author.pageviews  }}阅读</span>
                        </div>
                    </div>
                </div>

                <button :class="{ hasbeenfocusedon: author.isFocusOn }" @click.stop="attention(author.id)">{{
                     author.isFocusOn ?
                     '已关注' : '关注'


                    }}</button>
            </div>
        </div>
    </div>

    <!-- 没有文章显示空 -->
    <!-- <el-empty v-if="authorList.length === 0" description="空" /> -->

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
        我也是有底线哦...
    </div>
    <!--回到顶部 -->
    <el-backtop :bottom="80">
        <i class="iconfont icon-18huidaodingbu"></i>
    </el-backtop>
</template>
    
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"
import { attentionApi, getAuthorListApi, getFocusUserListApi } from '@/api/user';
import { onMounted, reactive, ref } from 'vue';
import { useUserStore } from "@/stores/user";
import { onBeforeRouteLeave, useRouter } from "vue-router";
const userStore = useUserStore()
const router = useRouter()
onMounted(() => {
    getAuthorList(true)
    window.addEventListener('scroll', lazyLoading);

})
onBeforeRouteLeave((to, from, next) => {
    window.removeEventListener('scroll', lazyLoading)
    next()
})

// 关注者id
const focusList_id = reactive<Array<number>>([])

// 总作者数
const count = ref(0)

// 获取作者榜单
async function getAuthorList(clear?: boolean) {
    const res = await getAuthorListApi(queryInfo)
    let data: any
    if (res.code == 200) {
        if (clear) {
            authorList.splice(0, 1)
        }
        if (res.data.length < 1) {
            return false
        }
        data = await _isFocusOn(res.data)
    }
    authorList.push(...data)
    count.value = res.count
    return true
}
// 标记是否关注
async function _isFocusOn(authors = authorList) {
    let focus_id = await getFocusUserListApi(userStore.userInfo.id)
    focusList_id.length = 0
    focusList_id.push(...focus_id.data.map((item: any) => item.id))
    let data = authors.map(((item: any) => {
        if (focusList_id.includes(item.id)) {
            item.isFocusOn = true
        } else {
            item.isFocusOn = false
        }
        return item
    }))
    return data
}
// 作者榜单
const authorList = reactive<[{
    id: number,
    nickname: string,
    avatar: string,
    likes: number,
    pageviews: number
    isFocusOn?: false
}]>([{
    id: 0,
    nickname: '',
    avatar: '',
    likes: 0,
    pageviews: 0
}])

// 作者榜分页信息
const queryInfo = reactive({
    offset: 0,
    limit: 13,
})

// 去文章作者的个人中心页
async function toUser(user_id: number) {
    if (userStore.userInfo.id != user_id) {
        userStore.is_self = false
        await userStore.getOtherInfo(user_id)
    } else {
        userStore.is_self = true
    }
    router.push(`/home/personalcenter`);
}

// 关注或取消关注
async function attention(follower_id: number) {
    const res = await attentionApi(userStore.userInfo.id, follower_id)
    if (res.code === 200) {
        _isFocusOn()
    }
}

// 是否在发送请求获取文章
const isRequesting = ref<boolean>(false)
// 显示 加载中
const loading = ref<boolean>(false)
// 显示没有更多
const emptyShow = ref<boolean>(false)
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
                const res = await getAuthorList()
                if (res) {
                    isRequesting.value = false
                } else {
                    emptyShow.value = true
                }
                loading.value = false
            }, 400);
        }
    }
}


</script>
    
<style lang='less' scoped>
.container {
    background-color: #fff;
    width: 700px;
    margin: 0 auto;

    .item {
        padding: 6px 28px;

        // >h4 {
        //     // height: 42px;
        //     padding: 12px 20px;
        //     font-size: 14px;
        //     font-weight: 400;
        //     border-bottom: 1px solid hsla(0, 0%, 59.2%, .1);
        //     color: #333;
        //     margin-bottom: 5px;

        //     .icon-jinpai1 {
        //         margin-right: 5px;
        //         font-size: 18px;
        //     }
        // }

        .author {
            display: flex;
            justify-content: space-between;
            padding: 16px 20px;
            cursor: pointer;

            div {
                display: flex;
                // padding: 16px 20px;

                >img {
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    margin-right: 18px;
                }

                .content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    .username {
                        font-weight: 400;
                        color: #333;
                        font-size: 14px;
                        line-height: 24px;
                    }

                    .describe {
                        // display: flex;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: rgb(144, 144, 144);
                        font-size: 12px;

                        .likes {
                            margin-right: 15px;
                        }
                    }
                }
            }

            button {
                background-color: transparent;
                border: hsl(214, 41%, 49%) 1px solid;
                height: 26px;
                font-size: 12px;
                padding: 0px 12px;
                line-height: 26px;
                color: #0c62d2;
            }

            .hasbeenfocusedon {
                border-color: rgb(170, 169, 169);
                color: rgb(142, 142, 142);
            }
        }
    }
}

.icon-jinpai1 {
    color: #ffb02e;
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