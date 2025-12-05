<template>
  <AuthContainer 
    title="Create Account" 
    subtitle="Join AirsoftPro and start shopping today"
  >
    <AuthInput
      v-model="email"
      label="Email Address"
      type="email"
      placeholder="you@example.com"
    />

    <AuthInput
      v-model="password"
      label="Password"
      type="password"
      placeholder="Create a strong password"
    />

    <div class="password-hint">
      <ion-icon :icon="informationCircleOutline" class="hint-icon"></ion-icon>
      <span class="hint-text">Password must be at least 6 characters</span>
    </div>

    <AuthButton 
      variant="primary" 
      @click="register"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Creating Account...' : 'Create Account' }}
    </AuthButton>

    <AuthDivider text="OR SIGN UP WITH" />

    <AuthButton 
      variant="google" 
      :icon="logoGoogle"
      @click="registerGoogle"
      :disabled="isLoading"
    >
      Sign up with Google
    </AuthButton>

    <template #footer>
      <p class="footer-text">
        Already have an account?
        <router-link to="/login" class="footer-link">Sign in</router-link>
      </p>
    </template>

    <ion-toast
      :is-open="showToast"
      :message="toastMessage"
      :duration="3000"
      @didDismiss="showToast = false"
      :color="toastColor"
    ></ion-toast>
  </AuthContainer>
</template>

<script setup>
import { ref } from "vue"
import { IonToast, IonIcon } from "@ionic/vue"
import { logoGoogle, informationCircleOutline } from "ionicons/icons"
import { useRouter } from "vue-router"
import { registerUser, loginWithGoogle } from "@/services/authService"

import AuthContainer from "@/components/auth/AuthContainer.vue"
import AuthInput from "@/components/auth/AuthInput.vue"
import AuthButton from "@/components/auth/AuthButton.vue"
import AuthDivider from "@/components/auth/AuthDivider.vue"

const router = useRouter()
const email = ref("")
const password = ref("")
const isLoading = ref(false)
const showToast = ref(false)
const toastMessage = ref("")
const toastColor = ref("danger")

const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead.'
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.'
    default:
      return 'Registration failed. Please try again.'
  }
}

const register = async () => {
  if (!email.value || !password.value) {
    toastMessage.value = "Please fill in all fields."
    toastColor.value = "warning"
    showToast.value = true
    return
  }

  if (password.value.length < 6) {
    toastMessage.value = "Password must be at least 6 characters."
    toastColor.value = "warning"
    showToast.value = true
    return
  }

  isLoading.value = true
  try {
    await registerUser(email.value, password.value)
    toastMessage.value = "Account created successfully! Redirecting to login..."
    toastColor.value = "success"
    showToast.value = true
    
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  } catch (err) {
    console.error(err)
    toastMessage.value = getErrorMessage(err)
    toastColor.value = "danger"
    showToast.value = true
  } finally {
    isLoading.value = false
  }
}

const registerGoogle = async () => {
  isLoading.value = true
  try {
    await loginWithGoogle()
    router.push("/catalogue")
  } catch (err) {
    console.error(err)
    toastMessage.value = getErrorMessage(err)
    toastColor.value = "danger"
    showToast.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.password-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -8px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #eff6ff;
  border-radius: 10px;
  border-left: 3px solid #3b82f6;
}

.hint-icon {
  font-size: 18px;
  color: #3b82f6;
  flex-shrink: 0;
}

.hint-text {
  font-size: 13px;
  color: #1e40af;
  line-height: 1.4;
}

.footer-text {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
}

.footer-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #2563eb;
  text-decoration: underline;
}
</style>