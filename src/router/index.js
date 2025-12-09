import { createRouter, createWebHistory } from "@ionic/vue-router"
import { auth } from "@/firebase/config"

const ADMIN_EMAILS = [
  'remo.tammela@gmail.com',
  'remo@example.com',
]

import CataloguePage from "@/views/CataloguePage.vue"
import ProductPage from "@/views/ProductPage.vue"
import CartPage from "@/views/CartPage.vue"

import LoginPage from "@/views/auth/LoginPage.vue"
import RegisterPage from "@/views/auth/RegisterPage.vue"

import WishlistPage from "@/views/WishlistPage.vue"

import AdminPage from "@/views/AdminPage.vue"
import AdminCharts from "@/views/AdminCharts.vue"
import AdminVoiceMemo from "@/views/AdminVoiceMemo.vue"

const routes = [
  {
    path: "/",
    redirect: "/catalogue"
  },
  
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { 
      requiresNoAuth: true, 
      hideNavbar: true,
      title: "Login" 
    }
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { 
      requiresNoAuth: true, 
      hideNavbar: true,
      title: "Register" 
    }
  },
  
  {
    path: "/catalogue",
    name: "Catalogue",
    component: CataloguePage,
    meta: { 
      title: "Product Catalogue" 
    }
  },
  {
    path: "/product/:id",
    name: "Product",
    component: ProductPage,
    meta: { 
      title: "Product Details" 
    }
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartPage,
    meta: { 
      title: "Shopping Cart" 
    }
  },
  
  {
    path: "/wishlist",
    name: "Wishlist",
    component: WishlistPage,
    meta: { 
      requiresAuth: true,
      title: "My Wishlist" 
    }
  },
  
  {
    path: "/admin",
    name: "Admin",
    component: AdminPage,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: "Admin Dashboard" 
    }
  },
  {
    path: "/admin/charts",
    name: "AdminCharts",
    component: AdminCharts,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: "Analytics & Charts" 
    }
  },
  {
    path: "/admin/voicememo",
    name: "AdminVoiceMemo",
    component: AdminVoiceMemo,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: "Voice Memos" 
    }
  },
  
  {
    path: "/:pathMatch(.*)*",
    redirect: "/catalogue"
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const isAdmin = async (user) => {
  if (!user) return false
  
  try {
    const idTokenResult = await user.getIdTokenResult()
    if (idTokenResult.claims.admin) return true
  } catch (error) {
    console.log('No admin claim found')
  }
  
  if (ADMIN_EMAILS.includes(user.email?.toLowerCase())) return true
  
  return false
}

router.beforeEach(async (to, from, next) => {
  await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      unsubscribe()
      resolve()
    })
  })
  
  const user = auth.currentUser
  
  if (to.meta.title) {
    document.title = `${to.meta.title} | AirsoftPro`
  }
  
  if (to.meta.requiresNoAuth && user) {
    return next("/catalogue")
  }
  
  if (to.meta.requiresAuth && !user) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath }
    })
  }
  
  if (to.meta.requiresAdmin) {
    if (!user) {
      return next("/login")
    }
    
    const adminStatus = await isAdmin(user)
    if (!adminStatus) {
      console.warn('Access denied: Admin privileges required')
      return next("/catalogue")
    }
  }
  
  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router