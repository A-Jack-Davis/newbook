<template>
    <div class="nav">
        <div class="center">
            <!-- logo -->
            <div class="logo">
                <img src="../../assets/imgs/logo.png" alt="" @click="router.push('/home/index')">
            </div>

            <!-- 菜单选项 -->
            <div class="menu">
                <el-menu :default-active="$route.path" class="el-menu-demo" router mode="horizontal">
                    <el-menu-item index="/home/index">首页</el-menu-item>
                    <el-menu-item index="/home/focuson">关注</el-menu-item>
                    <el-menu-item index="/home/newslist">热点</el-menu-item>
                </el-menu>
            </div>

            <!-- 搜索框 -->
            <div class="search">
                <div v-if="$route.path.includes('/home/news')">
                    <input v-if="$route.path.includes('/home/news')" type="text" placeholder="探索新闻" v-model='search'
                        @keyup.enter="$router.push(`/home/newslist?title=${search}`)">
                    <el-icon style="vertical-align: middle" @click="$router.push(`/home/newslist?title=${search}`)">
                        <Search />
                    </el-icon>
                </div>
                <div v-else>
                    <input type="text" placeholder="探索帖子" v-model='search'
                        @keyup.enter="$router.push(`/home/index?search=${search}`)">
                    <el-icon style="vertical-align: middle" @click="$router.push(`/home/index?search=${search}`)">
                        <Search />
                    </el-icon>
                </div>
            </div>

            <!-- github 和 api -->
            <div class="orthr_a">
                <a class="iconfont icon-GitHub" href="https://github.com/A-Jack-Davis/newbook" target="_blank"></a>
                <a class="iconfont icon-APIwangguan"
                    href="https://console-docs.apipost.cn/preview/8b99ace7f9d94247/50b16b4de116ae6e?target_id=cdab8083-cf89-4e0e-8167-80fe248b586a#fce2299c-5a6e-413c-8eaf-7586b079dde8"
                    target="_blank"></a>
                <a class="yuque" href="https://www.yuque.com/xiaojiuguan-hf105/cbwf0e" target="_blank">
                    <img src="https://gw.alipayobjects.com/zos/bmw-prod/735cefc9-f976-4c87-8b48-85f713f5b713.svg"
                        alt="语雀" width="32" height="32">
                </a>
            </div>


            <!-- 头像和下拉菜单 -->
            <div class="aratar">
                <el-avatar :src="BASEURL + userStore.userInfo.avatar" @click="toOtherUser" />
                <!-- 下拉菜单 -->
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <span class="username">
                            {{ userStore.userInfo.nickname.length >= 4 ? userStore.userInfo.nickname.slice(0, 4) + '...'
                            : userStore.userInfo.nickname
                            }}
                            <el-icon>
                                <ArrowDown />
                            </el-icon>
                        </span>
                    </span>
                    <!-- 菜单 -->
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="personalCenter">
                                <i class="iconfont icon-iconfontgerenzhongxin"></i>个人中心
                            </el-dropdown-item>
                            <el-dropdown-item command="postArticle">
                                <i class="iconfont icon-fabuxiaoxi"></i>发布文章
                            </el-dropdown-item>
                            <el-dropdown-item command="changePassword">
                                <i class="iconfont icon-xiugaimima"></i>修改密码
                            </el-dropdown-item>
                            <el-dropdown-item command="loginOut">
                                <i class="iconfont icon-tuichu1"></i>退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>


        <!-- 修改密码弹出框 -->
        <el-dialog title="修改密码" width="20%" v-model="changePasswordDialogVisible" :append-to-body="false" top="22vh"
            :show-close="false" @open="resetForm(changePasswordFormRef)">
            <el-form ref="changePasswordFormRef" :rules="changePasswordRules" :model="changePasswordInfo"
                label-width="120px">
                <el-form-item label="原密码" label-width="80px" prop="oldPassword">
                    <el-input v-model="changePasswordInfo.oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" label-width="80px" prop="password">
                    <el-input v-model="changePasswordInfo.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" label-width="80px" prop="confirmPassword">
                    <el-input v-model="changePasswordInfo.confirmPassword" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="changePasswordDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(changePasswordFormRef)">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>
    
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"
import { reactive, ref } from 'vue';
import { Search, ArrowDown } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user.js';
import { useRouter } from 'vue-router';
import { storeToRefs } from "pinia";
import { useUpComponentsStore } from "@/stores/upComponents";
import { FormInstance, FormRules } from "element-plus";
import { loginChangPasswordApi } from "@/api/user";
import { successNotify, warningNotify } from "@/utils/notification";
const router = useRouter()
const userStore = useUserStore()
const up = useUpComponentsStore()

const { userInfo } = storeToRefs(userStore)


// 下拉菜单  点击菜单项触发的事件回调
const handleCommand = (command: string | number | object) => {
    switch (command) {
        case 'loginOut':
            window.localStorage.clear()
            router.push('/login')
            break;
        case 'postArticle':
            router.push('/home/postarticle')
            break;
        case 'personalCenter':
            toOtherUser()
            break;
        case 'changePassword':
            changePasswordDialogVisible.value = true
            break;
        default:
            break;
    }
}

// 去本人个人中心
async function toOtherUser() {
    userStore.is_self = true
    router.push(`/home/personalcenter?t=1`);
    up.upDetailList++
    up.upUserStatistical++
    userStore.getOtherInfo(userInfo.value.id)
}

// 搜索关键词
const search = ref<string>('')

// 修改密码弹框
const changePasswordDialogVisible = ref(false)

// 修改密码信息
const changePasswordInfo = reactive({//修改密码相关信息
    oldPassword: "",
    password: "",
    confirmPassword: ""
})

// 修改密码表单ref
const changePasswordFormRef = ref<FormInstance>()
// 表单验证规则
const changePasswordRules = reactive<FormRules>({
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' }
    ],
    oldPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            validator: (rule: any, value: any, callback: any) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== changePasswordInfo.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        }
    ],
})

// 确认修改
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const res = await loginChangPasswordApi(changePasswordInfo)
            if (res.code == 200) {
                successNotify(res)
                changePasswordDialogVisible.value = false
                resetForm(formEl)
            } else {
                warningNotify(res)
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    changePasswordInfo.confirmPassword = ""
    changePasswordInfo.oldPassword = ""
    changePasswordInfo.password = ""
    formEl.resetFields()
}
</script>
    
<style lang='less' scoped>
.nav {
    padding-left: calc(100vw - 100%);
    width: 100%;
    height: 60px;
    background-color: #ffffff;
    border-bottom: 1px solid rgba(239, 223, 223, 0.569);

    .center {
        max-width: 1440px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;

        .logo {
            flex: 4;

            >img {
                cursor: pointer;
                height: 48px;
                margin-left: 20px;
            }
        }

        .menu {
            flex: 7;

            .el-menu {
                border-bottom: none;
            }
        }

        .search {
            flex: 7;

            >div {
                width: 60%;
                height: 36px;
                border: 1px solid #c2c8d1;
                border-radius: 4px;
                overflow: hidden;
                display: flex;
                justify-content: space-between;

                .el-icon {
                    cursor: pointer;
                    width: 40px;
                    height: 34px;
                    background-color: #f2f3f5;
                    // background-color: #3a3f4f;
                    // background-color: #549cfa;
                    font-size: 16px;
                    font-weight: 900;
                    // color: #fff;

                }

                input {
                    width: 70%;
                    padding-left: 15px;
                    font-size: 14px;
                    color: #8a9ec6;
                    line-height: 34px;
                }
            }
        }

        .orthr_a {
            flex: 2;
            display: flex;
            // background-color: #0066ff;

            .icon-GitHub,
            .icon-APIwangguan {
                cursor: pointer;
                width: 40px;
                height: 40px;
                font-size: 26px;
                border-radius: 40%;
                color: black;
            }

            .icon-APIwangguan {
                color: #0066ff;
            }

            .yuque {
                display: flex;
                align-items: center;

            }


        }

        .aratar {
            flex: 4;
            display: flex;
            justify-content: end;
            align-items: center;
            padding-right: 20px;

            .el-avatar {
                cursor: pointer;
                margin-right: 15px;
                border: #f2f3f5 0.5px solid;
            }

            .el-dropdown {
                .username {
                    cursor: pointer;
                    font-size: 16px;
                    color: #0066ff;
                    line-height: 60px;
                    // overflow: hidden;
                }
            }
        }

    }
}
</style>    

