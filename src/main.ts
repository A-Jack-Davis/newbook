import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../src/assets/styles/reset.css'
import 'element-plus/dist/index.css'
import '@/assets/styles/normalize.css'
import stroe from '@/stores/index'

// 引入iconfont
import "@/assets/iconfont/iconfont"
import "@/assets/iconfont/iconfont.css"

//  无限滚动
import InfiniteScroll from "element-plus";

// 引入发v-md-editor
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// 代码行号
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';


import Prism from 'prismjs';

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});
VMdPreview.use(vuepressTheme, {
    Prism,
});

// 代码行号
VueMarkdownEditor.use(createLineNumbertPlugin());
VMdPreview.use(createLineNumbertPlugin());

const app = createApp(App).use(stroe).use(VueMarkdownEditor).use(VMdPreview).use(InfiniteScroll).use(router)
app.mount('#app')