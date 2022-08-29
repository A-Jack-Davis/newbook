<template>
    <div class="main">
        <div class="item">
            <h4>
                <!-- <i class="iconfont icon-jinpai1"> </i> -->
                🎖️作者榜
            </h4>
            <div class="author" v-for="(author, index) in authorList" :key="author.id" @click="toUser(author.id)">
                <img :src="BASEURL + author.avatar" alt="">
                <div class="content">
                    <div class="username">{{ author.nickname }}</div>
                    <div class="describe">
                        <span class="likes">{{ author.likes }}赞</span>
                        <span class="pageviews">{{ author.pageviews }}阅读</span>
                    </div>
                </div>
            </div>

            <!-- 查看完整榜单 -->
            <div class="thefullList">
                <span @click="$router.push('/home/authors')">完整榜单<i class="iconfont icon-xiangyou1"></i></span>
            </div>
        </div>

    </div>
</template>
    
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"
import { getAuthorListApi } from '@/api/user';
import { onMounted, reactive } from 'vue';
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
const userStore = useUserStore()
const router = useRouter()
onMounted(() => {
    getAuthorList()
})

// 获取作者榜单
async function getAuthorList() {
    const res = await getAuthorListApi(queryInfo)
    if (res.code == 200) {
        authorList.splice(0, 1)
    }
    authorList.push(...res.data)
}
// 作者榜单
const authorList = reactive<[{
    id: number,
    nickname: string,
    avatar: string,
    likes: number,
    pageviews: number
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
    limit: 5,
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


</script>
    
<style lang='less' scoped>
.main {
    background-color: #fff;

    .item {

        >h4 {
            // height: 42px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 400;
            border-bottom: 1px solid hsla(0, 0%, 59.2%, .1);
            color: #333;
            margin-bottom: 5px;

            .icon-jinpai1 {
                margin-right: 5px;
                font-size: 18px;
            }
        }

        .author {
            display: flex;
            padding: 14px 20px;
            cursor: pointer;

            >img {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                margin-right: 10px;
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

        .thefullList {
            cursor: pointer;
            margin-top: 16px;
            height: 48px;
            text-align: center;
            color: #007fff;
            font-size: 14px;
            line-height: 48px;
            border-top: 1px solid hsla(0, 0%, 59.2%, .1);

            .icon-xiangyou1 {
                font-size: 13px;
            }
        }
    }
}

.icon-jinpai1 {
    color: #ffb02e;
}
</style>