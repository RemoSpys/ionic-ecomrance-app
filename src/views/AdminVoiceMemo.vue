<template>
  <ion-page>
    <ion-content class="page">
      <div class="shell">
        <h1 class="title">Voice Memo</h1>
        
        <VoiceRecorder ref="voiceRecorder" @saved="handleSaved" />
        
        <VoiceMemoList ref="memoList" class="mt-6" @playMemo="handlePlayMemo" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent } from "@ionic/vue"
import { ref } from "vue"
import VoiceRecorder from "@/components/VoiceRecorder.vue"
import VoiceMemoList from "@/components/VoiceMemoList.vue"

const memoList = ref(null)
const voiceRecorder = ref(null)

const handleSaved = () => {
  if (memoList.value) {
    memoList.value.loadMemos()
  }
}

const handlePlayMemo = (memo) => {
  if (voiceRecorder.value) {
    voiceRecorder.value.loadAudio(memo)
  }
}
</script>

<style scoped>
.page {
  --background: #f5f7fa;
}

.shell {
  padding: 90px 20px 60px;
  max-width: 700px;
  margin: auto;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1e293b;
}

.mt-6 {
  margin-top: 24px;
}
</style>