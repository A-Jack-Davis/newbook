<template>
    <div class="container">
        <!-- 文章内容区 -->
        <div class="md_preview">
            <!-- 头部标题区 -->
            <div class="content">
                <h4>{{ articleInfo.title }}</h4>
                <!-- 头像/用户名区 -->
                <div class="userdata">
                    <div class="l">
                        <img :src="BASEURL + articleInfo.user_avatar" alt="">
                        <div class="username">
                            <span>{{ articleInfo.nickname }}</span>
                            <span>{{ _getdate(articleInfo.createdAt) }}</span>
                        </div>
                    </div>
                    <el-button class="r" type="primary" size="default" plain>+关注</el-button>
                </div>
                <!-- 封面 -->
                <img :src="BASEURL + articleInfo.cover_url" alt="" class="cover">
                <!-- 简介 -->
                <div class="introduction" v-if="articleInfo.introduction">
                    <p>{{ articleInfo.introduction }}</p>
                </div>
            </div>
            <!-- 文章 -->
            <v-md-preview :text="articleInfo.content" ref="preview"></v-md-preview>
            <!-- 评论区 -->
            <div class="comment">
                <span class="pl">
                    评论
                </span>
                <div class="sub">
                    <!-- 评论框 -->
                    <div>
                        <img :src="BASEURL + userInfo.avatar" alt="">
                        <el-input v-model="comment.content" :autosize="{ minRows: 3, maxRows: 25 }" type="textarea"
                            placeholder="Please input" />
                    </div>
                    <el-button type="primary" @click="releaseComment">发表评论</el-button>
                </div>
                <!-- 评论区组件 -->
                <Comment class="margintop30"></Comment>
            </div>

            <div class="other">

            </div>

        </div>
        <!-- 右侧目录与其他 -->
        <div class="right">
            <div class="box2">
            </div>

            <!-- 目录导航 -->
            <el-affix class="anchor" ref="menu" :offset="80">
                <h4>目录</h4>
                <div class="nav">
                    <div v-for="anchor in titles" :style="{ padding: `8px 0 8px 0` }"
                        @click="handleAnchorClick(anchor)">
                        <a style="cursor: pointer" :line-index="anchor.lineIndex"
                            :style="{ 'padding-left': anchor.indent * 18 + 20 + 'px' }">{{ anchor.title }}</a>
                    </div>
                </div>
            </el-affix>
        </div>

        <!-- 左侧定位区 -->
        <ul class="navigation">
            <li @click="increment_like" class="increment_like">
                <i class="iconfont icon-dianzan_kuai"></i>
                <span class="num"> {{ articleInfo.like }} </span>
            </li>
            <li class="comments" @click="_tocommentBox(0)">
                <i class="iconfont icon-pinglun4"></i>
                <span class="num"> {{ commentsStore.commentList.length }} </span>
            </li>
            <li><i class="iconfont icon-shoucang-shoucang"></i></li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
//#region 
import { BASEURL } from "@/const/VARIABLE"
import { useArticleStore } from '@/stores/article';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, reactive, ref } from 'vue';
import { addComment } from '@/api/comment';
import Comment from '../Comment/Comment.vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { successNotify, warningNotify } from '@/utils/notification';
import { useCommentsStore } from '@/stores/comment';
import { incrementApi } from "@/api/article";
const articleStore = useArticleStore()
const { articleInfo } = storeToRefs(articleStore)
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const commentsStore = useCommentsStore()
const route = useRoute()
//#endregion


onMounted(() => {
    nextTick(() => {
        // 自定义锚点
        anchor()
        // 事件监控： 锚点跟踪相关
        setTimeout(() => {
            // 添加滚动条事件监控
            window.addEventListener('scroll', _getAnchorElementTop)
        }, 400)
        // 使得不滚动的时候初始化目录样式
        setTimeout(_getAnchorElementTop, 0)
    })

    //  进入评论区
    if (route.params.toComment === 'toComment') {
        _tocommentBox(250)
    }





})
onBeforeRouteLeave((to, from, next) => {
    window.removeEventListener('scroll', _getAnchorElementTop)
    next()
})
// 日期格式化
function _getdate(dateStr: string) {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日  ${date.getHours()}:${date.getMinutes()}`
}

//#region 
// 发布评论
const comment = reactive({
    content: "",
    article_id: 0,
    user_id: 0,
    user_name: '',
    user_nickname: "",
    user_avatar: ""
})

// 发布评论
async function releaseComment() {
    if (comment.content.trim() == '') {
        warningNotify({ message: "输入不能为空" })
        return
    }
    comment.article_id = articleInfo.value.id
    comment.user_id = userInfo.value.id
    comment.user_name = userInfo.value.user_name
    comment.user_nickname = userInfo.value.nickname
    comment.user_avatar = userInfo.value.avatar
    try {
        const res = await addComment(comment)
        // 调用子组件方法重新获取评论数据
        if (res.code === 200) {
            successNotify(res)
            commentsStore.getCommentlist(articleStore.articleInfo.id)
            // incrementApi({ id: articleInfo.value.id, increment_item: "like" })
        } else {
            warningNotify(res)
        }
        comment.content = ''
    } catch (error) {
        console.log('发布评论失败', error)
    }
}
//#endregion




let titles = reactive<any>([])
const preview = ref()
//事件监控： 锚点跟踪相关
function _getAnchorElementTop() {
    // 获取v-md-editor中的所有标题信息
    const titleEleList = titles.map((title: any) => {
        let obj = {
            lineIndex: NaN,
            element: null,
            top: NaN,
            innerText: ""
        }
        const { lineIndex } = title
        obj.lineIndex = lineIndex
        obj.element = preview.value!.$el.querySelector(`[data-v-md-line="${lineIndex}"]`)
        obj.top = getTop(obj.element)
        obj.innerText = obj!.element!['innerText']

        function getTop(ele: any) {
            const GDTscrollTop = window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop
            return ele.offsetTop - GDTscrollTop
        }
        return obj
    })

    // 获取v-md-editor中中正在展示的标题
    function _getActiveEle(titleEleList: any) {
        titleEleList.sort((a: any, b: any) => a.top - b.top)

        let minTop = titleEleList.findIndex((titleEle: any) => {
            return titleEle.top > 70 && titleEle.top < 800
        })

        if (minTop == -1) {
            minTop = titleEleList.findIndex((titleEle: any) => {
                return titleEle.top > 800
            })
            minTop -= 1
            if (minTop <= -2) {
                // 滑过头了
                minTop = titleEleList.length - 1
            }
        }
        return titleEleList[minTop]
    }

    // 获取所有目录并移除class
    const eles = Array.from(document.querySelectorAll('[line-index]'))
    eles.forEach((ele: any) => {
        ele.classList.remove('activestyle')
    })

    // 获取当前激活的目录并添加class
    const activeEle: HTMLAnchorElement | null = document.querySelector(`[line-index="${_getActiveEle(titleEleList)?.lineIndex}"]`)

    if (activeEle !== null) {
        activeEle.classList.add('activestyle')
        // 目录滚动条相关
        const el_affix_div: any = document.querySelector('.el-affix >div')
        // 滚动条到顶部距离
        let gdtTop = el_affix_div.scrollTop
        // 激活的《a》到 position: relative; 定位父元素距离
        let aTop = activeEle.offsetTop
        // 滚动元素的  height
        let gdEleH = el_affix_div.offsetHeight
        if (gdEleH - aTop < 50) {
            el_affix_div.scrollTop = aTop - (gdEleH / 2 - 20)
        }
    }
}

// 跳转到评论区
function _tocommentBox(timeout: number) {
    setTimeout(() => {
        _getAnchorElementTop()
        document.querySelector('.pl')!.scrollIntoView()
    }, timeout);
}


// 导航吸顶相关
//#region 
// const headerFixed = ref(false)
// const offsetTop = ref(0)
// const menu = ref()
// 判断页面的滚动距离是否大于吸顶元素的位置
// function handleScroll() {
// 获取页面滚动的距离 兼容写法
// const scrollTop = window.pageYOffset ||
//     document.documentElement.scrollTop ||
//     document.body.scrollTop
// console.log('scrollTop', scrollTop)
// 判断页面的滚动距离是否大于吸顶元素的位置
// headerFixed.value = scrollTop > offsetTop.value - 80
// }

// function addEventScroll() {
//     // 获取吸顶元素的dom
//     // 吸顶元素到top的距离
//     // offsetTop.value = menu.value.offsetTop
//     // 监听滚动条
//     window.addEventListener('scroll', handleScroll)
// }
//#endregion

// 自定义锚点相关1
//#region 
function anchor() {
    const anchors = preview.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
    const titles2 = Array.from(anchors).filter((title: any) => !!title.innerText.trim());
    if (!titles2.length) {
        titles.length = 0;
        return;
    }
    const hTags = Array.from(new Set(titles2.map((title: any) => title.tagName))).sort();
    let titles3 = titles2.map((el: any) => ({
        title: el.innerText,
        lineIndex: el.getAttribute('data-v-md-line'),
        indent: hTags.indexOf(el.tagName),
    }));
    titles.push.apply(titles, titles3)
}
// 自定义锚点相关2
function handleAnchorClick(anchor: any) {
    const { lineIndex } = anchor;
    const heading = preview.value.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);
    if (heading) {
        preview.value.scrollToTarget({
            target: heading,
            scrollContainer: window,
            top: 100,
        });
    }
}
//#endregion

// 点赞  
async function increment_like() {
    try {
        const res = await incrementApi({ id: articleInfo.value.id, increment_item: "like" })
        if (res.code === 200) {
            articleInfo.value.like++
        }
    } catch (error) {
        console.log('error', error)
    }
}


</script>
<style lang='less' scoped>
.container {

    display: flex;
    justify-content: space-between;
    width: 1140px;
    margin: 20px auto;

    .md_preview {
        width: 820px;
        // background-color: #ffffff;

        .content {
            width: 100%;
            // height: 480px;
            padding: 40px;
            padding-bottom: 0px;
            padding-top: 32px;
            // background-color: pink;
            background-color: #ffffff;

            >h4 {
                font-size: 32px;
                font-weight: 600;
                line-height: 42px;
                margin-bottom: 20px;
            }

            .userdata {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 48px;
                margin-bottom: 20px;

                .l {
                    display: flex;
                    align-items: center;

                    img {
                        width: 38px;
                        height: 38px;
                        border-radius: 50%;
                        margin-right: 12px;
                    }

                    .username {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;

                        span:nth-child(1) {

                            // color: rgb(81, 87, 103);
                            color: rgb(93, 93, 239);
                            font-size: 16px;
                            line-height: 24px;
                        }

                        span:nth-child(2) {
                            color: rgb(138, 145, 159);
                            font-size: 13px;
                            line-height: 22px;
                        }

                    }
                }



            }

            .cover {
                width: 100%;
                max-height: 435px;
            }

            .introduction {
                background-color: #f8f8f8;
                border-left: 4px solid #cbcbcb;
                border-right: 4px solid #cbcbcb;
                // border: 4px solid #cbcbcb;
                padding: 15px 20px;
                margin-top: 25px;
                font-size: 16px;
                line-height: 1.8em;
                color: #606266;

                p {
                    text-indent: 2em;
                }
            }
        }

        .comment {
            margin-top: 20px;
            background-color: #ffffff;
            padding: 24px 40px 40px;
            height: auto;


            // padding-top: 24px;

            .pl {
                display: inline-block;
                margin-bottom: 24px;
                font-size: 18px;
                line-height: 30px;
                font-weight: 600;
                color: #252933;
            }

            .sub {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(77, 46, 213, 0.1);

                >div {
                    width: 100%;
                    display: flex;

                    >img {
                        margin-right: 16px;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                    }
                }

                .el-button {
                    margin-top: 10px;
                }
            }


        }

        .margintop30 {
            // width: 100%;
            margin-top: 30px;
        }
    }

    .right {
        width: 300px;
        height: 600px;
        // background-color: #ffffff;

        .anchor {
            max-height: 650px;
            min-height: 100px;
            height: auto;

            >div {
                position: relative;

            }
        }

        :deep(.el-affix > div) {
            background-color: #ffffff;
            width: 300px;
            max-height: 650px;
            // height: 100%;
            min-height: 100px;

            height: auto;
            overflow: auto;
            padding-bottom: 10px;


            >h4 {
                position: sticky;
                top: 0;
                right: 0;
                padding: 0 20px;
                height: 56px;
                line-height: 56px;
                font-size: 18px;
                font-weight: 500;
                color: black;
                border-bottom: 1px solid rgba(148, 148, 148, 0.2);
                background-color: #ffffff;
            }

            .nav {
                margin-top: 10px;
                font-size: 14px;
                color: black !important;


                a {
                    padding-left: 20px;
                    color: black;
                }

            }
        }

        .box2 {
            height: 400px;
            background-color: #fff;
            margin-bottom: 20px;
        }

    }

    .other {
        width: 100%;
        height: 400px;
        margin-top: 20px;
        background-color: #fff;

    }
}

// 滚动条样式
:deep(.anchor>div::-webkit-scrollbar) {
    /*滚动条整体样式*/
    width: 4px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}

:deep(.anchor>div::-webkit-scrollbar-thumb) {
    /*滚动条里面小方块*/
    // border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    // background: #7d7d7d;
    background-color: rgba(0, 0, 0, 0.4);
}

:deep(.anchor>div::-webkit-scrollbar-track) {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    // border-radius: 10px;
    background: #ededed;
}

// 吸顶相关
// .headerFixed {
//     position: fixed;
//     top: 80px;
// }

.activestyle {
    // background-color: pink;
    color: #2778fe !important;
    font-weight: 600;
    font-size: 16px;
    border-left: 2px solid #2778fe;

}

// 左侧功能块
.navigation {
    width: 48px;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 22%;
    transform: translateX(-186%);
    list-style: none;

    li {
        user-select: none;
        cursor: pointer;
        background-color: #ffffff;
        border-radius: 50%;

        text-align: center;
        margin-bottom: 20px;

        i {
            font-size: 20px;
            width: 100%;
            height: 100%;
            line-height: 48px;
            color: #8a919f;
        }
    }

    li:last-child {
        margin-bottom: 0;
    }

    .increment_like,
    .comments {
        position: relative;

        .num {
            position: absolute;
            top: -4px;
            left: 34px;
            font-size: 12px;
            background-color: #c2c8d1;
            border-radius: 8px;
            color: #fefefe;
            padding: 0 4px;
        }
    }



}
</style>