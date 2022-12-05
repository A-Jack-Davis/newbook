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
                        <img :src="BASEURL + articleInfo.user.avatar" @click="toOtherUser">
                        <div class="username">
                            <span>{{ articleInfo.user.nickname }}</span>
                            <div>
                                <span>{{ _getdate(articleInfo.createdAt) }}</span>
                                <button class="editor" @click="toEditor"
                                    v-if="userInfo.id == articleInfo.user.id">编辑</button>
                            </div>
                        </div>
                    </div>
                    <button @mouseenter="attention_but_enter" @mouseleave="attention_but_lever" @click="attention"
                        class="focus_on" :class="{
                            'focus_on_true': attentionFlag,
                            'focus_on_fasle_hover': focus_on_fasle_hover
                        }">
                        <i class="iconfont" :class="{ 'icon-zengjia': !attentionFlag, 'icon-duihao_o': attentionFlag }">
                        </i>
                        {{ attentionString }}
                    </button>
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
            <!-- 作者统计 -->
            <div class="achievement_box">
                <div class="avatar" @click="toOtherUser">
                    <img :src="BASEURL + articleInfo.user.avatar">
                    <span>{{ articleInfo.user.nickname }}</span>
                </div>

                <!-- <h4>个人成就</h4> -->
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

            <!-- 站长微信 -->
            <div class="wx">
                <img src="@/assets/imgs/wx.jpg" alt="">
                <div class="wx_info">
                    <span>关注站长微信</span>
                    <span>提供idea与建议</span>
                </div>
            </div>

            <RecommendTheArticle @toArticle="toArticle" :limit="7" class="recommendthearticle"></RecommendTheArticle>

            <!-- 目录导航 -->
            <el-affix class="anchor" ref="menu" :offset="80">
                <h4>目录</h4>
                <div class="scrollbox">

                    <div class="nav">
                        <div v-for="anchor in titles" :style="{ padding: `8px 0 8px 0` }"
                            @click="handleAnchorClick(anchor)">
                            <a style="cursor: pointer" :line-index="anchor.lineIndex"
                                :style="{ 'padding-left': anchor.indent * 18 + 20 + 'px' }">{{ anchor.title }}</a>
                        </div>
                    </div>

                </div>
            </el-affix>
        </div>

        <!-- 左侧定位区 -->
        <ul class="navigation">
            <!-- 点赞 -->
            <li @click="add_of_delete_like()" class="increment_like">
                <i class="iconfont icon-dianzan_kuai" :class="{ like: articleInfo.articleLikes.includes(userInfo.id) }">
                </i>
                <span class="num" :class="{ like2: articleInfo.articleLikes.includes(userInfo.id) }"> {{
                        articleInfo.like
                }}
                </span>
            </li>
            <!-- 评论数 -->
            <li class="comments" @click="_tocommentBox(0)">
                <i class="iconfont icon-pinglun4"></i>
                <span class="num"> {{ commentsStore.commentList.length }} </span>
            </li>
            <!-- 收藏 -->
            <li @click="collector">
                <i class="iconfont icon-shoucang-shoucang"
                    :class="{ collector: articleInfo.collectorUserList.includes(userInfo.id) }"></i>
            </li>
        </ul>

    </div>


    <!--回到顶部 -->
    <el-backtop :bottom="80">
        <i class="iconfont icon-18huidaodingbu"></i>
    </el-backtop>
</template>

<script setup lang='ts'>
//#region 
import { BASEURL } from "@/const/VARIABLE"
import { useArticleStore } from '@/stores/article';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { addComment } from '@/api/comment';
import Comment from '../Comment/Comment.vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { successNotify, warningNotify } from '@/utils/notification';
import { useCommentsStore } from '@/stores/comment';
import { changeLike, collectApi } from "@/api/article";
import { attentionApi } from "@/api/user";
const articleStore = useArticleStore()
const { articleInfo } = storeToRefs(articleStore)
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const commentsStore = useCommentsStore()
const route = useRoute()
const router = useRouter()
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
        _tocommentBox(200)
    }

    // 是否关注
    attentionFlag.value = articleInfo.value.fonsList.includes(userInfo.value.id)

    //  获取文章统计信息
    articleStore.getArticleStatistical(articleInfo.value.user.id)
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


// 发布评论
//#region 
const comment = reactive({
    content: "",
    article_id: articleInfo.value.id,
    user_id: userInfo.value.id,
    user_name: userInfo.value.user_name,
    user_nickname: userInfo.value.nickname,
    user_avatar: userInfo.value.avatar
})
// 发布评论
async function releaseComment() {
    if (comment.content.trim() == '') {
        warningNotify({ message: "输入不能为空" })
        return
    }
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


// 跳转到评论区
function _tocommentBox(timeout: number) {
    setTimeout(() => {
        document.querySelector('.pl')!.scrollIntoView()
        _getAnchorElementTop()
    }, timeout);
}

// 用户是否点赞 返回(true点赞)(false取消点赞)
async function add_of_delete_like() {
    const res = await changeLike({ article_id: articleInfo.value.id, user_id: userInfo.value.id })
    if (res.data) {
        articleInfo.value.like++
        articleInfo.value.articleLikes.push(userInfo.value.id)
    } else {
        articleInfo.value.like--
        const i = articleInfo.value.articleLikes.indexOf(userInfo.value.id)
        articleInfo.value.articleLikes.splice(i, 1)
    }
}

// 用户是否 收藏 返回(true收藏)(false取消收藏)
async function collector() {
    const res = await collectApi(userInfo.value.id, articleInfo.value.id)
    if (res.data) {
        articleInfo.value.collectorUserList.push(userInfo.value.id)
    } else {
        const i = articleInfo.value.collectorUserList.indexOf(userInfo.value.id)
        articleInfo.value.collectorUserList.splice(i, 1)
    }
}

// 关注相关
//#region 
// 关注或取消关注
const attentionFlag = ref<unknown | boolean | null>(false)
async function attention() {
    const res = await attentionApi(userInfo.value.id, articleInfo.value.user.id)
    attentionFlag.value = res.data
    if (res.data) {
        articleInfo.value.fonsList.push(userInfo.value.id)
    } else {
        const i = articleInfo.value.fonsList.indexOf(userInfo.value.id)
        articleInfo.value.fonsList.splice(i, 1)
    }
}
// 计算按钮文本内容
const attentionString = computed(() => {
    if (attentionFlag.value === true) {
        focus_on_fasle_hover.value = false
        return '已关注'
    } else if (attentionFlag.value === 1) {
        focus_on_fasle_hover.value = false
        return "取消关注"
    } else {
        focus_on_fasle_hover.value = false
        return '关注'
    }
})
// 未关注时hover class
const focus_on_fasle_hover = ref(false)

// 关注按钮 hover 事件
function attention_but_enter() {
    if (attentionFlag.value) {
        attentionFlag.value = 1
    }
    if (attentionFlag.value === false) {
        focus_on_fasle_hover.value = true
    }
}
function attention_but_lever() {
    if (attentionFlag.value === 1) {
        attentionFlag.value = true
    }
    focus_on_fasle_hover.value = false
}
//#endregion


// 去文章作者的个人中心页
async function toOtherUser() {
    if (articleInfo.value.user.id != userInfo.value.id) {
        userStore.is_self = false
        await userStore.getOtherInfo(articleInfo.value.user.id)
    } else {
        userStore.is_self = true
    }
    router.push(`/home/personalcenter`);
}

// 编辑文章
async function toEditor() {
    router.push(`/home/postarticle?editor=${Date.now()}`)
}

// 重新更新目录
function toArticle() {
    titles.length = 0
    anchor()
}




let titles = reactive<any>([])
const preview = ref()
//事件监控： 锚点跟踪相关---  
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
        const el_affix_div: any = document.querySelector('.el-affix >div >div')
        // 滚动条到顶部距离
        let gdtTop = el_affix_div.scrollTop
        // 激活的《a》到 position: relative; 定位父元素距离
        let aTop = activeEle.offsetTop
        // 滚动元素的  height
        let gdEleH = el_affix_div.offsetHeight
        if (gdEleH - aTop < 50) {
            el_affix_div.scrollTop = aTop - (gdEleH / 2)
        }
        if (gdtTop > aTop) {
            el_affix_div.scrollTop = 0
        }
    }
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
                        cursor: pointer;
                        width: 38px;
                        height: 38px;
                        border-radius: 50%;
                        margin-right: 12px;
                    }

                    .username {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;

                        >span {

                            // color: rgb(81, 87, 103);
                            // color: rgb(93, 93, 239);
                            color: #515767;
                            font-size: 16px;
                            line-height: 24px;
                        }

                        >div {
                            color: rgb(138, 145, 159);
                            font-size: 13px;
                            line-height: 22px;

                            .editor {
                                margin-left: 16px;
                                color: rgb(30, 128, 255);
                                background-color: transparent;
                            }
                        }

                    }
                }

                .focus_on {
                    background-color: #f4f9ff;
                    color: #1e80ff;
                    border: 1px solid rgba(30, 128, 255, .3);
                    height: 26px;
                    font-size: 14px;
                    padding: 0 10px;
                    border-radius: 4px;

                    .iconfont {
                        font-size: 14px;
                        padding-right: 5px;
                        font-weight: 600;
                    }
                }

                .focus_on_true {
                    color: #515767;
                    background: rgba(81, 87, 103, .05);
                    border-color: rgba(81, 87, 103, .3);
                }

                .focus_on_fasle_hover {
                    background: #e8f2ff;
                    color: #007ffe;
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

        // 目录
        .anchor {
            max-height: 650px;
            min-height: 100px;
            height: auto;
            overflow: hidden;

            >div {
                position: relative;

            }
        }


        // 目录
        :deep(.el-affix > div) {
            background-color: #ffffff;
            width: 300px;
            max-height: 650px;
            // height: 100%;
            min-height: 100px;
            height: auto;
            overflow: hidden;
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

            // 滚动盒子
            .scrollbox {
                position: relative;
                max-height: 580px;
                overflow: auto;

                .nav {
                    width: 280px;
                    margin-top: 10px;
                    font-size: 14px;
                    color: black !important;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

                    a {
                        padding-left: 20px;
                        color: black;
                    }

                }
            }


        }


        // 作者统计
        .achievement_box {
            width: 100%;
            // height: 400px;

            // height: 200px;
            background-color: #fff;
            margin-bottom: 20px;

            .avatar {
                cursor: pointer;
                height: 60px;
                border-bottom: 1px solid rgba(230, 230, 231, .5);
                display: flex;
                align-items: center;

                img {
                    margin-left: 16px;
                    margin-right: 16px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                }

                span {
                    font-weight: 500;
                    color: #252933;
                    font-size: 15px;
                }
            }

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

        //  站长微信  
        .wx {
            width: 100%;
            height: 100px;
            display: flex;
            // justify-content: space-between;
            background-color: #fff;
            margin: 20px 0;
            padding: 14px;

            >img {
                width: 72px;
                height: 72px;
            }

            .wx_info {

                margin-left: 20px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                font-size: 10px;
                line-height: 26px;
                color: #606266;
            }
        }

        .recommendthearticle {
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
.scrollbox::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
}

.scrollbox::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    // border-radius: 10px;
    // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #e4e6eb;
    // background-color: rgba(0, 0, 0, 0.4);
}

.scrollbox::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

    // border-radius: 10px;
    // background: #ededed;
    background-color: #fff;
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

    // 点赞(true的样式)
    .like {
        color: #1e80ff !important;
    }

    .like2 {
        background-color: #338bfd !important;
    }

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

// 收藏 或取消收藏
.collector {
    color: #ffb800 !important;
}
</style>