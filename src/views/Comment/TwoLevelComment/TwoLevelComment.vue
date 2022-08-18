<template>
    <div class="recomment">
        <!-- 头像 -->
        <img :src="BASEURL + recomment.user_avatar" alt="">

        <div class="body">
            <div class="hoverbox" @mouseenter="delete_but_show = true" @mouseleave="delete_but_show = false">

                <!-- 评论者用户名 -->
                <div class="name">
                    <span>{{ recomment.user_nickname }} </span>
                    <span v-if="articleStore.articleInfo.user.id == recomment.user_id">
                        <i class="iconfont icon-xinrenzhinan"></i>
                        <i>(作者)</i>
                        <i v-if="recomment.type == 3"> 回复 </i>
                        <i>{{ recomment.f_nickname }}</i>
                    </span>
                    <!-- 发布时间 -->
                    <div class="timeago">{{ timeAgo(recomment.createdAt) }}</div>
                </div>

                <!-- 评论内容 -->
                <div class="content"> {{ recomment.re_content }}</div>
                <!-- 引用一级评论 -->
                <div class="f_re_content" v-if="recomment.type == 3">
                    “{{ recomment.f_re_content }}
                </div>

                <!-- 点赞 回复 删除 -->
                <div class="function">
                    <!-- 点赞 -->
                    <button class="iconfont icon-dianzan" @click="addLike(recomment.id)">
                        &#8197; {{ recomment.like > 0 ? recomment.like : '点赞' }}
                    </button>
                    <!-- 回复 -->
                    <i class="iconfont icon-pinglunxiao" @click="replyComment" :class="{ activeStyle: textarea_show }">
                        &#8197;{{ textarea_show ? '取消回复' : "回复" }}
                    </i>
                    <!-- 删除 -->
                    <i class="delete" v-show="delete_but_show" @click="deleteComment(recomment.id)">删除</i>
                </div>
            </div>

            <!-- templata 输入框 -->
            <div class="templata" v-if="textarea_show">
                <el-input v-model="_re_comment.re_content" @blur="textareaOnBlur" ref="textareaRef"
                    :autosize="{ minRows: 3, maxRows: 24 }" type="textarea" placeholder="Please input" />
                <el-button type="primary" @click="issueComment">发布</el-button>
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
import timeAgo from "@/utils/timeAgo"
const userStore = useUserStore()
const articleStore = useArticleStore()
const commentsStore = useCommentsStore()


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
    }, 200)
    setTimeout(() => {
        _re_comment.re_content = ""
    }, 400)
}
// 删除评论
async function deleteComment(id: number) {
    try {
        const res = await deleteCommentApi(id, 2)
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
// 添加评论
async function issueComment() {
    if (_re_comment.re_content.trim() == '') {
        warningNotify({ message: "输入不能为空" })
        return
    }
    _re_comment.comment_id = props.recomment.comment_id
    _re_comment.user_id = userStore.userInfo.id
    _re_comment.user_name = userStore.userInfo.user_name
    _re_comment.user_nickname = userStore.userInfo.nickname
    _re_comment.user_avatar = userStore.userInfo.avatar
    _re_comment.f_nickname = props.recomment.user_nickname
    _re_comment.f_user_name = props.recomment.user_name
    _re_comment.f_user_id = props.recomment.user_id
    _re_comment.f_user_avatar = props.recomment.user_avatar
    _re_comment.f_re_content = props.recomment.re_content
    try {
        const res = await addComment(_re_comment, "re")
        _re_comment.re_content = ""
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
// 定义二级评论内容
const _re_comment = reactive<any>({
    re_content: "",
    like: 0,
    type: 3,
    comment_id: 0,
    user_id: 0,
    user_name: '',
    user_nickname: "",
    user_avatar: "",
    f_nickname: '',
    f_user_name: '',
    f_user_id: 0,
    f_user_avatar: '',
    f_re_content: '',
})
// 点赞
async function addLike(id: number) {
    try {
        const res = await addCommenLiketApi(id, 2)
        if (res.code == 200) {
            commentsStore.getCommentlist(articleStore.articleInfo.id)
        } else {
            warningNotify(res)
        }
    } catch (error) {
        console.log('点赞失败', error)
    }
}
// 定义 recomment props
const props = defineProps<
    {
        recomment: {
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
        }
    }>()



</script>
    
<style lang='less' scoped>
.recomment {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 16px;
    background-color: #f9fafb;

    >img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
    }

    .body {
        flex: 1;
        margin-left: 12px;

        .hoverbox {

            .name {
                font-weight: 500;
                font-size: 15px;
                color: #252933;
                line-height: 26px;



                >span:nth-child(2) {
                    color: #8a919f;
                    line-height: 26px;

                    i:nth-child(1) {
                        color: blue;
                        margin-left: 8px;
                        margin-right: 3px;
                    }

                    i:nth-child(3) {
                        margin: 0 15px;
                    }

                    i:nth-child(4) {
                        color: #252933;

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

            .f_re_content {
                width: 614px;
                background-color: #f2f3f5;
                border-radius: 4px;
                padding: 0 12px;
                line-height: 36px;
                border: 1px solid #e4e6eb;
                height: 36px;
                font-size: 14px;
                color: #8a919f;
                margin-top: 6px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

            }

            .function {
                margin-top: 8px;
                line-height: 22px;

                i,
                button {
                    background-color: transparent;
                    // line-height: 22px;
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