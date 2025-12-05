<template>
  <div class="voice-memo-list">

    <div class="list-header">
      <div class="header-left">
        <ion-icon :icon="micOutline" class="header-icon"></ion-icon>
        <h3>Saved Voice Memos</h3>
      </div>
      <span class="count">{{ memos.length }}</span>
    </div>

    <div v-if="loading" class="empty-state">
      <ion-icon :icon="micOutline" class="empty-icon"></ion-icon>
      <p>Loading voice memos...</p>
      <span>Please wait a moment</span>
    </div>

    <div v-else-if="memos.length === 0" class="empty-state">
      <ion-icon :icon="micOffOutline" class="empty-icon"></ion-icon>
      <p>No voice memos yet</p>
      <span>Record and save to see them here</span>
    </div>

    <div v-else class="memo-list">
      <div v-for="memo in memos" :key="memo.id" class="memo-item">
        <div class="memo-icon">
          <ion-icon :icon="micOutline"></ion-icon>
        </div>
        <div class="memo-info">
          <input 
            v-if="editingId === memo.id"
            v-model="editingName"
            @blur="saveRename(memo)"
            @keyup.enter="saveRename(memo)"
            @keyup.esc="cancelRename"
            class="memo-name-input"
            ref="nameInput"
          />
          <span v-else class="memo-name">{{ memo.displayName || memo.name }}</span>
          <span class="memo-meta">{{ formatFileSize(memo.size) }} • {{ formatDate(memo.timeCreated) }}</span>
        </div>
        <div class="memo-actions">
          <button @click="playMemo(memo)" class="action-btn play" title="Play">
            <ion-icon :icon="playOutline"></ion-icon>
          </button>
          <button @click="startRename(memo)" class="action-btn edit" title="Rename">
            <ion-icon :icon="createOutline"></ion-icon>
          </button>
          <button @click="downloadMemo(memo)" class="action-btn download" title="Download">
            <ion-icon :icon="downloadOutline"></ion-icon>
          </button>
          <button @click="deleteMemo(memo)" class="action-btn delete" title="Delete">
            <ion-icon :icon="trashOutline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { IonIcon } from '@ionic/vue'
import { 
  micOutline, 
  micOffOutline, 
  playOutline, 
  createOutline, 
  downloadOutline, 
  trashOutline 
} from 'ionicons/icons'
import { auth, storage } from '@/firebase/config'
import { ref as sRef, listAll, getDownloadURL, getMetadata, deleteObject, updateMetadata } from 'firebase/storage'

const memos = ref([])
const editingId = ref(null)
const editingName = ref('')
const nameInput = ref(null)
const loading = ref(true)

const loadMemos = async () => {
  if (!auth.currentUser) {
    loading.value = false
    return
  }

  try {
    loading.value = true

    const uid = auth.currentUser.uid
    const folderRef = sRef(storage, `uploads/${uid}`)

    const result = await listAll(folderRef)
    const loaded = []

    for (const item of result.items) {
      if (item.name.startsWith('voice-memo-')) {
        const url = await getDownloadURL(item)
        const metadata = await getMetadata(item)

        loaded.push({
          id: item.name,
          name: item.name,
          displayName: metadata.customMetadata?.displayName || item.name.replace('voice-memo-', '').replace('.webm', ''),
          url,
          size: metadata.size,
          timeCreated: metadata.timeCreated,
          fullPath: item.fullPath
        })
      }
    }

    memos.value = loaded.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated))
  } catch (error) {
    console.error('Load memos error:', error)
  } finally {
    loading.value = false
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (isToday) return `Today • ${time}`
  if (isYesterday) return `Yesterday • ${time}`

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const playMemo = (memo) => {
  window.open(memo.url, '_blank')
}

const downloadMemo = (memo) => {
  const a = document.createElement('a')
  a.href = memo.url
  a.download = memo.displayName + '.webm'
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const startRename = (memo) => {
  editingId.value = memo.id
  editingName.value = memo.displayName
  nextTick(() => {
    if (nameInput.value && nameInput.value[0]) {
      nameInput.value[0].focus()
      nameInput.value[0].select()
    }
  })
}

const saveRename = async (memo) => {
  if (!editingName.value.trim()) {
    cancelRename()
    return
  }

  try {
    const uid = auth.currentUser.uid
    const fileRef = sRef(storage, `uploads/${uid}/${memo.name}`)
    
    await updateMetadata(fileRef, {
      customMetadata: {
        displayName: editingName.value.trim()
      }
    })

    memo.displayName = editingName.value.trim()
    cancelRename()
  } catch (error) {
    console.error('Rename error:', error)
    alert('Failed to rename: ' + error.message)
    cancelRename()
  }
}

const cancelRename = () => {
  editingId.value = null
  editingName.value = ''
}

const deleteMemo = async (memo) => {
  if (!confirm(`Delete "${memo.displayName}"?`)) return

  try {
    const uid = auth.currentUser.uid
    const fileRef = sRef(storage, `uploads/${uid}/${memo.name}`)
    
    await deleteObject(fileRef)
    
    memos.value = memos.value.filter(m => m.id !== memo.id)
  } catch (error) {
    console.error('Delete error:', error)
    alert('Failed to delete: ' + error.message)
  }
}

defineExpose({ loadMemos })

onMounted(() => {
  const stop = auth.onAuthStateChanged((user) => {
    if (user) {
      loadMemos()
      stop()
    } else {
      loading.value = false
    }
  })
})
</script>


<style scoped>
.voice-memo-list {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f1f5f9;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 24px;
  color: #007aff;
}

.list-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.count {
  background: #007aff;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 12px;
  opacity: 0.3;
}

.empty-state p {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.empty-state span {
  font-size: 12px;
}

.memo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.memo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 2px solid #f1f5f9;
  transition: all 0.2s;
}

.memo-item:hover {
  border-color: #007aff;
  background: #f8fafc;
}

.memo-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.memo-icon ion-icon {
  font-size: 24px;
}

.memo-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.memo-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.memo-name-input {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  border: 2px solid #007aff;
  border-radius: 6px;
  padding: 4px 8px;
  outline: none;
  background: white;
}

.memo-meta {
  font-size: 11px;
  color: #94a3b8;
}

.memo-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn ion-icon {
  font-size: 18px;
}

.action-btn.play {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
}

.action-btn.play:hover {
  background: rgba(0, 122, 255, 0.2);
  transform: scale(1.1);
}

.action-btn.edit {
  background: rgba(255, 149, 0, 0.1);
  color: #ff9500;
}

.action-btn.edit:hover {
  background: rgba(255, 149, 0, 0.2);
  transform: scale(1.1);
}

.action-btn.download {
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
}

.action-btn.download:hover {
  background: rgba(52, 199, 89, 0.2);
  transform: scale(1.1);
}

.action-btn.delete {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
}

.action-btn.delete:hover {
  background: rgba(255, 59, 48, 0.2);
  transform: scale(1.1);
}

@media (max-width: 640px) {
  .memo-actions {
    flex-wrap: wrap;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
  }
  
  .action-btn ion-icon {
    font-size: 16px;
  }
}
</style>