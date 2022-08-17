import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi } from '@/api/user'
import { User } from '@element-plus/icons-vue'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            token: "",
            userInfo: {
                Introduction: "",
                address: "",
                avatar: "",
                bgcimg: "",
                id: NaN,
                is_admin: false,
                nickname: "",
                phoneNo: "",
                school: "",
                sex: "",
                user_name: "",
            }
        }
    },
    actions: {
        async login(loginInfo: { user_name: string, password: string }) {
            const res = await loginApi(loginInfo)
            if (res.code === 200) {
                this.token = res.token;
                this.userInfo = res.data
                window.localStorage.setItem('userStore', JSON.stringify({ token: res.token, userInfo: res.data }))
            }
            delete res.token
            return res
        },
        async getUserInfo() {
            const res = await getUserInfoApi()
            if (res.code === 200) {
                this.userInfo = res.data
            }
            return res
        }
    },
    getters: {

    },
    // persist: {
    //     key: "userData",
    //     //保存的位置
    //     storage: window.localStorage,//localstorage
    // },
    persist: [
        {
            key: "userStore",
            paths: ['userInfo', 'token'],
            storage: localStorage,
        },
    ],

})