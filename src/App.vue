<script setup>
import Navbar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Navbar></Navbar>
  <main class="p-2">
    <RouterView to="/" />
  </main>
  <Footer></Footer>
</template>

<style scoped>
  main {
    min-height: 100vh;
    background-color: rgba(241, 240, 240, 0.5);
  }
</style>
