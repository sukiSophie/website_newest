<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMusicStore } from '@/stores/music'
const aplayerRef = ref<HTMLElement>()
const musicStore = useMusicStore()
onMounted(() => {
  if (aplayerRef.value) {
    musicStore.initPlayer(aplayerRef.value)
    setInterval(musicStore.updateLrc, 500)
  }
})
</script>
<template>
  <div style="display:none"><div id="aplayer" ref="aplayerRef"></div></div>
</template> 