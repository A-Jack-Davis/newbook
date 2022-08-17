import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login/Login.vue'),
    },
    {
        path: '',
        redirect: '/login',
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/Home.vue'),
        children: [
            {
                path: 'personalcenter',
                name: "personalcenter",
                component: () => import('@/views/PersonalCenter/PersonalCenter.vue')
            },
            {
                path: 'postarticle',
                component: () => import('@/views/PostArticle/PostArticle.vue'),
                meta: {
                    // 
                    hideHeader: true
                }
            },
            {
                path: "index",
                component: () => import("@/views/Index/Index.vue"),

            },
            {
                path: 'article/:toComment?',
                name: "article",
                component: () => import("@/views/Article/Article.vue"),
            }
        ]
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0 }
    },
})

export default router