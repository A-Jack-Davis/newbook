<template>
    <!-- 标题 -->
    <div class="header">
        <input type="text" placeholder="输入文章标题..." v-model="articleInfo.title">
        <div class="operation">
            <el-button type="info" size="default" @click="cancel">取消</el-button>
            <el-button type="primary" size="default" @click="show_release_box = true">发布</el-button>
            <el-avatar :src="BASEURL + userStore.userInfo.avatar" @click="router.push('/home/personalcenter')" />
        </div>

    </div>
    <!-- v-md-editor -->
    <v-md-editor v-model="articleInfo.content" :height="height" class="editor" :disabled-menus="[]"
        @upload-image="handleUploadImage"></v-md-editor>

    <!-- 发布盒子 -->
    <el-card class="release" :body-style="{ padding: '0' }" v-show="show_release_box">
        <h4>发布文章</h4>
        <div class="content">
            <div class="cover">
                <span>文章封面:</span>
                <ImgUpload class="uplod_img" @get-res="setCoverUrl" v-bind="{
                    action: BASEURL + '/users/fileupload/articleimg',
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
                <el-input v-model="articleInfo.introduction" clearable :autosize="{ minRows: 4, maxRows: 4 }"
                    type="textarea" resize="none" show-word-limit maxlength="100"></el-input>
            </div>
        </div>
        <div class="buts">
            <el-button type="info" size="default" @click="show_release_box = false">取消</el-button>
            <el-button type="primary" size="default" @click="release">发布</el-button>
        </div>
        <div class="blue">
        </div>
    </el-card>
</template>
    
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"

import { useUserStore } from '@/stores/user';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { theArticleImageUploadApi, addArticleApi } from "@/api/article"
import { storeToRefs } from 'pinia';
import { successNotify, warningNotify } from '@/utils/notification';
import ImgUpload from '@/components/ImgUpload/ImgUpload.vue';
const router = useRouter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)


// 文章信息
const articleInfo = reactive({
    user_id: userInfo.value.id,
    cover_url: "/admin/articleimg/10/articleimg20220810103347.png",
    title: "【万字】透过分析webpack面试题，构建webpack5,x知识体系",
    content: "# 基础\n\n## 基础使用\n\n**`Webpack` 是一个静态资源打包工具。**\n\n它会以**一个**或**多个**文件作为打包的入口，将我们整个项目所有文件编译组合成**一个**或**多个**文件输出出去。\n\n输出的文件就是编译好的文件，就可以在浏览器段运行了。我们将 `Webpack` 输出的文件叫做 `bundle`。\n\n### 功能介绍\n\nWebpack 本身功能是有限的:\n\n- 开发模式：仅能编译 JS 中的 `ES Module` 语法\n- 生产模式：能编译 JS 中的 `ES Module` 语法，还能**压缩 JS**代码\n\n### 开始使用\n\n`1.资源目录`\n\n```js\nwebpack_code # 项目根目录（所有指令必须在这个目录运行）\n    └── src # 项目源码目录\n        ├── js # js文件目录\n        │   ├── count.js\n        │   └── sum.js\n        └── main.js # 项目主文件\n```\n\n```js\nfunction debounce(callback, delay) {\n\tlet timer = null;\n\treturn function () {\n\t\tclearTimeout(timer);\n\t\ttimer = setTimeout(() => {\n\t\t\tcallback.bind(this)();\n\t\t}, delay);\n\t}\n}\n```\n\n## 思路\n\n1. 先创建一个临时文件夹，存储编写时的图片\n2. 每次编写前清空临时文件夹\n3. 发布时：修改text再请求\n4. 将临时文件夹下文件移动到：**文章文件夹**\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
    introduction: 'DEA是最常用的开发工具，很多程序员都想把它打造成一站式开发平台，于是安装了各种各样的插件。最近发现了一款IDEA插件RestfulFastRequest，细节做的真心不错，说它是IDEA版的Postman也不为过，推荐给大家！'
})


// markdown编辑器图片上传到服务器
async function handleUploadImage(event: any, insertImage: any, files: any) {
    // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
    const formData = new FormData();
    formData.append('file', files[0]);
    let res = await theArticleImageUploadApi(formData)
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
    if (articleInfo.title.trim() == '') {
        warningNotify({ message: "标题不能为空" })
        return
    }
    if (articleInfo.content.trim() == '') {
        warningNotify({ message: "内容不能为空" })
        return
    }
    router.push('/home/index')
    try {
        const res = await addArticleApi(articleInfo)
        if (res.code === 200) {
            successNotify(res)
        } else {
            warningNotify(res)
        }
    } catch (error) {
        console.log('文章发布失败', error)
    }
}

// 自定义事件，设置封面路径
function setCoverUrl(res: any) {
    articleInfo.cover_url = res.data.uploadpaths[0].url
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
