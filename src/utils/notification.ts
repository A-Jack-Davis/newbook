import { ElNotification } from "element-plus";

export const successNotify = (res: { code?: number, message: string, data?: any, [prop: string]: any }) => {
    ElNotification({
        title: '提示',
        message: res.message,
        type: 'success',
        position: 'bottom-right',
        duration: 1300,
    })
}

export const warningNotify = (res: { code?: number, message: string, data?: any, [prop: string]: any }) => {
    ElNotification({
        title: '警告',
        message: res.message,
        type: 'warning',
        position: 'top-right',
        duration: 1300,
    })
}