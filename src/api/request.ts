import axios from "axios";
import { BASEURL } from "@/const/VARIABLE"
const request = axios.create({
    // baseURL: "/api",
    // baseURL: "http://150.158.179.236:8889/api",
    baseURL: BASEURL,

    timeout: 5000
})

//请求拦截器
request.interceptors.request.use(config => {
    let userStore = JSON.parse(window.localStorage.getItem('userStore') as string)
    // // 判断token存在再做配置
    if (userStore) {
        // 注意：token前边有 'Bearer ' 的信息前缀,API接口需求，Bearer后边有空格
        config.headers!.authorization = 'Bearer ' + userStore.token
    }

    return config
})

//响应拦截器
request.interceptors.response.use(res => {
    return res.data
}, err => {
    console.log(err);
    return Promise.reject(new Error(err))
})

declare module 'axios' {
    export interface AxiosResponse<T = any> extends Promise<T> { }
}



export default request