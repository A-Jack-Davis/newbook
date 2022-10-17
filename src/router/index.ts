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
                component: () => import('@/views/PersonalCenter/PersonalCenter.vue'),
                children: [
                    {
                        path: 'userarticle',
                        name: 'userarticle',
                        component: () => import('@/views/AllArticle/AllArticle.vue'),
                    },
                    {
                        path: 'usercollect',
                        name: "usercollect",
                        component: () => import('@/views/AllArticle/AllArticle.vue'),
                    },
                    {
                        path: 'userlike',
                        name: "userlike",
                        component: () => import('@/views/AllArticle/AllArticle.vue'),
                    },
                    {
                        path: 'userfocuson',
                        name: "userfocuson",
                        component: () => import('@/views/PersonalCenter/DetailList/UserFocusOn/UserFocusOn.vue'),
                    },
                    {
                        path: 'userfans',
                        name: "userfans",
                        component: () => import('@/views/PersonalCenter/DetailList/UserFocusOn/UserFocusOn.vue'),
                    },
                    {
                        path: '',
                        name: "",
                        redirect: '/home/personalcenter/userarticle',
                    }
                ]
            },
            {
                path: 'postarticle',
                component: () => import('@/views/PostArticle/PostArticle.vue'),
                meta: {
                    hideHeader: true
                }
            },
            {
                path: "index",
                component: () => import("@/views/Index/Index.vue"),

            },
            {
                path: "focuson",
                component: () => import("@/views/FocusOn/FocusOn.vue"),

            },
            {
                path: 'article/:toComment?',
                name: "article",
                component: () => import("@/views/Article/Article.vue"),
            },
            {
                path: "authors",
                component: () => import("@/views/Authors/Authors.vue")
            },
            {
                path: "newslist",
                component: () => import("@/views/NewsList/NewsList.vue")
            },
            {
                path: "news",
                component: () => import('@/views/News/News.vue')
            }
        ]
    },


]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        if (savedPosition) {
            return savedPosition
        } else {
            return { left: 0, top: 0 }
        }
    },
})

export default router