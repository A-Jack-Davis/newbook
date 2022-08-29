<template>
    <div class="main">
        <el-collapse v-model="activeName" accordion>
            <el-empty description="无" v-if="list!.length == 0" />

            <!-- 关注或粉丝列表 -->
            <el-collapse-item :name="index" v-for="(focus_fans, index) in list" :key="focus_fans.id">
                <template #title>
                    <div class="user">
                        <!-- 头像、用户名 -->
                        <div @click="toOtherUser(focus_fans.id)">
                            <img :src="BASEURL + focus_fans.avatar">
                            <span>{{  focus_fans.nickname  }}</span>
                        </div>

                        <!-- 粉丝页面关注或互相关注 -->
                        <div v-if="userStore.is_self && $route.path == '/home/personalcenter/userfans'">
                            <el-button size="small" plain @click.stop="attention(userStore.userInfo.id, focus_fans.id)"
                                v-if="focusList_id.includes(focus_fans.id)">互相关注
                            </el-button>
                            <el-button size="small" type="primary" plain v-else
                                @click.stop="attention(userStore.userInfo.id, focus_fans.id)">回关
                            </el-button>
                        </div>

                        <!-- 关注页面 关注和已关注 -->
                        <div v-else v-if="focus_fans.id != userStore.userInfo.id">
                            <el-button size="small" plain @click.stop="attention(userStore.userInfo.id, focus_fans.id)"
                                v-if="focusList_id.includes(focus_fans.id)">已关注
                            </el-button>
                            <el-button size="small" type="primary" plain
                                @click.stop="attention(userStore.userInfo.id, focus_fans.id)" v-else>关注
                            </el-button>
                        </div>
                    </div>
                </template>
                <!-- 用户简介 -->
                <div class="content">
                    {{  focus_fans.Introduction  }}
                    <el-empty description="无简介" v-if="!focus_fans.Introduction" />
                </div>
            </el-collapse-item>

        </el-collapse>
    </div>
</template>
    
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"
import { onMounted, reactive, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user';
import { attentionApi, getFocusUserListApi } from "@/api/user";
import { useRoute, useRouter } from "vue-router";
const activeName = ref(0)
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
onMounted(() => {
    getfocus_fans_List()
    getFocusList_id()
})

// 去个人中心
async function toOtherUser(cid: number) {
    if (cid != userStore.userInfo.id) {
        userStore.is_self = false
        await userStore.getOtherInfo(cid)
    } else {
        userStore.is_self = true
    }
    router.push(`/home/personalcenter`);
}

// 获取关注列表或粉丝列表
async function getfocus_fans_List() {
    // const user_id = userStore.is_self ? userStore.userInfo.id : userStore.otherInfo.id
    let res
    switch (route.path) {
        case '/home/personalcenter/userfocuson':
            userStore.getFocus_List()
            break;
        case '/home/personalcenter/userfans':
            userStore.getFans_List()
            break;
        default:
            break;
    }

}
// 获取关注列表id
async function getFocusList_id() {
    let res = await getFocusUserListApi(userStore.userInfo.id)
    focusList_id.length = 0
    focusList_id.push(...res.data.map((item: any) => item.id))
}

// 判断是关注还是粉丝
const list = computed(() => {
    if (route.path == '/home/personalcenter/userfocuson') {
        return userStore.focusList
    }
    if (route.path == '/home/personalcenter/userfans') {
        return userStore.fansList
    }
})


// 关注列表id
const focusList_id = reactive<Array<number>>([])


// 关注或取消关注
async function attention(user_id: number, follower_id: number) {
    const res = await attentionApi(user_id, follower_id)
    await getFocusList_id()
    if (userStore.is_self) {
        userStore.getFocus_List()
    }
}



</script>
    
<style lang='less' scoped>
.main {
    margin-top: 10px;
    padding-left: 20px;
    padding-right: 10px;

    .user {

        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 20px;

        img {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 15px;
        }
    }

    .content {
        margin-top: 10px;
        text-indent: 2em;
        font-size: 14px !important;
    }
}
</style>