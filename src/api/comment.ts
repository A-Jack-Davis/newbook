import request from '@/api/request'

// 添加评论 le不传一级  le ="re" 二级
export const addComment = (commentInfo: any, le?: 're') => request.post(`/comment/addcomment/${le}`, commentInfo)

// 获取评论
export const getComment = (article_id: number) => request.get("/comment/getcomment", { params: { article_id } })

// 点赞评论  le不传一级  le ="re" 二级
export const addCommenLiketApi = (id: number, le?: 2) => request.patch(`/comment/addcommentlike/${le}`, { id })

// 删除评论 1为一级评论 2为二级评论
export const deleteCommentApi = (le: 1 | 2, id: number, article_id?: number,) => request.delete(`/comment/deletecomment/${le}`, { params: { article_id, id } })