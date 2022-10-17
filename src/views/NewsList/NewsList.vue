<template>
    <div style="height:40px ;"> </div>
    <div class="newnav">
        <div class="nav" @click.stop="">
            <div class="rolling">
                <!-- 当前频道 -->
                <div class="channel">
                    <i class="iconfont icon-pindao"></i><span>{{ channelobj?.name }}</span>
                </div>
                <!-- 滚动频道 -->
                <div class="channels">
                    <ScrollNavigation :channelList="channelList" @channel="getChannel"></ScrollNavigation>
                </div>
                <!-- 下拉图标 -->
                <div class="down" @click="show_channel = !show_channel">
                    <i class="iconfont icon-shouzhankaiqi"> </i>
                </div>
            </div>

            <!-- 下拉频道 -->
            <div class="all_channel clearfix" :class="{ up: !show_channel, down: show_channel }"
                @click="getChannelIndex($event)">
                <div class="item" v-for="(channel, index) in channelList" :key="channel.channelId">
                    <i :data-index="index" :class="{ active: channelIndex == index }"> {{ channel.name }}</i>
                </div>
            </div>
        </div>
    </div>


    <div class="container">
        <!-- 新闻列表 -->
        <div class="newsist" @click.capture="toNews($event)">
            <!-- 新闻item -->
            <div class="news" v-for="(news, index) in newsInfo" :key="index" :data-newsid="news.id">
                <!-- 标题 -->
                <h4 class="title"> {{ news.title }}</h4>
                <!-- 内容 -->
                <div class="content">
                    <div class="newscontent">
                        <p>{{ news.content }}</p>
                        <!-- 来源和时间 -->
                        <div class="describe">
                            <span>{{ news.source }}</span>
                            <i> {{ timeAgo(news.pubDate) }}</i>
                        </div>
                    </div>
                    <!-- 封面 -->
                    <img :src="news.img" alt="">
                </div>
            </div>
        </div>
    </div>


    <!-- 加载动画 -->
    <div v-show="loading">
        <Loading></Loading>
    </div>
    <!--回到顶部 -->
    <Backtop></Backtop>
</template>
    
<script setup lang='ts'>
import { getNewsChannelApi, getNewsApi, getNewsByTitleApi } from '@/api/onlineApi';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import timeAgo from '@/utils/timeAgo'
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const route = useRoute()

// 路由跳转到新闻页
function toNews(e: Event) {
    const newsBox = Array.from((e as any).path)
    let newsid: string = ''
    for (let i = 0; i < newsBox.length; i++) {
        const item = newsBox[i];
        if (item instanceof HTMLElement) {
            newsid = item.getAttribute('data-newsid') as string
            if (newsid) {
                break
            }
        }
    }
    router.push(`/home/news?newsid=${newsid}`)
}

// 是否下拉
const show_channel = ref(false)
// 新闻列表
const channelList = reactive<Array<{
    channelId: string,
    name: string
}>>([])
// 频道索引
const channelIndex = ref<number>(1)
// 频道对象
const channelobj = computed(() => channelList[channelIndex.value])
// 新闻查询对象
const newsQueryInfo = reactive({
    channelId: '',
    page: 1,
    maxResult: 20,
    needHtml: 0,
    needAllList: 0,
    needContent: 1,
})

// 通过标题查询新闻 查询对象
const newsQueryInfoByTitle = reactive({
    channelId: '',
    page: 1,
    maxResult: 20,
    needHtml: 0,
    needAllList: 0,
    needContent: 1,
    title: ''
})

// 新闻列表
const newsInfo = reactive<Array<{
    channelId: string,
    channelName: string,
    havePic: false
    id: string,
    imageurls: Array<any>
    link: string
    pubDate: string
    source: string
    title: string,
    img?: string,
    content: string
}>>([])

onMounted(async () => {
    _getChannelList()
    document.body.addEventListener('click', (e) => {
        show_channel.value = false
    })
    window.addEventListener('scroll', lazyLoading)
})

// 监控频道变化获取新闻列表
watch(channelIndex, (newValue, oldValue) => {
    newsQueryInfo.channelId = channelList[newValue]?.channelId
    newsInfo.length = 0
    _getNewsTitle()
}, { immediate: true })

// 搜索（title）条件改变 发送请求获取新闻列表
watch(() => route.query.title, (newValue, oldValue) => {
    newsInfo.length = 0
    _getNewsTitle()
})

// 获取频道
async function _getChannelList() {
    channelList.push(...(await getNewsChannelApi()).showapi_res_body.channelList)
}

// 根据不同情况获取新闻列表
async function _getNewsTitle() {
    let res: any
    // 搜索
    if (route.query.title) {
        newsQueryInfoByTitle.title = route.query.title as string
        res = await getNewsByTitleApi(newsQueryInfoByTitle)
    } else {//频道
        res = await getNewsApi(newsQueryInfo)
    }
    const { allNum, contentlist } = res.showapi_res_body.pagebean
    newsInfo.push(...contentlist)
    return true
}

// 处理channel的自定义事件
async function getChannel(channel_index: number) {
    channelIndex.value = channel_index
}

// 处理channel的click事件
function getChannelIndex(e: Event) {
    const channel_index = (e.target as HTMLElement).getAttribute('data-index')
    if (channel_index !== null) {
        channelIndex.value = Number(channel_index)
    }

}

// 是否在发送请求获取文章
const isRequesting = ref<boolean>(false)
// 显示 加载中
const loading = ref<boolean>(false)

// 滚动到底，加载文章数据 ，动态判断是否显示“回到顶部”
async function lazyLoading() {
    // 滚动到底部，再加载的处理事件
    // 获取 可视区高度`、`滚动高度`、`页面高度`
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let clientHeight = document.documentElement.clientHeight;
    let scrollHeight = document.documentElement.scrollHeight;
    if (scrollTop + clientHeight >= scrollHeight - 200) { // 滚动到底部，逻辑代码
        //事件处理
        if (isRequesting.value) return
        isRequesting.value = true
        loading.value = true
        newsQueryInfo.page += 1
        setTimeout(async () => {
            const res = await _getNewsTitle()
            if (res) {
                isRequesting.value = false
                loading.value = false
            }
        }, 400);
    }
}



</script>
  
<style lang='less' scoped>
.container {
    width: 900px;
    min-height: 900px;
    margin: 0 auto;
    background-color: #fff;


}




.newnav {
    background-color: #fff;
    position: fixed;


    width: 100%;
    top: 60px;


    .nav {

        // width: 1120px;
        max-width: 1120px;
        margin: 0 auto;
        height: auto;

        .rolling {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 6px 18px 0;

            .channel {
                width: 120px;
                height: 30px;
                display: flex;
                align-items: center;


                .iconfont {
                    font-size: 30px;
                    margin-right: 5px;
                }

                span {
                    font-size: 14px;
                    color: blue;
                    font-weight: 500;
                }
            }

            .channels {
                // flex: 1;
                width: 76%;
            }

            .down {
                width: 30px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                margin-left: 60px;

                i {
                    cursor: pointer;
                    font-size: 24px;
                    color: rgb(28, 120, 120);
                }
            }
        }

        .all_channel {
            margin-top: 6px;
            // padding-top: 10px;
            overflow: hidden;

            .item {
                user-select: none;
                text-align: center;
                width: 160px;
                padding: 0 6px;
                line-height: 30px;
                font-size: 15px;
                float: left;

                i {
                    cursor: pointer;
                }
            }
        }
    }
}


.newsist {
    padding: 30px 40px;

    .news {
        cursor: pointer;
        margin-bottom: 35px;



        .title {
            line-height: 26px;
            margin: 0px 0px 5px;
        }




        .content {

            display: flex;
            align-items: flex-start;


            .newscontent {



                p {
                    text-indent: 2em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                }

                .describe {
                    margin-top: 4px;
                    font-size: 13px;
                    color: #666;

                    i {
                        margin-left: 20px;
                    }
                }
            }

            img {
                max-width: 20%;
                max-height: 99px;
                margin-left: 20px;
                align-self: flex-end;
            }
        }
    }
}

.up {
    height: 0;
    transition: all .5s;
}

.down {
    height: 220px;
    transition: all .5s;

}

.active {
    color: rgb(62, 35, 240);
}






// .wrap-outer {
//     margin-left: calc(100vw - 100%);
// }
</style>