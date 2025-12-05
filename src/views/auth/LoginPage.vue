<template>
  <AuthContainer 
    title="Welcome Back" 
    subtitle="Sign in to your account to continue"
    :hide-logo="true"
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
      placeholder="Enter your password"
    />

    <div class="forgot-password">
      <a href="#" class="forgot-link">Forgot password?</a>
    </div>

    <AuthButton 
      variant="primary" 
      @click="login"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Signing in...' : 'Sign In' }}
    </AuthButton>

    <AuthDivider text="OR CONTINUE WITH" />

    <AuthButton 
      variant="google" 
      :icon="logoGoogle"
      @click="loginGoogle"
      :disabled="isLoading"
    >
      Continue with Google
    </AuthButton>

    <template #footer>
      <p class="footer-text">
        Don't have an account?
        <router-link to="/register" class="footer-link">Sign up</router-link>
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
import { IonToast } from "@ionic/vue"
import { logoGoogle } from "ionicons/icons"
import { useRouter } from "vue-router"
import { loginUser, loginWithGoogle } from "@/services/authService"

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
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/user-disabled':
      return 'This account has been disabled.'
    case 'auth/user-not-found':
      return 'No account found with this email.'
    case 'auth/wrong-password':
      return 'Incorrect password.'
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.'
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups for this site.'
    case 'auth/popup-closed-by-user':
      return 'Login cancelled. Please try again.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized. Please contact support.'
    default:
      return 'Login failed. Please try again.'
  }
}

const login = async () => {
  if (!email.value || !password.value) {
    toastMessage.value = "Please fill in all fields."
    toastColor.value = "warning"
    showToast.value = true
    return
  }

  isLoading.value = true
  try {
    await loginUser(email.value, password.value)
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

const loginGoogle = async () => {
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
.forgot-password {
  text-align: right;
  margin-top: -8px;
  margin-bottom: 24px;
}

.forgot-link {
  font-size: 14px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #2563eb;
  text-decoration: underline;
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