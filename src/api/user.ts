import request from '@/api/request'

/** 
 * @description: 注册
 * @param {object} registerInfo {user_name, password}
 * @return {object} { id , user_name }
 */
export const registerApi = (registerInfo: any) => request.post("/users/register", registerInfo)


/** 
 * @description: 登录 
 * @param {object} loginInfo {user_name, password}
 * @return {object} { data ,token }
 */
export const loginApi = (loginInfo: any) => request.post("/users/login", loginInfo)


/** 
 * @description: 未登录状态修改密码
 * @param {object} changeThePasswordInfo { user_name, password, phoneNo}
 * @return {object} { id , user_name }
 */
export const notLoginPasswordChangeApi = (changeThePasswordInfo: any) => request.patch("/users/passwordchange", changeThePasswordInfo)


/** 
 * @description: 已登录状态修改密码
 * @param {object} changInfo { oldPassword, password, confirmPassword}
 * @return {undefined}  
 */
export const loginChangPasswordApi = (changInfo: any) => request.patch("/users/changepassword", changInfo)


/** 
 * @description: 获取用户信息
 * @param {object}  
 * @return {object} {用户详细数据}
 */
export const getUserInfoApi = () => request.post("/users/getuserinfo")


/** 
 * @description: 修改用户信息
 * @param {object} updataObj  {whereOpt:条件, newUser:待更新数据}
 * @return {undefined}
 */
export const editUserDataApi = (updataObj: any) => request.put('/users/upuserdata', updataObj)


