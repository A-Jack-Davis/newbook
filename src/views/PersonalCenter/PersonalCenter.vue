<template>
    <el-card class="container" :body-style="{ padding: '0', border: 0 }">
        <div class="main" :class="{ showDataDown: showData, showDataUp: !showData }">
            <!-- 背景区域 -->
            <div class="bgimg" @mouseover="enterBgImg = true" @mouseout="enterBgImg = false">
                <img :src="BASEURL + userInfo.bgcimg">
                <el-upload class="bgcupload" :headers="{ Authorization: userStore.token }"
                    :action="BASEURL + '/users/fileupload/bgcimg'" :on-success="handleAvatarSuccess"
                    :before-upload="beforeUpload">
                    <template #trigger>
                        <el-button :style="{ visibility: enterBgImg ? 'visible' : 'hidden' }" class="r_t_b"
                            show-file-list="false" size="small" plain :icon="Edit">编辑封面图片</el-button>
                    </template>
                </el-upload>
            </div>

            <!-- 头像大区域 -->
            <div class="cardinfo">
                <div class="left">
                    <ImgUpload v-bind="{
                        action: BASEURL + '/users/fileupload/avatar',
                        type: 'avatar',
                        headers: { Authorization: userStore.token },
                        style: {
                            width: '120px',
                            height: '120px',
                        }
                    }"></ImgUpload>

                    <div class="username">
                        <h1>小酒馆</h1>
                    </div>
                </div>
                <el-button @click="showData = showForm = true" type="primary" size="small" plain :icon="Edit">
                    编辑个人资料
                </el-button>
            </div>


            <!-- 表单区域 -->
            <div class="userCard">
                <el-form v-model="formInfo">
                    <el-descriptions title="个人信息" :column="2">
                        <el-descriptions-item width="500px" class-name="content" label-class-name="label" label="帐号:">
                            <el-input v-model="formInfo.user_name" disabled size="small" v-if="showForm"></el-input>
                            <span v-else>{{ formInfo.user_name }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item width="500px" class-name="content" label-class-name="label" label="手机号:">
                            <el-input v-model="formInfo.phoneNo" size="small" v-if="showForm"></el-input>
                            <span v-else>{{ formInfo.phoneNo }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item width="500px" class-name="content" label-class-name="label" label="昵称:">
                            <el-input v-model="formInfo.nickname" size="small" v-if="showForm"></el-input>
                            <span v-else>{{ formInfo.nickname }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item width="500px" class-name="content" label-class-name="label" label="地址:">
                            <el-input v-model="formInfo.address" class="ml10" size="small" v-if="showForm">
                            </el-input>
                            <span v-else>{{ formInfo.address }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item width="500px" class-name="content" label-class-name="label" label="姓别:">
                            <el-radio-group class="radio" v-model="formInfo.sex" size="small" v-if='showForm'>
                                <el-radio-button label="男"></el-radio-button>
                                <el-radio-button label="女"></el-radio-button>
                            </el-radio-group>
                            <span v-else>{{ formInfo.sex }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item width="500px" class-name="content" label-class-name="label" label="学校:">
                            <el-input v-model="formInfo.school" class="ml10" size="small" v-if="showForm">
                            </el-input>
                            <span v-else>{{ formInfo.school }}</span>
                        </el-descriptions-item>
                    </el-descriptions>

                    <div class="introduction">
                        <el-tag effect="dark">简介:</el-tag>
                        <el-input class="jj" v-model="formInfo.Introduction" v-if='showForm' clearable
                            :autosize="{ minRows: 4, maxRows: 4 }" type="textarea" resize="none" show-word-limit
                            maxlength="150"></el-input>
                        <p v-else>{{ formInfo.Introduction }}</p>
                    </div>
                </el-form>
            </div>

            <el-button text bg :icon="showData ? ArrowUp : ArrowDown" class="showBut"
                @click="showData = !showData; showForm = false">
                查看详细资料</el-button>

            <el-button-group class="buttongroup" v-show="showData">
                <el-button type="primary" plain size="small" :icon="ArrowLeft" @click="cancelChange">取消</el-button>
                <el-button type="primary" plain size="small" @click="submitChanges">
                    修改<el-icon class="el-icon--right">
                        <ArrowRight />
                    </el-icon>
                </el-button>
            </el-button-group>
        </div>
    </el-card>

    <div class="userCart">


    </div>
</template>
    
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"

import { editUserDataApi } from '@/api/user';
import { useUserStore } from '@/stores/user.js';
import { successNotify, warningNotify } from '@/utils/notification';
import { ArrowDown, ArrowUp, Edit, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, UploadProps } from 'element-plus';
import { storeToRefs } from 'pinia';
import { reactive, ref, } from 'vue';
import ImgUpload from '@/components/ImgUpload/ImgUpload.vue'
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)


// 是否显示编辑封面图片按钮
const enterBgImg = ref<boolean>(false)

/**
 * @description: 上传成功，发送请求获取用户最新数据 
 * @return {object}
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = async (
    response,
    uploadFile
) => {
    ElNotification({
        title: 'Success',
        message: '修改成功',
        type: 'success',
    });
    await userStore.getUserInfo();
}

/**
 * @description: 上传前判断文件类型
 * @return {object}
 */
const beforeUpload: UploadProps['beforeUpload'] = (file: any) => {
    const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);

    const whiteList = ["jpg", "、jpeg", "png", "JPG", "JPEG"];
    if (whiteList.indexOf(fileSuffix) === -1) {
        ElMessage({
            showClose: true,
            message: '仅限 jpg 、jpeg 、png、JPG、JPEG 类型文件',
            type: 'error',
        })
        return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 5;

    if (!isLt2M) {
        ElMessage({
            showClose: true,
            message: '文件大小不能超过 5MB',
            type: 'error',
        })
        return false;
    }
}

// 是否打开查看详细资料页
const showData = ref<boolean>(false)

// 修改数据
const showForm = ref<boolean>(false)


// 修改--表单数据
const formInfo = reactive({
    user_name: userInfo.value.user_name,
    nickname: userInfo.value.nickname,
    sex: userInfo.value.sex,
    phoneNo: userInfo.value.phoneNo,
    address: userInfo.value.address,
    school: userInfo.value.school,
    Introduction: userInfo.value.Introduction
})

// 取消修改
const cancelChange = () => {
    showForm.value = false
    Object.assign(formInfo, userInfo.value)
}

// 修改并获取新数据 
async function submitChanges() {
    if (showForm.value === false) return showForm.value = true
    try {
        const res = await editUserDataApi({
            whereOpt: { id: userInfo.value.id },
            newUser: formInfo
        })
        if (res.code === 200) {
            successNotify(res)
            userStore.getUserInfo()
        } else {
            warningNotify(res)
        }
        showForm.value = false
    } catch (error) {
        console.log('修改用户数据失败', error)
    }
}

</script>
    
<style lang='less' scoped>
.container {
    position: relative;
    max-width: 980px;
    margin: 0 auto;

    .main {
        width: 100%;
        height: 426px;
        position: relative;

        >.bgimg {
            width: 100%;
            height: 327px;

            img {
                width: 100%;
                height: 327px;
            }

            .bgcupload {
                position: absolute;
                top: 12px;
                right: 12px;
                visibility: hidden;

                .r_t_b {
                    background-color: transparent;
                    color: #fff;

                    :deep(.el-icon) {
                        margin-right: 6px !important;
                    }
                }

                .r_t_b:hover {
                    color: #0085ff;
                    background-color: rgb(49, 49, 49);
                }
            }
        }

        .cardinfo {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
            // background-color: rgb(187, 174, 174);
            height: 100px;

            .left {
                display: flex;
                align-items: flex-end;
                padding-left: 20px;
                padding-bottom: 20px;

                .username {
                    margin-left: 30px;

                    h1 {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 30px;
                    }
                }
            }

            .el-button {
                position: absolute;
                bottom: 20px;
                right: 20px;
            }
        }

        // 查看详细资料
        .showBut {
            position: absolute;
            // background-color: transparent;
            background-color: transparent !important;
            font-size: 12px;
            color: #919398;
            bottom: 9px;
            left: 154px;
        }

        .buttongroup {
            position: absolute;
            bottom: 10px;
            right: 126px;
        }

        .userCard {

            width: 100%;
            height: 400px;
            padding-left: 180px;
            padding-top: 20px;

            .introduction {
                margin-top: 10px;

                .el-tag {
                    font-size: 14px;
                    margin-bottom: 16px;
                }

                p {
                    text-indent: 2em;

                    width: 82%;
                    line-height: 1.7;
                    padding-left: 8px;
                }

                .jj {
                    display: block;
                    width: 78%;
                    margin-left: 50px;

                    :deep(.el-textarea__inner) {
                        text-indent: 2em;
                        line-height: 1.5;
                    }
                }

                // .el-input {
                //     margin-top: 20px;
                // }
            }

            .radio {
                vertical-align: bottom;
            }

            .ml10 {
                margin-left: 15px;
                width: 210px;
            }
        }

    }
}

.userCart {
    max-width: 980px;
    margin: 10px auto;
    height: 600px;
    overflow: hidden;
    background-color: #222222;

    img {
        float: left;
        width: 50%;
        height: auto;
    }
}

.showDataDown {
    height: 826px !important;
    transition: 0.4s linear !important;
}

.showDataUp {
    height: 426px !important;
    transition: 0.4s linear !important;
}


:deep(.label) {
    color: black !important;
    font-size: 16px !important;
    // width: 50px !important;
}

:deep(.content) {
    display: inline-block;
    font-size: 16px !important;

    // width: 50px !important;
}

:deep(.el-input__wrapper) {
    height: 28px;
    width: 210px;
}

:deep(.el-descriptions__header) {
    margin-bottom: 24px;
}
</style>