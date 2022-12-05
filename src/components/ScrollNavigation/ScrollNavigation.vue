<template>
    <!-- 滚动导航 -->
    <div class="list_cantianer" @mouseenter="stop" @mouseleave="move" @click="clike_back($event)">
        <ul class="scoll" :style="{ 'left': left + 'px' }">
            <!-- 滚动项 -->
            <li v-for="(channel, index) in channelList" class="li_width" :data-index="index" :key="channel.channelId">
                {{ channel.name }}
            </li>
            <li v-for="(channel, index) in channelList" :data-index="index" :key="channel.channelId">
                {{ channel.name }}
            </li>
        </ul>
    </div>
</template>
    
<script setup lang='ts'>
import { Lollipop } from '@element-plus/icons-vue';
import { onMounted, ref, nextTick } from 'vue';
//  滚动项宽度
const li_width = ref(0)
// 定位偏移量
const left = ref(0)
// 是否进行滚动
const stopAnimationFrame = ref<any>(0)


onMounted(() => {
    nextTick(() => {
        _get_li_width()
        move()
    })
})

// 获取滚动项宽度
function _get_li_width() {
    const li: any = document.querySelector('.li_width')
    console.log('li', li)
    li_width.value = li?.offsetWidth
    console.log(' ', li_width.value, 'asfdfk')
}

// 用于接收频道列表
const prpos = defineProps<{
    channelList: Array<{
        channelId: string,
        name: string
    }>
}>()

// 组件自定义事件，用于把 “频道index” 抛出
const emit = defineEmits(['channel'])

// 开启滚动
function move() {
    stopAnimationFrame.value = window.requestAnimationFrame(function callBack() {
        left.value -= 1.5
        // if (left.value <= -(84 * prpos.channelList.length + 14)) {
        if (left.value <= -4345) {
            left.value = -1.5
            console.log('done')
        }
        console.log(' ', left.value)
        stopAnimationFrame.value = window.requestAnimationFrame(callBack);
    });
}

// 停止滚动
function stop() {
    window.cancelAnimationFrame(stopAnimationFrame.value);
}

// 点击回调 用于调用 组件自定义事件，把 “频道index” 抛出
function clike_back(e: Event) {
    const channel_index = (e.target as HTMLElement).getAttribute('data-index')
    emit('channel', channel_index)
}

</script>
    
<style lang='less' scoped>
.list_cantianer {
    width: 100%;
    height: 30px;
    line-height: 30px;
    overflow: hidden;

    ul {
        user-select: none;
        position: relative;
        width: 5000px;
        list-style: none;

        li {
            cursor: pointer;
            float: left;
            padding: 0 14px;
            font-size: 14px;
        }
    }
}
</style>