<template>
    <div class="card-container">
        <!-- 待翻转的盒子 -->
        <div class="card" :class="{ rotated: toggle }">
            <!-- 翻转面（前） -->
            <div class="card-contents card-front">
                <div class="card-depth">
                    <h2>登录</h2>
                    <hr />
                    <el-form ref="loginFormRef" :model="form" status-icon :rules="rules">
                        <el-form-item prop="user_name">
                            <el-input v-model="form.user_name" placeholder="请输入帐号" :prefix-icon="UserFilled"
                                type="text" />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="form.password" placeholder="请输入密码" :prefix-icon="Key" type="password" />
                        </el-form-item>
                    </el-form>
                    <div class="options">
                        <span @click="flipAmdChangeBack('noRegister')">还没注册?</span>
                        <span @click="flipAmdChangeBack('forgotPassword')">忘记密码?</span>
                    </div>
                    <button @click="loginMethod(loginFormRef as FormInstance)">
                        登录
                    </button>
                </div>
            </div>

            <!-- 翻转面（后） -->
            <div class="card-contents card-back">
                <div class="card-depth">
                    <h2>{{  register_or_password_flag ? "注册" : "忘记密码"  }}</h2>
                    <hr />
                    <el-form ref="registerAmdChangePasswordFormRef" :model="form" status-icon :rules="rules">
                        <el-form-item prop="user_name">
                            <el-input v-model="form.user_name" placeholder="请输入帐号" :prefix-icon="UserFilled"
                                type="text" />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="form.password" placeholder="请输入密码" :prefix-icon="Key" type="password" />
                        </el-form-item>
                        <el-form-item :prop="register_or_password_flag ? 'confirmPassword' : 'phoneNo'">
                            <el-input v-if="register_or_password_flag" v-model="form.confirmPassword"
                                placeholder="请确认密码" :prefix-icon="Key" type="password" />
                            <el-input v-else v-model="form.phoneNo" placeholder="请输入手机号" :prefix-icon="Phone"
                                type="text" />
                        </el-form-item>
                    </el-form>
                    <div class="options">
                        <span @click="flipAmdChangeBack('havePassword')">已有帐号?</span>
                        <span @click="
                            flipAmdChangeBack(
                                register_or_password_flag ? 'forgotPassword' : 'noRegister'
                            )
                        ">
                            {{  register_or_password_flag ? "忘记密码?" : "还没注册?"  }}
                        </span>
                    </div>
                    <button
                        @click="register_or_password_flag ? registerMethod(registerAmdChangePasswordFormRef as FormInstance) : changePasswordMethod(registerAmdChangePasswordFormRef as FormInstance)">
                        {{  register_or_password_flag ? "注册" : "忘记密码"  }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { UserFilled, Key, Phone } from "@element-plus/icons-vue";
import { FormInstance, FormRules } from "element-plus";
import { computed, reactive, ref } from "vue";
import { useUserStore } from "@/stores/user.js";
import { useRouter } from 'vue-router'
import { registerApi, notLoginPasswordChangeApi } from "@/api/user.js";
import { successNotify, warningNotify } from '@/utils/notification'

// 获取路由
const router = useRouter()
// 使用user store
const userStore = useUserStore();
// 翻转
const toggle = ref<boolean>(false); //false前--true后
// 标记注册或改密
const register_or_password = ref<"register" | "changePassword">("register");
// 判断当前是注册or改密
const register_or_password_flag = computed(() => register_or_password.value === "register");
//所有表单数据
let form = reactive({
    user_name: "admin",
    password: "1212",
    phoneNo: "",
    confirmPassword: "",
});
// 表单验规则
const rules = reactive<FormRules>({
    user_name: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 2, max: 26, message: "长度在 2 到 26 个字符", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 4, max: 8, message: "长度在 4 到 8 个字符", trigger: "blur" },
    ],
    phoneNo: [
        { required: true, message: "请输入手机号码", trigger: "blur" },
        {
            validator: function (rule: any, value: any, callback: any) {
                if (/^1[34578]\d{9}$/.test(value) == false) {
                    callback(new Error("请输入正确的手机号"));
                } else {
                    callback();
                }
            },
            trigger: "blur",
        },
    ],
    confirmPassword: [
        { required: true, message: "请输入密码", trigger: "blur" },
        {
            validator: (rule: any, value: any, callback: any) => {
                if (value === "") {
                    callback(new Error("请再次输入密码"));
                } else if (value !== form.password) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            },
            trigger: "blur",
        },
    ],
});
// 表单ref
const loginFormRef = ref<FormInstance>();
const registerAmdChangePasswordFormRef = ref<FormInstance>();


// 翻转 与 背面（register or changePassword）
const flipAmdChangeBack = (
    flag: "noRegister" | "havePassword" | "forgotPassword"
) => {
    form.user_name = "";
    form.password = "";
    form.confirmPassword = "";
    form.phoneNo = "";
    switch (flag) {
        case "noRegister":
            if (toggle.value === false) {
                //登录页-->注册页
                toggle.value = true;
            }
            resetForm(loginFormRef.value)
            resetForm(registerAmdChangePasswordFormRef.value)
            register_or_password.value = "register";
            break;
        case "havePassword":
            toggle.value = false; //后转前
            resetForm(registerAmdChangePasswordFormRef.value)
            break;
        case "forgotPassword":
            if (toggle.value === false) {
                //登录页-->忘记密码页
                toggle.value = true;
            }
            register_or_password.value = "changePassword";
            resetForm(loginFormRef.value)
            resetForm(registerAmdChangePasswordFormRef.value)
            break;
        default:
            break;
    }
};

// 表单验证方法
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    let flag = false;
    await formEl.validate((valid, fields) => {
        if (valid) {
            flag = true;
        } else {
            console.log("验证未通过", fields);
        }
    });
    return flag;
};

// 表单重置
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};

/**
 * @description: 登录并跳转home
 * @param {object} formEl
 * @return {object}
 */
const loginMethod = async (formEl: FormInstance) => {
    //是否通过验证
    const flag = await submitForm(formEl);
    if (flag) {
        const { user_name, password } = form;
        try {
            const res = await userStore.login({ user_name, password });
            if (res.code === 200) {
                successNotify(res)
                router.push('/home/index')
            } else {
                warningNotify(res)
            }
        } catch (error) {
            console.log('登录异常', error)
        }
    }
};
/**
 * @description: 注册并-->登录 
 * @param {object} formEl
 * @return {object}
 */
const registerMethod = async (formEl: FormInstance) => {
    const flag = await submitForm(formEl);
    if (flag) {
        const { user_name, password, confirmPassword } = form;
        try {
            const res = await registerApi({ user_name, password });
            if (res.code === 200) {
                successNotify(res)
                flipAmdChangeBack('havePassword')
                form.user_name = res.data.user_name
            } else {
                warningNotify(res)
            }
        } catch (error) {
            console.log('注册异常', error)
        }
    }
};
/**
 * @description: 修改密码
 * @param {object} formEl
 * @return {object}
 */
const changePasswordMethod = async (formEl: FormInstance) => {
    const flag = await submitForm(formEl);
    if (flag) {
        const { user_name, password, phoneNo } = form;
        try {
            const res = await notLoginPasswordChangeApi({ user_name, password, phoneNo });
            if (res.code === 200) {
                successNotify(res)
                flipAmdChangeBack('havePassword')
                form.user_name = res.data.user_name
            } else {
                warningNotify(res)
            }
        } catch (error) {
            console.log('改密异常', error)
        }
    }
};



</script>

<style lang="less" scoped>
// 翻转相关 start
.card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    perspective: 2000px; //定义 3D 元素距视图的距离
    background-image: url("@/assets/imgs/bagimg.jpg"); //https://api.dujin.org/bing/1920.php
    background-image: url(https://api.dujin.org/bing/1920.php);

    >.card {

        h2,
        p {
            // color: #191111;
            text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2);
        }

        margin: 0 auto;
        height: 420px;
        width: 500px;
        max-width: 80%;
        position: relative;
        border-radius: 25px;
        transition: all 1.2s ease;

        transform-style: preserve-3d; //让转换的子元素保留3D转换

        box-shadow: 1px 3px 3px rgba(0, 0, 0, 0.2);

        >.card-contents {
            width: 100%;
            height: 100%;
            border-radius: 25px;
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;


            backface-visibility: hidden; //隐藏旋转 div 元素的背面

            >.card-depth {
                width: 100%;
                height: 100%;
                transform: translateZ(120px) scale(0.98); //设置卡片深度

                perspective: inherit; //设置元素被查看位置的视图：
            }
        }

        .card-front {
            background: linear-gradient(to top left, #705f58, #00223e);
            // background: linear-gradient(to top left, #ffa17f, #00223e);

            transform-style: preserve-3d; //让转换的子元素保留3D转换
        }

        .card-back {
            transform: rotateY(180deg);
            background: linear-gradient(to top left, #3a6186, #89253e);

            transform-style: preserve-3d; //让转换的子元素保留3D转换
        }
    }
}

.rotated {
    transform: rotateY(-180deg); //卡片最父元素旋转
}

// 翻转相关 end

.card-depth {
    width: 250px !important;
    margin: 0 auto;
    // background-color: #fff;
}

// 前
.card-front {
    h2 {
        font-size: 2.3em !important;
        color: #c0b3b3;
        margin-top: 50px;
        margin-bottom: 20px;
    }

    hr {
        // height: 1px;
        background-color: #937f7f;
        margin-bottom: 30px;
    }

    .options {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: #7b858f;
        padding-left: 14px;
        padding-right: 14px;
        cursor: pointer;
    }

    button {
        height: 38px;
        background-color: #6d5858;
        width: 100%;
        border-radius: 19px;
        font-size: 18px;
        font-weight: 600;
        margin-top: 32px;
    }
}

// 后
.card-back {
    h2 {
        font-size: 2.3em !important;
        color: #c0b3b3;
        margin-top: 28px;
        margin-bottom: 20px;
    }

    hr {
        // height: 1px;
        background-color: #937f7f;
        margin-bottom: 28px;
    }

    .options {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: #7b858f;
        padding-left: 14px;
        padding-right: 14px;
        cursor: pointer;
    }

    button {
        height: 38px;
        background-color: #6d5858;
        width: 100%;
        border-radius: 19px;
        font-size: 18px;
        font-weight: 600;
        margin-top: 16px;
    }
}

.el-input {
    :deep(.el-input__wrapper) {
        border-radius: 18px !important;
        background-color: transparent;
        height: 38px;
        margin-bottom: 5px;
        font-size: 12px;
        // padding-left: 5px;
        box-shadow: none !important;
        border: 1px solid #cecac9;
        color: black !important;

        .el-input__inner {
            color: rgb(41, 252, 34) !important;
        }
    }
}

:deep(.el-form-item__error) {
    left: 14px !important;
    top: 96% !important;
}
</style>
