import axios from "axios";
const onlineApi = axios.create({

})



//响应拦截器
onlineApi.interceptors.response.use(res => {
    return res.data
}, err => {
    console.log(err);
    return Promise.reject(new Error(err))
})

declare module 'axios' {
    export interface AxiosResponse<T = any> extends Promise<T> { }
}


export const getNewsChannelApi = () => onlineApi.get("http://route.showapi.com/109-34?showapi_appid=1143784&showapi_sign=c0ce554f605b4e939dcbfdda08d787cb")
export const getNewsApi = (newsQueryInfo: any) => onlineApi.get("http://route.showapi.com/109-35?showapi_appid=1143784&showapi_sign=c0ce554f605b4e939dcbfdda08d787cb", { params: newsQueryInfo })

export const getNewsByIdApi = (newsQueryInfo: any) => onlineApi.get('http://route.showapi.com/109-35?showapi_appid=1143784&showapi_sign=c0ce554f605b4e939dcbfdda08d787cb', { params: newsQueryInfo })


export const getNewsByTitleApi = (newsQueryInfo: any) => onlineApi.get('http://route.showapi.com/109-35?showapi_appid=1143784&showapi_sign=c0ce554f605b4e939dcbfdda08d787cb', { params: newsQueryInfo })













