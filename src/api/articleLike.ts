import request from '@/api/request'


export const changeLike = (data: { user_id: number, article_id: number }) => request.post(`/like/changelike`, data)
