<template>
    <!-- 悬浮标题 -->
    <el-affix :offset="0" @change="affixChange" style="position:absolute ; top: 200px;">
        <transition name="fade">
            <div class="affix_title" v-show="affixIsShow"> {{ newsInfo.title }} </div>
        </transition>
    </el-affix>
    <!-- 文章内容 -->
    <div class="news">
        <h4 class="title">{{ newsInfo.title }}</h4>
        <div class="newsinfo">
            <i>{{ formatTime(newsInfo.pubDate) }}</i>
            <span>来源：<a target="_blank" :href="newsInfo.link"> {{ newsInfo.source }}</a></span>
        </div>
        <div class="content" v-html="newsInfo.html"></div>
    </div>

    <!--回到顶部 -->
    <Backtop></Backtop>
</template>
    
<script setup lang='ts'>
import { getNewsByIdApi } from '@/api/onlineApi';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()

// 动态标题
const affixIsShow = ref(false)
function affixChange(fixed: boolean) {
    affixIsShow.value = fixed
}

onMounted(() => {
    getNewsById()
})

// 新闻查询参数
const newsQueryInfo = reactive({
    id: '',
    needHtml: 1,
    needAllList: 0,
})

// 新闻内容
const newsInfo = reactive({
    id: '',
    title: "",
    desc: "",
    img: "",
    html: "",
    channelName: "",
    link: "",
    pubDate: "",
    source: "",
})

// 获取新闻内容
async function getNewsById() {
    newsQueryInfo.id = route.query.newsid as string
    const res = await getNewsByIdApi(newsQueryInfo)
    const { id, channelName, html, link, pubDate, source, title, img, desc } = res.showapi_res_body.pagebean.contentlist[0]
    Object.assign(newsInfo, { id, channelName, html, link, pubDate, source, title, img, desc })
}

// 处理发布时间
function formatTime(time: string) {
    const reg = /[\s-]/
    const timeArr = time.split(reg)
    return `${timeArr[0]}年${timeArr[1]}月${timeArr[2]}日 ${timeArr[3]}`
}
</script>
    
<style lang='less' scoped>
.news {
    width: 900px;
    padding: 20px 40px 100px;
    margin: 0 auto;
    height: auto;
    background-color: #fff;

    .title {
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 20px;
    }

    .newsinfo,
    .newsinfo a {
        color: #b7b7b7;
        font-size: 14px;
        line-height: 40px;

        span {
            margin-left: 20px;
        }
    }

    .newsinfo {
        margin-bottom: 30px;
    }

    .newsinfo a:hover {
        color: red;
    }


    :deep(.content) {

        p {
            margin-bottom: 20px;
            color: #333;
            font-size: 20px;
            line-height: 40px;
            text-indent: 2em;


            img {
                max-width: 80%;
                position: relative;
                left: 50%;
                transform: translateX(-50% - 6em);

                margin: 0 auto;
            }
        }
    }
}



.el-affix {
    width: 100%;
    z-index: 9999;

    .affix_title {
        width: 100%;
        background-color: #fff;
        line-height: 60px;
        font-size: 36px;
        text-align: center;
        font-weight: 600;
        // box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
        // box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    }
}


.fade-leave-from {
    opacity: 1;
    top: 0;
}

.fade-leave-active {
    transition: all .001s;
}

.fade-leave-to {
    opacity: 0;
    top: 0;

}
</style>