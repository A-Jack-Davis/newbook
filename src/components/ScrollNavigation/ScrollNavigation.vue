<template>
    <!-- 滚动导航 -->
    <div class="list_cantianer" @mouseenter="stop" @mouseleave="move" @click="clike_back($event, 1)">
        <ul class="scoll" :style="{ 'left': left + 'px' }">
            <!-- 滚动项 -->
            <li v-for="(channel, index) in channelList" :class="{ 'li_width': index == 0 }" :data-index="index"
                :key="channel.channelId">
                {{ channel.name }}
            </li>
            <li v-for="(channel, index) in channelList" :data-index="index" :key="channel.channelId">
                {{ channel.name }}
            </li>
        </ul>
    </div>
</template>
    
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
//  滚动项宽度
const li_width = ref(0)
// 定位偏移量
const left = ref(0)
// 是否进行滚动
const stopAnimationFrame = ref<any>(0)


onMounted(() => {
    _get_li_width()
    move()
})

// 获取滚动项宽度
function _get_li_width() {
    const li: any = document.querySelector('.li_width')
    li_width.value = li?.offsetWidth
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
        left.value -= 1
        if (left.value <= -(li_width.value * 10 + 14)) {
            left.value = -1
        }
        stopAnimationFrame.value = window.requestAnimationFrame(callBack);
    });
}

// 停止滚动
function stop() {
    window.cancelAnimationFrame(stopAnimationFrame.value);
}

// 点击回调 用于调用 组件自定义事件，把 “频道index” 抛出
function clike_back(e: Event, a: number) {
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