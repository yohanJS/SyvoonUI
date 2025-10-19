<script>
import Navbar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import authState from './stores/auth';
import axiosClient from './util/axiosClient';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      authState,
    };
  },
  created() {
    this.checkAuth();
  },
  methods: {
    async checkAuth() {
      try {
        const apiKey = import.meta.env.VITE_API_KEY;
        const res = await axiosClient.get('auth/me', {
          headers: { 'x-api-key': apiKey },
          withCredentials: true,
        });
        this.authState.isAuthenticated = res.status === 200;
      } catch (err) {
        this.authState.isAuthenticated = false;
      }
    },
  },
};
</script>

<template>
  <Navbar />
  <main class="p-2">
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped>
main {
  min-height: 100vh;
  background-color: rgba(241, 240, 240, 0.5);
}
</style>