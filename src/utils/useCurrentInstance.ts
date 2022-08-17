import { ComponentInternalInstance, getCurrentInstance } from 'vue'
export default function getGlobalProperties() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    const globalProperties = appContext.config.globalProperties
    return {
        globalProperties
    }
}