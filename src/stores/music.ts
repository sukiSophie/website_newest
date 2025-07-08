import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import APlayer from 'aplayer'

export const useMusicStore = defineStore('music', () => {
    const server = 'netease'
    const type = 'playlist'
    const id = '13939160715'
    const musicData = ref<any[]>([])
    const currentIndex = ref(0)
    const isPlaying = ref(false)
    const currentMusic = ref<{ name: string; artist: string; cover?: string }>({ name: '', artist: '', cover: '' })
    const currentTime = ref(0)
    const duration = ref(0)
    const volume = ref(0.5)
    const currentLrc = ref('')
    let ap: any = null

    async function initPlayer(container: HTMLElement) {
        if (ap) return
        try {
            const response = await axios.get(`https://api.injahow.cn/meting/?server=${server}&type=${type}&id=${id}`)
            musicData.value = response.data
            if (musicData.value && musicData.value.length > 0) {
                ap = new APlayer({
                    container,
                    order: 'random',
                    preload: 'auto',
                    listMaxHeight: '336px',
                    volume: 0.5,
                    mutex: true,
                    lrcType: 3,
                    audio: musicData.value,
                })
                bindEvents()
                updateCurrent()
                updatePlayState()
                updateLrc()
                updateTime()
            }
        } catch (error) {
            console.error('音乐播放器加载失败:', error)
        }
    }
    function bindEvents() {
        if (!ap) return
        ap.on('play', () => { updateCurrent(); updatePlayState() })
        ap.on('pause', () => { updatePlayState() })
        ap.on('listswitch', () => { updateCurrent(); updateLrc() })
        ap.on('switch', () => { updateCurrent(); updateLrc() })
        ap.on('timeupdate', () => { updateTime(); updateLrc() })
    }
    function updateCurrent() {
        if (!ap) return
        const idx = ap.list?.index ?? 0
        currentIndex.value = idx
        const audio = ap.list?.audios?.[idx] || {}
        currentMusic.value = {
            name: audio.name || '',
            artist: audio.artist || '',
            cover: audio.cover || ''
        }
    }
    function updateLrc() {
        const lrcEl = document.querySelector('.aplayer-lrc-current')
        currentLrc.value = lrcEl ? lrcEl.textContent || '' : ''
    }
    function updateTime() {
        if (!ap) return
        currentTime.value = ap.audio.currentTime || 0
        duration.value = ap.audio.duration || 0
    }
    function updatePlayState() {
        isPlaying.value = ap?.audio?.paused === false
    }
    function play() { ap?.play() }
    function pause() { ap?.pause() }
    function toggle() { ap?.toggle() }
    function skipBack() { ap?.skipBack() }
    function skipForward() { ap?.skipForward() }
    function seek(t: number) { ap?.seek(t) }
    function setVolume(v: number) { ap?.volume(v, true); volume.value = v }
    function playIndex(idx: number) { ap?.list?.switch?.(idx) }
    function getAP() { return ap }
    return {
        musicData,
        currentIndex,
        isPlaying,
        currentMusic,
        currentTime,
        duration,
        volume,
        currentLrc,
        initPlayer,
        play,
        pause,
        toggle,
        skipBack,
        skipForward,
        seek,
        setVolume,
        playIndex,
        getAP,
        updateLrc,
    }
}) 