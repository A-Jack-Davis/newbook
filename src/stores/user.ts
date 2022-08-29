import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi, getUserInfoById, getFocusUserListApi, getFansListApi } from '@/api/user'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            is_self: true,
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
                createdAt: ""
            },
            otherInfo: {
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
                createdAt: ""
            },
            focusList: [{
                Introduction: '',
                address: '',
                avatar: '',
                bgcimg: '',
                id: 0,
                // is_admin: false,
                nickname: '',
                phoneNo: '',
                school: '',
                sex: '',
                user_name: '',
            }],
            focusList_id: [],
            fansList: [{
                Introduction: '',
                address: '',
                avatar: '',
                bgcimg: '',
                id: 0,
                // is_admin: false,
                nickname: '',
                phoneNo: '',
                school: '',
                sex: '',
                user_name: '',
            }],


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
        },
        async getOtherInfo(user_id: number) {
            const res = await getUserInfoById(user_id)
            if (res.code === 200) {
                this.otherInfo = res.data
            }
            return res
        },
        async getFocus_List() {
            let user_id = this.is_self ? this.userInfo.id : this.otherInfo.id
            const res = await getFocusUserListApi(user_id)
            this.focusList = res.data
        },
        async getFans_List() {
            let user_id = this.is_self ? this.userInfo.id : this.otherInfo.id
            const res = await getFansListApi(user_id, 1)
            this.fansList = res.data

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
            paths: ['userInfo', 'token', 'otherInfo', 'is_self'],
            storage: localStorage,
        },
    ],

})