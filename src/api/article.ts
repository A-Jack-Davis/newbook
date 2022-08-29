import request from '@/api/request'

// 清空temporary
export const emptytemporaryApi = () => request.post('/article/emptytemporary')


// 创建一篇文章
export const addArticleApi = (articleInfo: {
    user_id: number,
    cover_url: string,
    title: string,
    content: string,
    introduction: string
}) => request.post('/article/createarticle', articleInfo)

// 编辑文章
export const editorArticleApi = (
    editorArticleInfo: {
        user_id: number,
        cover_url: string,
        title: string,
        content: string,
        introduction: string
    },
    article_id: number) => request.post('/article/editorarticle', { editorArticleInfo, article_id })

// 删除文章
export const deleteArticleApi = (article_id: number) => request.get('/article/deletearticle', { params: { id: article_id } })


/** 
 * @description: 文章封面图片上传
 * @param {file} data 二进制  
 * @param {string} type articleimg文件类型  
 * @return {object}
 */
export const theArticleImageUploadApi = (data: any) => request.post(`/users/fileupload/articleimg`, data)
// 编辑文章封面
export const theChangeArticleImageUploadApi = (data: any, article_id: number) => request.post(`/users/fileupload/editorarticleimg?article_id=${article_id}`, data)

// 分页获取文章数据
export const getAllArticleApi = (pageInfo: {
    offset: number,
    limit: number,
    order: string
}) => request.get('/article/getallarticle', { params: pageInfo })

// 根据id查找文章
export const getOneArtivcle = (id: number) => request.get('/article/getonearticle', { params: { id } })


// 获取用户发布的文章
export const getUserArticleApi = (queryInfo: {
    offset: number,
    limit: number,
    order: string,
}) => request.get('/article/getuserarticle', { params: queryInfo })

// 搜索文章
export const getArticlebySearchApi = (queryInfo: {
    offset: number,
    limit: number,
    order: string,
    search: string
}) => request.get('/article/getarticlebysearch', { params: queryInfo })

// 获取推荐文章
export const getAandomArticleApi = (limit: number) => request.get('/article/getrandomarticle', { params: { limit } })

// 递增api
export const addPageviewsApi = (article_id: number) => request.patch('/article/addpageviews', { id: article_id })

// 获取文章统计
export const getArticleStatisticalApi = (user_id: any) => request.get('/article/getarticlestatistical', { params: { user_id } })

// 收藏文章 或 取消收藏 
export const collectApi = (user_id: number, article_id: number) => request.post('/favorite/collector', { user_id, article_id })

// 获取用户收藏的文章
export const getCollectArticleListApi = (queryInfo: {
    offset: number,
    limit: number,
    order: string,
    user_id: number
}) => request.get('/favorite/getcollectorarticle', { params: queryInfo })

// 获取用户点赞的文章
export const getLikeArticleListApi = (queryInfo: {
    offset: number,
    limit: number,
    order: string,
    user_id: number
}) => request.get('/like/getlikearticle', { params: queryInfo })

// 关注列表用户的文章
export const getFovusOnArticleListApi = (queryInfo: {
    offset: number,
    limit: number,
    order: string,
    user_id: number
}) => request.get('/relation/relationarticle', { params: queryInfo })

// 用户给文章点赞
export const changeLike = (data: { user_id: number, article_id: number }) => request.post(`/like/changelike`, data)


