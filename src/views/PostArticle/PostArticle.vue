<template>
    <!-- 标题 -->
    <div class="header">
        <input type="text" placeholder="输入文章标题..." v-model="articleData.title">
        <div class="operation">
            <el-button type="info" size="default" @click="cancel">取消</el-button>
            <el-button type="primary" size="default" @click="show_release_box = true"> {{  isEditor ? '更新并发布' : "发布"  }}
            </el-button>
            <el-avatar :src="BASEURL + userStore.userInfo.avatar" @click="router.push('/home/personalcenter')" />
        </div>
    </div>
    <!-- v-md-editor -->
    <v-md-editor v-model="articleData.content" :height="height" class="editor" :disabled-menus="[]"
        @upload-image="handleUploadImage"></v-md-editor>

    <!-- 发布盒子 -->
    <el-card class="release" :body-style="{ padding: '0' }" v-show="show_release_box">
        <h4>发布文章</h4>
        <div class="content">
            <div class="cover">
                <span>文章封面:</span>
                <ImgUpload class="uplod_img" @get-res="setCoverUrl" v-bind="{
                    action: isEditor ? `${BASEURL}/users/fileupload/editorarticleimg?article_id=${articleInfo.id}` : `${BASEURL}/users/fileupload/articleimg`,
                    // `/users/fileupload/editorarticleimg?article_id=${article_id}`
                    type: 'img',
                    headers: { Authorization: userStore.token },
                    style: {
                        width: '120px',
                        height: '80px',
                    }
                }"></ImgUpload>
            </div>
            <div class="introduction">
                <span>编辑摘要:</span>
                <el-input v-model="articleData.introduction" clearable :autosize="{ minRows: 4, maxRows: 4 }"
                    type="textarea" resize="none" show-word-limit maxlength="100"></el-input>
            </div>
        </div>
        <div class="buts">
            <el-button type="info" size="default" @click="show_release_box = false">取消</el-button>
            <el-button type="primary" size="default" @click="release"> {{  isEditor ? '更新并发布' : "发布"  }}</el-button>
        </div>
        <div class="blue">
        </div>
    </el-card>
</template>
    
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"
import { useUserStore } from '@/stores/user';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { theArticleImageUploadApi, addArticleApi, theChangeArticleImageUploadApi, editorArticleApi } from "@/api/article"
import { storeToRefs } from 'pinia';
import { successNotify, warningNotify } from '@/utils/notification';
import ImgUpload from '@/components/ImgUpload/ImgUpload.vue';
import { useArticleStore } from "@/stores/article";
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const articleStore = useArticleStore()
const { articleInfo } = storeToRefs(articleStore)
// 文章信息
const articleData = reactive({
    user_id: userInfo.value.id,
    cover_url: "",
    title: "",
    content: "",
    introduction: ""
})

onMounted(() => {
    if (route.query.editor) {
        isEditor.value = true
        articleData.title = articleInfo.value.title
        articleData.content = articleInfo.value.content
        articleData.introduction = articleInfo.value.introduction
        articleData.cover_url = articleInfo.value.cover_url
    }
})

// 修改状态？
const isEditor = ref(false)

// markdown编辑器图片上传到服务器
async function handleUploadImage(event: any, insertImage: any, files: any) {
    // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
    const formData = new FormData();
    formData.append('file', files[0]);
    let res
    if (isEditor.value) {
        res = await theChangeArticleImageUploadApi(formData, articleInfo.value.id)
    } else {
        res = await theArticleImageUploadApi(formData)
    }
    insertImage({
        url: BASEURL + res.data.uploadpaths[0].url,
        desc: res.data.uploadpaths[0].name,
        width: 'auto',
        height: 'auto',
    });
}

//v-md-editor高度
const height = document.body.clientHeight - 60 + "px"


// 是否显示发布盒子
const show_release_box = ref(false)

// 取消发布
function cancel() {
    router.go(-1)
    show_release_box.value = false
}


// 发布文章
async function release() {
    if (articleData.title.trim() == '') {
        warningNotify({ message: "标题不能为空" })
        return
    }
    if (articleData.content.trim() == '') {
        warningNotify({ message: "内容不能为空" })
        return
    }
    router.push('/home/index')
    if (isEditor.value) {
        const res = await editorArticleApi(articleData, articleInfo.value.id)
        if (res.code === 200) {
            successNotify(res)
        } else {
            warningNotify(res)
        }
    } else {
        console.log('创建')
        try {
            const res = await addArticleApi(articleData)
            if (res.code === 200) {
                successNotify(res)
            } else {
                warningNotify(res)
            }
        } catch (error) {
            console.log('文章发布失败', error)
        }
    }
}

// 自定义事件，设置封面路径
function setCoverUrl(res: any) {
    articleData.cover_url = res.data.uploadpaths[0].url
}


</script>
    
<style lang='less' scoped>
.header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    border-bottom: 1px solid #d6d6d6;
    padding-left: 40px;

    .operation {
        width: 186px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 60px;

        .el-avatar {
            margin-left: 15px;
        }
    }

    input {
        height: 36px;
        width: 58%;
        font-size: 24px;
        font-weight: 600;
    }

    input::placeholder {
        color: #757575;
    }
}

.editor {
    height: 100%;
}

.release {

    position: absolute;
    z-index: 999;
    top: 66px;
    right: 56px;
    width: 550px;
    height: 600px;
    overflow: visible;
    border: 1px solid #dddddd;

    h4 {
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #dddddd;
        padding-left: 20px;
        font-weight: normal;
        color: black;
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        // height: 305px;
        // background-color: pink;
        padding-left: 20px;
        font-size: 14px;


        .cover {
            padding-top: 20px;
            display: flex;
            align-items: center;
            color: #1d2129;

            .uplod_img {
                margin-left: 15px;
            }
        }

        .introduction {
            display: flex;
            align-items: center;
            height: 150px;
            width: 100%;

            :deep(.el-textarea) {
                width: 400px;
                font-size: 13px;
                margin-left: 15px;
                box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

                .el-textarea__inner {
                    line-height: 1.5em;
                    text-indent: 2em;
                }
            }
        }
    }

    .buts {
        position: absolute;
        bottom: 0;
        width: 550px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: end;
        padding-right: 15px;
    }

    .blue {
        position: absolute;
        top: -14px;
        right: 82px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0px 7px 15px 7px;
        border-color: transparent transparent #dddddd;
        z-index: 99;
    }

    .blue::after {
        content: "";
        position: absolute;
        z-index: 99;
        top: 2px;
        left: -5px;
        border-style: solid;
        border-width: 0px 5px 13px 5px;
        border-color: transparent transparent #ffffff;
    }



}
</style>
