<template>
  <div v-if="!hideNavbar" class="nav-bar">
    <div class="left" @click="$router.push('/catalogue')">
      <img class="logo" src="/src/assets/logo.svg" alt="logo" />
      <span class="store-name">AirsoftPro</span>
    </div>

    <div class="right desktop-only">
      <button class="icon-btn" @click="$router.push('/admin')">
        <ion-icon :icon="personCircleOutline" />
      </button>

      <button v-if="isLoggedIn" class="icon-btn wishlist-btn" @click="goToWishlist">
        <ion-icon :icon="heartOutline" />
        <span v-if="wishlistCount > 0" class="wishlist-badge">{{ wishlistCount }}</span>
      </button>

      <button class="icon-btn cart-btn" @click="goToCart">
        <ion-icon :icon="cartOutline" />
        <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
      </button>

      <button class="icon-btn" @click="$router.push('/admin/charts')">
        <ion-icon :icon="statsChartOutline" />
      </button>

      <button class="icon-btn" @click="$router.push('/admin/voicememo')">
        <ion-icon :icon="micOutline" />
      </button>

      <button v-if="isLoggedIn" class="icon-btn logout-btn" @click="handleLogout">
        <ion-icon :icon="logOutOutline" />
      </button>
    </div>

    <button class="icon-btn mobile-only" @click="openMenu = true">
      <ion-icon :icon="menuOutline" />
    </button>

    <transition name="slide">
      <div v-if="openMenu" class="mobile-menu">
        <div class="menu-header">
          <span>Menu</span>
          <button @click="openMenu = false" class="close-btn">
            <ion-icon :icon="closeOutline" />
          </button>
        </div>

        <button class="menu-item" @click="navigateAndClose('/admin')">
          <ion-icon :icon="personCircleOutline" />
          <span>Admin</span>
        </button>

        <button class="menu-item" @click="navigateAndClose('/admin/charts')">
          <ion-icon :icon="statsChartOutline" />
          <span>Analytics</span>
        </button>

        <button class="menu-item" @click="navigateAndClose('/admin/voicememo')">
          <ion-icon :icon="micOutline" />
          <span>Voice Memo</span>
        </button>

        <button v-if="isLoggedIn" class="menu-item" @click="navigateAndClose('/wishlist')">
          <ion-icon :icon="heartOutline" />
          <span>Wishlist ({{ wishlistCount }})</span>
        </button>

        <button class="menu-item" @click="navigateAndClose('/cart')">
          <ion-icon :icon="cartOutline" />
          <span>Cart ({{ cartCount }})</span>
        </button>

        <button v-if="isLoggedIn" class="menu-item logout" @click="handleLogout">
          <ion-icon :icon="logOutOutline" />
          <span>Logout</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { IonIcon } from "@ionic/vue";
import { 
  cartOutline, 
  personCircleOutline, 
  logOutOutline, 
  heartOutline, 
  menuOutline, 
  closeOutline, 
  statsChartOutline, 
  micOutline
} from "ionicons/icons";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { auth } from "@/firebase/config";
import { logoutUser } from "@/services/authService";

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const isLoggedIn = ref(false);
const openMenu = ref(false);

const cartCount = computed(() => cartStore.cartItemCount);
const wishlistCount = computed(() => wishlistStore.wishlist.length);
const hideNavbar = computed(() => route.meta?.hideNavbar === true);

let unsubscribeAuth;

onMounted(() => {
  unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
    isLoggedIn.value = !!user;
    if (user) await wishlistStore.load();
  });
});

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth();
});

const goToCart = () => router.push("/cart");
const goToWishlist = () => router.push("/wishlist");

const navigateAndClose = (path) => {
  openMenu.value = false;
  router.push(path);
};

const handleLogout = async () => {
  openMenu.value = false;
  await logoutUser();
  router.push("/login");
};
</script>

<style scoped>
.nav-bar {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(16px) saturate(160%);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #fff;
  padding: 6px;
  object-fit: contain;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
}

.store-name {
  font-size: 22px;
  font-weight: 800;
  color: #111;
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: 0.2s ease;
}

.icon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

.icon-btn ion-icon {
  font-size: 30px;
  color: #111;
}

.wishlist-btn {
  background: rgba(239,68,68,0.05);
  border: 1px solid rgba(239,68,68,0.1);
}

.logout-btn {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
}

.cart-badge,
.wishlist-badge {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: 700;
  background: #ef4444;
  color: #fff;
  border-radius: 999px;
  padding: 2px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wishlist-badge {
  background: #ec4899;
}

.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

@media (max-width: 640px) {
  .desktop-only { display: none; }
  .mobile-only { display: flex; }
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(22px) saturate(180%);
  border-left: 1px solid rgba(0,0,0,0.08);
  box-shadow: -6px 0 24px rgba(0,0,0,0.12);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  z-index: 2000;
  animation: fade-in 0.25s ease;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 26px;
  color: #111;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.close-btn ion-icon {
  font-size: 32px;
  color: #111;
}

.menu-item {
  width: 100%;
  padding: 14px 14px;
  font-size: 18px;
  border-radius: 14px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(14px);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #111;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  transition: 0.2s ease;
}

.menu-item:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

.menu-item ion-icon {
  font-size: 24px;
}

.menu-item.logout {
  background: rgba(239,68,68,0.12);
  border-color: rgba(239,68,68,0.25);
  color: #ef4444;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0px); }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.28s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(280px);
}
</style>