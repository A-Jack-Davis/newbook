<template>
    <div class="nav">
        <div class="center">
            <div class="logo">
                <!-- <h1>同笔砚</h1> -->
                <img src="../../assets/imgs/logo.png" alt="" @click="router.push('/home/index')">
            </div>
            <div class="menu">
                <el-menu :default-active="activeIndex" class="el-menu-demo" router mode="horizontal"
                    @select="handleSelect">
                    <el-menu-item index="/home/index">首页</el-menu-item>
                    <el-menu-item index="5">文章</el-menu-item>
                    <el-menu-item index="2">闲置</el-menu-item>
                    <el-menu-item index="3">热点</el-menu-item>
                    <el-menu-item index="4">关注</el-menu-item>
                </el-menu>
            </div>
            <div class="search">
                <div>
                    <input type="text" placeholder="探索帖子">
                    <el-icon style="vertical-align: middle">
                        <Search />
                    </el-icon>
                </div>
            </div>
            <div class="aratar">
                <el-avatar :src="BASEURL + userStore.userInfo.avatar" @click="router.push('/home/personalcenter')" />
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <span class="username">
                            {{ userStore.userInfo.nickname ? userStore.userInfo.nickname : userStore.userInfo.user_name
                            }}
                            <el-icon>
                                <ArrowDown />
                            </el-icon>
                        </span>

                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="personalCenter" :icon="User">个人中心</el-dropdown-item>
                            <el-dropdown-item command="postArticle" :icon="User">发布文章</el-dropdown-item>
                            <el-dropdown-item command="loginOut" :icon="Close">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
    <!-- 
        
     -->
<script setup lang='ts'>
import { BASEURL } from "@/const/VARIABLE"
import { ref } from 'vue';
import { Search, ArrowDown, Close, User, } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user.js';
import { useRouter } from 'vue-router';
const router = useRouter()
const userStore = useUserStore()
const activeIndex = ref('1')

const handleSelect = () => { }


const handleCommand = (command: string | number | object) => {

    console.log('command', command)

    switch (command) {
        case 'loginOut':
            window.localStorage.clear()
            router.push('/login')
            break;
        case 'postArticle':
            router.push('/home/postarticle')
            break;
        case 'personalCenter':

            router.push('/home/personalcenter')
            break;

        default:
            break;
    }

}

</script>
    
<style lang='less' scoped>
.nav {
    width: 100%;
    height: 60px;
    background-color: #ffffff;
    border-bottom: 1px solid rgba(239, 223, 223, 0.569);

    .center {
        max-width: 1440px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;

        .logo {
            flex: 4;

            // padding-left: 20px;

            // h1 {
            //     font-size: 32px;
            //     font-weight: 500;
            //     font-style: italic;
            //     color: blue;
            //     line-height: 60px;
            // }
            >img {
                height: 48px;
                margin-left: 20px;
            }
        }

        .menu {
            flex: 8;

            .el-menu {
                border-bottom: none;
            }
        }

        .search {
            flex: 8;

            >div {
                width: 60%;
                height: 36px;
                border: 1px solid #c2c8d1;
                border-radius: 4px;
                overflow: hidden;
                display: flex;
                justify-content: space-between;

                .el-icon {
                    width: 40px;
                    height: 34px;
                    background-color: #f2f3f5;

                }

                input {
                    width: 70%;
                    padding-left: 15px;
                    font-size: 14px;
                    color: #8a919f;
                    line-height: 34px;
                }
            }
        }

        .aratar {
            flex: 4;
            display: flex;
            justify-content: end;
            align-items: center;
            padding-right: 20px;

            .el-avatar {
                margin-right: 15px;
                border: #f2f3f5 0.5px solid;
            }

            .el-dropdown {
                .username {
                    font-size: 16px;
                    color: #0066ff;
                    line-height: 60px;

                    .el-icon {
                        color: black;
                        vertical-align: middle;
                    }
                }
            }
        }

    }
}
</style>    