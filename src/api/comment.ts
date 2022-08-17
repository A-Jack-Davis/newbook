import request from '@/api/request'
// import { consumers } from 'stream'

// 添加评论 le不传一级  le ="re" 二级
export const addComment = (commentInfo: any, le?: 're') => request.post(`/comment/addcomment/${le}`, commentInfo)

// 获取评论
export const getComment = (article_id: any) => request.get("/comment/getcomment", { params: { article_id } })

// 删除评论 1为一级评论 2为二级评论
export const deleteCommentApi = (id: number, le: 1 | 2) => request.delete(`/comment/deletecomment/${le}`, { params: { id } })

// 点赞评论  le不传一级  le ="re" 二级
export const addCommenLiketApi = (id: number, le?: 2) => request.patch(`/comment/addcommentlike/${le}`, { id })


