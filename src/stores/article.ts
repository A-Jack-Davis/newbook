import { getOneArtivcle } from "@/api/article";
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
                articleLikes: [NaN]
            }
        }
    },
    actions: {
        // 获取单个文章信息
        async getArticleIno(id: number) {
            const res = await getOneArtivcle(id)
            if (res.code === 200) {
                this.articleInfo = res.data
                window.localStorage.setItem('articleStore', JSON.stringify({ articleInfo: res.data }))
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