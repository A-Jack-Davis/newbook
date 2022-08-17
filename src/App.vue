<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">import { onMounted } from 'vue';

function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
  }
  return flag;
}

onMounted(() => {
  console.log('IsPC()', IsPC())
})


</script>

<style lang="css">
html,
body,
#app,
.app {
  height: 100%;
  background-color: #f4f5f5;
}
</style>
