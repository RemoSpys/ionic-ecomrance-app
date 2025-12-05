<template>
  <ion-page>
    <ion-content>
      <div class="auth-container">
        <div class="auth-card">
          <div v-if="!hideLogo" class="auth-header">
            <div class="logo-wrapper">
              <img src="/src/assets/logo.svg" alt="AirsoftPro" class="auth-logo" />
            </div>
            <h1 class="auth-title">{{ title }}</h1>
            <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>
          </div>

          <div v-else class="auth-header-simple">
            <h1 class="auth-title">{{ title }}</h1>
            <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>
          </div>

          <div class="auth-content">
            <slot></slot>
          </div>

          <div v-if="$slots.footer" class="auth-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent } from "@ionic/vue"

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: String,
  hideLogo: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f9fafb;
  position: relative;
  overflow: hidden;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 10;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .auth-card {
    max-width: 500px;
    padding: 56px 48px;
  }
}

@media (min-width: 1024px) {
  .auth-card {
    max-width: 540px;
    padding: 64px 56px;
  }
}

@media (min-width: 1440px) {
  .auth-card {
    max-width: 580px;
    padding: 72px 64px;
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.auth-header-simple {
  text-align: left;
  margin-bottom: 32px;
}

.auth-header-simple .auth-title {
  font-size: 28px;
  margin-bottom: 6px;
}

.auth-header-simple .auth-subtitle {
  font-size: 14px;
}

.logo-wrapper {
  display: inline-flex;
  padding: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.auth-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.auth-subtitle {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .auth-title {
    font-size: 32px;
  }
  
  .auth-subtitle {
    font-size: 16px;
  }
  
  .logo-wrapper {
    padding: 18px;
  }
  
  .auth-logo {
    width: 52px;
    height: 52px;
  }
}

@media (min-width: 1024px) {
  .auth-title {
    font-size: 36px;
  }
  
  .auth-subtitle {
    font-size: 17px;
  }
  
  .logo-wrapper {
    padding: 20px;
  }
  
  .auth-logo {
    width: 56px;
    height: 56px;
  }
}

.auth-content {
  margin-bottom: 24px;
}

.auth-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.bg-decoration {
  display: none;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 36px 24px;
    border-radius: 20px;
  }

  .auth-title {
    font-size: 28px;
  }

  .logo-wrapper {
    padding: 12px;
  }

  .auth-logo {
    width: 40px;
    height: 40px;
  }
}
</style>