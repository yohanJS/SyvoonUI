import { createRouter, createWebHistory } from "vue-router";
import Home from './components/Home.vue'
import HomeBusiness from "./components/HomeBusiness.vue";
import Admin from './components/Admin.vue'
import BookingFlow from './components/BookingFlow.vue'
import UpcomingBookings from './components/UpcomingBookings.vue'
import ImagesAdmin from "./components/ImagesAdmin.vue";
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import AuthCallback from "./components/AuthCallback.vue";

const routes = [
  { path: '/', component: Home},
  { path: '/HomeBusiness', component: HomeBusiness },
  { path: '/Admin', component: Admin, meta: { requiresAuth: true } },
  { path: '/Book', component: BookingFlow },
  { path: '/UpcomingBookings', component: UpcomingBookings, meta: { requiresAuth: true } },
  { path: '/ImagesAdmin', component: ImagesAdmin, meta: { requiresAuth: true } },
  { path: '/Login', component: Login },
  { path: '/Register', component: Register },
  { path: "/Auth-Callback", component: AuthCallback },
]

const router = createRouter({
  mode: "hash",
  history: createWebHistory(),
  routes,
})

// Add the navigation guard here
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem("jwt");
  const isProtected = to.meta.requiresAuth;

  if (isProtected && !token) {
    next("/Login");
  } else {
    next();
  }
});

export default router;