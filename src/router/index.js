import { createRouter, createWebHistory } from "@ionic/vue-router"
import { auth } from "@/firebase/config"

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
    meta: { requiresNoAuth: true, hideNavbar: true }
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { requiresNoAuth: true, hideNavbar: true }
  },
  {
    path: "/catalogue",
    name: "Catalogue",
    component: CataloguePage
  },
  {
    path: "/product/:id",
    name: "Product",
    component: ProductPage
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartPage
  },

  {
    path: "/admin",
    name: "Admin",
    component: AdminPage
  },
  {
    path: "/admin/charts",
    name: "AdminCharts",
    component: AdminCharts
  },
  {
    path: "/admin/voicememo",
    name: "AdminVoiceMemo",
    component: AdminVoiceMemo
  },

  {
    path: "/wishlist",
    name: "Wishlist",
    component: WishlistPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const user = auth.currentUser

  if (to.meta.requiresNoAuth && user) {
    return next("/catalogue")
  }

  if (to.meta.requiresAuth && !user) {
    return next("/login")
  }

  next()
})

export default router
