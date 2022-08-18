import request from '@/api/request'
// import { consumers } from 'stream'

/** 
 * @description: 清空temporary
 * @return {Boolean}  
 */
export const emptytemporaryApi = () => request.post('/article/emptytemporary')


/** 
 * @description: 创建一篇文章
 * @param {object} body { 文章信息}
 * @return {object} { 文章信息}
 */
export const addArticleApi = (articleInfo: any) => request.post('/article/createarticle', articleInfo)


/** 
 * @description: 分页获取文章数据
 * @param {object} params 分页信息{ offset: 0, limit: 15  }
 * @return {object}
 */
export const getAllArticleApi = (params: any) => request.get('/article/getallarticle', { params: params })

/** 
 * @description: 文章封面图片上传
 * @param {file} data 二进制  
 * @param {string} type articleimg文件类型  
 * @return {object}
 */
export const theArticleImageUploadApi = (data: any) => request.post(`/users/fileupload/articleimg`, data)


// 根据id查找文章
export const getOneArtivcle = (id: number) => request.get('/article/getonearticle', { params: { id } })

// 递增api
export const addPageviewsApi = (article_id: number) => request.patch('/article/addpageviews', { id: article_id })