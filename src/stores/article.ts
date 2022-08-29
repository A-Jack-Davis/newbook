import { getAandomArticleApi, getArticleStatisticalApi, getOneArtivcle } from "@/api/article";
import { getFansListApi } from "@/api/user";
import { defineStore } from "pinia";

export const useArticleStore = defineStore('article', {
    state: () => {
        return {
            articleInfo: {
                id: 0,
                title: "",
                content: "",
                cover_url: "",
                createdAt: "",
                introduction: "",
                pageviews: 0,
                comments: 0,
                like: NaN,
                user: {
                    id: 0,
                    nickname: "",
                    avatar: ""
                },
                articleLikes: [NaN],
                collectorUserList: [NaN],
                fonsList: [NaN]
            },
            articleStatistical: {
                articleCount: 0,
                collectionCount: 0,
                likeCount: 0,
                pageviewsCount: 0
            },
            randomArticleList: [{
                id: 0,
                title: "",
                pageviews: 0,
                comments: 0,
                like: 0,
            }],
        }
    },
    actions: {
        // 获取单个文章信息
        async getArticleIno(id: number) {
            const res = await getOneArtivcle(id)
            if (res.code === 200) {
                const fans = await getFansListApi(res.data.user.id, 2)
                if (fans.code === 200) {
                    res.data.fonsList = fans.data
                }
                this.articleInfo = res.data
                window.localStorage.setItem('articleStore', JSON.stringify({ articleInfo: res.data }))
            }
        },
        // 获取文章统计信息
        async getArticleStatistical(user_id: number) {
            const res = await getArticleStatisticalApi(user_id)
            if (res.code === 200) {
                this.articleStatistical = res.data
            }
        },
        // 获取随机文章列表
        async getAandomArticle(limit: number) {
            const res = await getAandomArticleApi(limit)
            if (res.code) {
                this.randomArticleList = res.data
            }
        }
    },

    getters: {},

    persist: [
        {
            key: "articleStore",
            paths: ['articleInfo'],
            storage: localStorage,
        },
    ],


})