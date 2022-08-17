import { getComment } from "@/api/comment";
import { successNotify, warningNotify } from "@/utils/notification";
import { defineStore } from "pinia";

export const useCommentsStore = defineStore('comments', {
    state: () => {
        return {
            commentList: [
                {
                    id: 0,
                    article_id: 0,
                    like: 0,
                    content: "",
                    user_id: 0,
                    user_name: '',
                    user_nickname: "",
                    user_avatar: "",
                    createdAt: "",
                    "recomments": [
                        {
                            "id": 0,
                            "re_content": '',
                            "comment_id": 0,
                            "like": 0,
                            "user_nickname": '',
                            "user_name": "",
                            "user_id": 0,
                            "user_avatar": "",
                            "type": 0,
                            "f_nickname": '',
                            "f_user_name": '',
                            "f_user_id": 0,
                            "f_user_avatar": "",
                            "f_re_content": '',
                            "createdAt": ""
                        }
                    ]
                }]
        }
    },
    actions: {
        async getCommentlist(article_id: number) {
            const res = await getComment(article_id)

            if (res.code == 200) {
                this.commentList = res.data
            } else {
                warningNotify(res)
            }
        }

    },

    getters: {},



})