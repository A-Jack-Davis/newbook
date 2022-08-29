<template>
    <div class="container">
        <div class="achievement_box">
            <h4>个人成就</h4>
            <ul class="achievement">
                <li><i class="iconfont icon-dianzan_kuai"></i><span>文章被点赞&#8194;{{
                        articleStore.articleStatistical.likeCount
                }}</span>
                </li>
                <li><i class="iconfont icon-yanjing2"></i><span>文章被阅读&#8194;{{
                        articleStore.articleStatistical.pageviewsCount
                }}</span>
                </li>
                <li><i class="iconfont icon-shoucang-shoucang"></i><span>文章被收藏&#8194;{{
                        articleStore.articleStatistical.collectionCount
                }}</span>
                </li>
                <li><i class="iconfont icon-fabuxiaoxi"></i><span>发布文章数&#8194;{{
                        articleStore.articleStatistical.articleCount
                }}</span>
                </li>
            </ul>
        </div>

        <div class="focus_on">
            <div class="l" @click="$router.push('/home/personalcenter/userfocuson?t=4')">
                <span>关注了</span> <span class="top8">{{
                        userStore.focusList.length
                }}</span>
            </div>
            <div class="r" @click="$router.push('/home/personalcenter/userfans?t=5')">
                <span>关注者</span> <span class="top8">{{ userStore.fansList.length }}</span>
            </div>
        </div>

        <div class="registered_in">
            <i class="iconfont icon-TAzhucedengji"></i>
            <span>注册于：</span>
            <span class="time">{{ regTime()
            }}</span>
        </div>

    </div>
</template>
    
<script setup lang='ts'>
import { useArticleStore } from '@/stores/article';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';

const userStore = useUserStore()
const articleStore = useArticleStore()

onMounted(() => {
    getStatistical()
    userStore.getFans_List()
    userStore.getFocus_List()
})



// 获取文章统计信息
async function getStatistical() {
    let user_id = userStore.is_self ? userStore.userInfo.id : userStore.otherInfo.id
    articleStore.getArticleStatistical(user_id)
}

// 注册时间
function regTime() {
    let time = userStore.is_self ? userStore.userInfo.createdAt : userStore.otherInfo.createdAt
    return time.slice(0, 10)
}

</script>
    
<style lang='less' scoped>
.container {
    width: 290px;

    .achievement_box {
        width: 100%;
        // height: 200px;
        background-color: #fff;

        h4 {
            font-weight: 600;
            color: #31445b;
            font-size: 16px;
            line-height: 20px;
            padding: 16px;
            border-bottom: 1px solid rgba(230, 230, 231, .5);
        }

        .achievement {
            height: 176px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            list-style: none;
            padding: 16px;

            li {
                display: flex;
                align-items: center;

                i {
                    text-align: center;
                    display: inline-block;
                    color: #7bb9ff;
                    background-color: #e1efff;
                    width: 26px;
                    height: 26px;
                    line-height: 26px;
                    border-radius: 50%;
                    margin-right: 12px;
                }

                font-size: 15px;
                line-height: 20px;
            }
        }
    }

    .focus_on {
        display: flex;
        width: 100%;
        height: 76px;
        background-color: #fff;
        margin-top: 20px;
        font-size: 16px;

        .l,
        .r {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 50%;
            color: #31445b;

            .top8 {
                margin-top: 6px;
            }
        }



    }

    .registered_in {
        margin-top: 20px;
        background-color: #fff;
        // height: 40px;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;

        .icon-TAzhucedengji {
            color: #0085ff;
            margin-right: 15px;
        }

        .time {
            margin-left: 20px;
        }
    }
}
</style>