<template>
    <div class="comment">
        <!-- 头像 -->
        <img :src="BASEURL + comment.user_avatar">

        <div class="body">
            <div class="hoverbox" @mouseenter="delete_but_show = true" @mouseleave="delete_but_show = false">
                <!-- 评论者用户名 -->
                <div class="name">
                    <span>{{  comment.user_nickname ? comment.user_nickname : comment.user_name  }}</span>
                    <i v-if="articleStore.articleInfo.user.id == comment.user_id" class="iconfont icon-xinrenzhinan">
                        <i>(作者) </i>
                    </i>
                    <!-- 发布时间 -->
                    <div class="timeago">{{  timeAgo(comment.createdAt)  }}</div>
                </div>
                <!-- 评论内容 -->
                <div class="content"> {{  comment.content  }}</div>
                <!-- 点赞与回复评论 -->
                <div class="function">
                    <!-- 点赞 -->
                    <button class="iconfont icon-dianzan" @click="addLike(comment.id)">
                        &#8197;{{  comment.like > 0 ? comment.like : '点赞'  }}
                    </button>
                    <!-- 回复 -->
                    <i class="iconfont icon-pinglunxiao" @click="replyComment" :class="{ activeStyle: textarea_show }">
                        &#8197;{{  textarea_show ? '取消回复' : "回复"  }}
                    </i>
                    <!-- 删除 -->
                    <i class="delete" v-show="delete_but_show && userStore.userInfo.id == comment.user_id"
                        @click="deleteComment(comment.id)">删除
                    </i>
                </div>
            </div>

            <!-- templata 输入框 -->
            <div class="templata" v-if="textarea_show">
                <el-input v-model="recomment.re_content" @blur="textareaOnBlur" ref="textareaRef" type="textarea"
                    :autosize="{ minRows: 3, maxRows: 24 }" placeholder="Please input" />
                <el-button type="primary" @click="issueComment">发布</el-button>
            </div>

            <!-- 二级评论 -->
            <div class="recommentbox" v-for="(recomment) in comment.recomments" :key="recomment.id">
                <TwoLevelComment :recomment="recomment"></TwoLevelComment>
            </div>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"

import { addCommenLiketApi, addComment, deleteCommentApi } from '@/api/comment';
import { useArticleStore } from '@/stores/article';
import { useCommentsStore } from '@/stores/comment';
import { useUserStore } from '@/stores/user';
import { successNotify, warningNotify } from '@/utils/notification';
import { nextTick, reactive, ref } from 'vue';
import TwoLevelComment from '../TwoLevelComment/TwoLevelComment.vue';
import timeAgo from "@/utils/timeAgo"
const userStore = useUserStore()
const articleStore = useArticleStore()
const commentsStore = useCommentsStore()

// 定义一级评论props
const props = defineProps<{
    comment: {
        id: number,
        article_id?: number,
        like: number,
        content?: string,
        user_id?: number,
        user_name?: string,
        user_nickname?: string,
        user_avatar?: string,
        createdAt: string,
        recomments?: Array<{
            id: number,
            re_content: string,
            comment_id: number,
            like: number,
            user_nickname: string,
            user_name: string,
            user_id: number,
            user_avatar: string,
            type: number,
            f_nickname?: string,
            f_user_name?: string,
            f_user_id?: number,
            f_user_avatar?: string,
            f_re_content?: string,
            createdAt: string
        }>
    }
}>()



// 删除按钮显示与否
const delete_but_show = ref(false)
// textarea 是否显示 
const textarea_show = ref(false)
// textarea ref
const textareaRef: any = ref(null)
// 回复与取消回复切换
async function replyComment() {
    textarea_show.value = !textarea_show.value
    if (textarea_show.value) {
        nextTick(() => {
            textareaRef.value.focus()
        })
    }
}
// textarea 失去焦点事件
function textareaOnBlur() {
    setTimeout(() => {
        textarea_show.value = false
        recomment.re_content = ""

    }, 200)
}
// 添加评论
async function issueComment() {
    if (recomment.re_content.trim() == '') {
        warningNotify({ message: "输入不能为空" })
        return
    }
    recomment.comment_id = props.comment.id
    recomment.user_id = userStore.userInfo.id
    recomment.user_name = userStore.userInfo.user_name
    recomment.user_nickname = userStore.userInfo.nickname
    recomment.user_avatar = userStore.userInfo.avatar
    try {
        const res = await addComment(recomment, "re")
        recomment.re_content = ""
        if (res.code == 200) {
            successNotify(res)
            commentsStore.getCommentlist(articleStore.articleInfo.id)
        } else {
            warningNotify(res)
        }
    } catch (error) {
        console.log('添加评论失败', error)
    }
}
// 删除评论
async function deleteComment(id: number) {
    console.log('1', 1)
    try {
        const res = await deleteCommentApi(1, id, articleStore.articleInfo.id)
        if (res.code == 200) {
            successNotify(res)
            commentsStore.getCommentlist(articleStore.articleInfo.id)
        } else {
            warningNotify(res)
        }
    } catch (error) {
        console.log('删除失败', error)
    }

}
// 点赞
async function addLike(id: number) {
    try {
        const res = await addCommenLiketApi(id)
        if (res.code == 200) {
            commentsStore.getCommentlist(articleStore.articleInfo.id)
        } else {
            warningNotify(res)
        }
    } catch (error) {
        console.log('点赞失败', error)
    }
}
// 待发送一级评论评论信息
const recomment = reactive<any>({
    re_content: "",
    comment_id: 0,
    like: 0,
    user_id: 0,
    user_name: '',
    user_nickname: "",
    user_avatar: "",
    type: 2
})


</script>
    
<style lang='less' scoped>
.comment {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;

    >img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .body {
        flex: 1;

        margin-left: 16px;

        .hoverbox {

            .name {
                font-weight: 500;
                font-size: 15px;
                color: #252933;
                line-height: 26px;
                width: 100%;

                >i {
                    color: blue;
                    margin-left: 8px;

                    >i {
                        font-weight: 500;
                        font-size: 15px;
                        color: #8a919f;
                        max-width: 90px;
                        line-height: 26px;
                        margin-left: 3px;
                    }
                }

                .timeago {
                    float: right;
                    font-size: 13px;
                    color: #8a919f;
                    line-height: 26px;
                }
            }

            .content {
                font-weight: 400;
                font-size: 14px;
                line-height: 24px;
                color: #515767;
                margin-top: 8px;
                -webkit-line-clamp: 6;
            }

            .function {
                margin-top: 8px;
                // margin-bottom: 12px;

                i,
                button {
                    background-color: transparent;
                    line-height: 22px;
                    font-size: 14px;
                    cursor: pointer;
                    color: #8a919f;
                    margin-right: 16px;
                }

                .delete {
                    float: right;
                    color: red;
                }
            }
        }

        .templata {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-top: 12px;

            .el-button {
                margin-top: 10px;
            }
        }
    }
}


.activeStyle {
    color: blue !important;
}
</style>