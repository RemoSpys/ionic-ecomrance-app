<template>
  <div class="voice-recorder">
    <div class="waveform-container" ref="waveformContainer" @click="seekTo">
      <div class="bar-wrapper">
        <div
          v-for="(bar, i) in displayBars"
          :key="i"
          class="bar"
          :style="{
            height: bar * 100 + '%',
            opacity: getBarOpacity(i),
            background: getBarColor(i)
          }"
        ></div>
      </div>
      <div v-if="isRecording" class="recording-indicator">
        <div class="pulse"></div>
        <span>{{ recordingTime }}</span>
      </div>
    </div>

    <div class="controls">
      <button 
        class="circle-btn" 
        :class="{ recording: isRecording }" 
        @click="toggleRecord"
      >
        <ion-icon :icon="isRecording ? stopOutline : micOutline"></ion-icon>
      </button>

      <div class="playback" v-if="audioUrl && !isRecording">
        <button class="play-btn" @click="togglePlay">
          <ion-icon :icon="isPlaying ? pauseOutline : playOutline"></ion-icon>
        </button>

        <div class="time-display">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>

        <div class="speed-controls">
          <button 
            v-for="rate in [1, 1.5, 2]" 
            :key="rate"
            class="speed-btn"
            :class="{ active: playbackRate === rate }"
            @click="setSpeed(rate)"
          >
            {{ rate }}×
          </button>
        </div>
        
        <div class="cloud-actions">
          <button class="cloud-btn upload-btn" @click="saveToStorage" title="Save to Storage">
            <ion-icon :icon="cloudUploadOutline" />
          </button>
          <button class="cloud-btn download-btn" @click="downloadRecording" title="Download">
            <ion-icon :icon="downloadOutline" />
          </button>
        </div>
      </div>
    </div>

    <audio ref="audioElement" @timeupdate="updateProgress" @loadedmetadata="onAudioLoaded"></audio>
  </div>
</template>

<script setup>
import { IonIcon } from "@ionic/vue"
import { ref, computed, onUnmounted } from "vue"
import { micOutline, stopOutline, playOutline, pauseOutline, cloudUploadOutline, downloadOutline } from "ionicons/icons"
import { auth, storage } from "@/firebase/config"
import { ref as sRef, uploadBytes } from "firebase/storage"

const emit = defineEmits(['saved'])

const isRecording = ref(false)
const isPlaying = ref(false)
const audioUrl = ref(null)
const playbackRate = ref(1)
const currentTime = ref(0)
const duration = ref(0)
const recordingTime = ref("0:00")
const seekedPosition = ref(null)

const waveformContainer = ref(null)
const audioElement = ref(null)

let mediaRecorder = null
let audioChunks = []
let waveformBars = []
let analyser = null
let audioContext = null
let animationFrame = null
let recordingInterval = null
let recordingStartTime = 0
let recordedBlob = null

const BAR_COUNT = 60
const displayBars = ref(Array(BAR_COUNT).fill(0.1))

const currentBarIndex = computed(() => {
  if (!duration.value) return 0
  return Math.floor((currentTime.value / duration.value) * displayBars.value.length)
})

const seekedBarIndex = computed(() => {
  if (seekedPosition.value === null || !duration.value) return null
  return Math.floor((seekedPosition.value / duration.value) * displayBars.value.length)
})

const getBarOpacity = (index) => {
  if (isRecording.value || !audioUrl.value) return 1
  
  if (isPlaying.value) {
    return index <= currentBarIndex.value ? 1 : 0.3
  }
  
  if (seekedPosition.value !== null) {
    return index <= seekedBarIndex.value ? 1 : 0.3
  }
  
  return index <= currentBarIndex.value ? 1 : 0.3
}

const getBarColor = (index) => {
  if (isRecording.value || !audioUrl.value) return '#94a3b8'
  
  if (isPlaying.value) {
    return index <= currentBarIndex.value ? '#007aff' : '#94a3b8'
  }
  
  if (seekedPosition.value !== null) {
    return index <= seekedBarIndex.value ? '#5ac8fa' : '#94a3b8'
  }
  
  return index <= currentBarIndex.value ? '#007aff' : '#94a3b8'
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const updateRecordingTime = () => {
  const elapsed = (Date.now() - recordingStartTime) / 1000
  recordingTime.value = formatTime(elapsed)
}

const captureWaveform = () => {
  if (!analyser || !isRecording.value) return

  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteFrequencyData(dataArray)

  let sum = 0
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i]
  }
  const average = sum / dataArray.length
  const normalized = Math.min(average / 128, 1)

  waveformBars.push(Math.max(normalized, 0.1))

  const start = Math.max(0, waveformBars.length - BAR_COUNT)
  displayBars.value = waveformBars.slice(start).concat(
    Array(Math.max(0, BAR_COUNT - waveformBars.length)).fill(0.1)
  )

  animationFrame = requestAnimationFrame(captureWaveform)
}

const startRecording = async () => {
  try {
    audioChunks = []
    waveformBars = []
    displayBars.value = Array(BAR_COUNT).fill(0.1)
    seekedPosition.value = null
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    mediaRecorder = new MediaRecorder(stream)
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.8
    
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      processRecording()
      stream.getTracks().forEach(track => track.stop())
    }

    isRecording.value = true
    recordingStartTime = Date.now()
    mediaRecorder.start()
    
    recordingInterval = setInterval(updateRecordingTime, 100)
    captureWaveform()

  } catch (error) {
    console.error('Error accessing microphone:', error)
    alert('Could not access microphone. Please check permissions.')
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }
  
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
  
  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
  
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
  
  isRecording.value = false
}

const processRecording = () => {
  recordedBlob = new Blob(audioChunks, { type: 'audio/webm' })
  audioUrl.value = URL.createObjectURL(recordedBlob)
  
  if (audioElement.value) {
    audioElement.value.src = audioUrl.value
    audioElement.value.load()
  }

  if (waveformBars.length > 0) {
    const newBars = []
    const step = waveformBars.length / BAR_COUNT
    
    for (let i = 0; i < BAR_COUNT; i++) {
      const start = Math.floor(i * step)
      const end = Math.floor((i + 1) * step)
      let sum = 0
      let count = 0
      
      for (let j = start; j < end && j < waveformBars.length; j++) {
        sum += waveformBars[j]
        count++
      }
      
      newBars.push(count > 0 ? sum / count : 0.1)
    }
    
    displayBars.value = newBars
  }
}

const toggleRecord = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const togglePlay = () => {
  if (!audioElement.value) return
  
  if (isPlaying.value) {
    audioElement.value.pause()
    isPlaying.value = false
  } else {
    seekedPosition.value = null
    audioElement.value.play()
    isPlaying.value = true
    setSpeed(playbackRate.value)
  }
}

const setSpeed = (rate) => {
  playbackRate.value = rate
  if (audioElement.value) {
    audioElement.value.playbackRate = rate
  }
}

const seekTo = (event) => {
  if (!audioElement.value || !audioUrl.value || isRecording.value) return
  
  const rect = waveformContainer.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = x / rect.width
  const newTime = percentage * duration.value
  
  seekedPosition.value = newTime
  audioElement.value.currentTime = newTime
}

const updateProgress = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

const onAudioLoaded = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
    
    audioElement.value.onended = () => {
      isPlaying.value = false
      currentTime.value = 0
      seekedPosition.value = null
    }
  }
}

const saveToStorage = async () => {
  if (!recordedBlob || !auth.currentUser) {
    alert('Please record audio first and make sure you are logged in')
    return
  }

  try {
    const uid = auth.currentUser.uid
    const timestamp = Date.now()
    const fileName = `voice-memo-${timestamp}.webm`
    const path = `uploads/${uid}/${fileName}`

    const fileRef = sRef(storage, path)
    await uploadBytes(fileRef, recordedBlob)

    alert('Voice memo saved to your files!')
    emit('saved')
  } catch (error) {
    console.error('Save error:', error)
    alert('Failed to save voice memo: ' + error.message)
  }
}

const downloadRecording = () => {
  if (!audioUrl.value) return

  const a = document.createElement('a')
  a.href = audioUrl.value
  a.download = `voice-memo-${Date.now()}.webm`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  if (recordingInterval) clearInterval(recordingInterval)
  if (audioContext) audioContext.close()
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
})
</script>

<style scoped>
.voice-recorder {
  background: #ffffff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.waveform-container {
  width: 100%;
  height: 100px;
  background: #f8fafc;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 16px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.bar-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 2px;
}

.bar {
  flex: 1;
  background: #94a3b8;
  border-radius: 3px;
  min-height: 4px;
  transition: all 0.15s ease;
}

.bar:hover {
  opacity: 0.8 !important;
}

.recording-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(239, 68, 68, 0.1);
  padding: 4px 10px;
  border-radius: 16px;
}

.pulse {
  width: 6px;
  height: 6px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.recording-indicator span {
  font-size: 12px;
  font-weight: 600;
  color: #ef4444;
  font-variant-numeric: tabular-nums;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.circle-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e2e8f0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.circle-btn:hover {
  transform: scale(1.05);
}

.circle-btn.recording {
  background: #ef4444;
  color: white;
  animation: recordPulse 2s ease-in-out infinite;
}

@keyframes recordPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}

.playback {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007aff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.play-btn:hover {
  background: #0051d5;
  transform: scale(1.05);
}

.time-display {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  font-variant-numeric: tabular-nums;
  min-width: 80px;
}

.speed-controls {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
}

.speed-btn {
  padding: 4px 10px;
  border-radius: 5px;
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.speed-btn:hover {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
}

.speed-btn.active {
  background: #007aff;
  color: white;
}

.cloud-actions {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.cloud-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.cloud-btn ion-icon {
  font-size: 18px;
}

.upload-btn {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
}

.upload-btn:hover {
  background: rgba(0, 122, 255, 0.2);
  transform: scale(1.1);
}

.download-btn {
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
}

.download-btn:hover {
  background: rgba(52, 199, 89, 0.2);
  transform: scale(1.1);
}

@media (max-width: 640px) {
  .playback {
    flex-wrap: wrap;
  }

  .time-display {
    order: 3;
    width: 100%;
    text-align: center;
    margin-top: 8px;
  }
  
  .cloud-actions {
    order: 4;
    margin-top: 8px;
  }
}
</style>