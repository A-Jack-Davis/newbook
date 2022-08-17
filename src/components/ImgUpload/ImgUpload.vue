<template >
    <el-upload :action="props.action" :show-file-list="false" class="upload" :on-success="handleAvatarSuccess"
        :style="props.style" :before-upload="beforeUpload" :headers="props.headers">
        <template #trigger>

            <el-card v-if="props.type === 'avatar'" class="container_avatar" @mouseenter="uploadIconShow = true"
                @mouseleave="uploadIconShow = false" :body-style="[{ padding: '0' }, props.style]">
                <img :src="BASEURL + userStore.userInfo.avatar" alt="">
                <el-icon :class="{ visibility: uploadIconShow }">
                    <CameraFilled class="icon" />
                    <span>修改头像</span>
                </el-icon>
            </el-card>


            <el-card v-if="props.type === 'img'" class="container_img" :body-style="[{ padding: '0' }, props.style]">
                <img v-if="imageUrl" :src="imageUrl" />
                <el-icon v-else>
                    <Plus class="icon" />
                </el-icon>
            </el-card>

        </template>
    </el-upload>
</template>
    
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"
import { useUserStore } from '@/stores/user.js';
import { CameraFilled, Plus } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { ElMessage, ElNotification, UploadProps } from 'element-plus';

const userStore = useUserStore()
const emit = defineEmits(['getRes'])

// 控制修改头像按钮是否显示
const uploadIconShow = ref<boolean>(false)

// 定义props类型
interface Props {
    type: string,
    action: string,
    style?: {
        width: string,
        height: string,
    },
    headers?: {
        Authorization: string,
        [props: string]: any
    }
}

/**
 * @description: 定义props默认值
 * @return {object}
 */
const props = withDefaults(defineProps<Props>(), {
    style: () => {
        return {
            width: '120px',
            height: '120px',
        }
    }
})


// 上传img图片成功的临时路径
const imageUrl = ref('')


/**
 * @description: 上传成功，发送请求获取用户最新数据 
 * @return {object}
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = async (
    response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    ElNotification({
        title: 'Success',
        message: props.type === 'aratar' ? '头像上传成功' : '图片上传成功',
        type: 'success',
    });
    await userStore.getUserInfo();
    emit('getRes', response)
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


</script>
    
<style lang='less' scoped>
// .upload {
//     width: 120px;
//     height: 120px;
// }

.container_avatar {
    position: relative;
    // width: 120px;
    // height: 120px;

    img {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .el-icon {
        position: absolute;
        cursor: pointer;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: rgba(47, 46, 46, 0.415);
        font-size: 28px;
        line-height: 1em;
        color: #ffffff;
        visibility: hidden;
        z-index: 99;


        span {
            font-size: 14px;
        }
    }

    .visibility {
        visibility: visible;
    }

}

.container_img {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 150px;
    // height: 100px;

    img {
        width: 100%;
        height: 100%;
    }

    .el-icon {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 100%;
        // background-color: rgba(47, 46, 46, 0.415);
        font-size: 28px;
        line-height: 1em;
        color: #898989;
        z-index: 99;
    }
}
</style>