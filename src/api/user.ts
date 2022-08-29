import request from '@/api/request'

// 注册
export const registerApi = (registerInfo: {
    user_name: string,
    password: string
}) => request.post("/users/register", registerInfo)

// 登录 
export const loginApi = (loginInfo: {
    user_name: string,
    password: string
}) => request.post("/users/login", loginInfo)

// 未登录状态修改密码
export const notLoginPasswordChangeApi = (changeThePasswordInfo: {
    user_name: string,
    password: string,
    phoneNo: string
}) => request.patch("/users/passwordchange", changeThePasswordInfo)

// 已登录状态修改密码
export const loginChangPasswordApi = (changInfo: {
    oldPassword: string,
    password: string,
    confirmPassword: string
}) => request.patch("/users/changepassword", changInfo)

// 获取用户信息
export const getUserInfoApi = () => request.post("/users/getuserinfo")

// 根据id获取用户数据 
export const getUserInfoById = (id: number) => request.get('/users/getuserinfobyid', { params: { id } })

// 修改用户信息
export const editUserDataApi = (updataObj:
    {
        whereOpt: { id: number },
        newUser: {
            user_name: string,
            nickname: string,
            sex: string,
            phoneNo: string,
            address: string,
            school: string,
            Introduction: string
        }
    }) => request.put('/users/upuserdata', updataObj)

// 获取作者榜单
export const getAuthorListApi = (paging: {
    offset: number,
    limit: number,
}) => request.get('/users/getauthors', { params: paging })

// 关注或取消关注
export const attentionApi = (user_id: number, follower_id: number) => request.post(`/relation/follower`, { user_id, follower_id })

// 获取关注的作者列表
export const getFocusUserListApi = (user_id: number) => request.get(`/relation/getwatchlist`, { params: { user_id } })

// 粉丝列表
export const getFansListApi = (follower_id: number, detailedType: number) => request.get(`/relation/getfanslist/${detailedType}`, { params: { follower_id } })



