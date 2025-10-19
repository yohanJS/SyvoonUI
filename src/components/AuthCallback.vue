<template>
  <div>Logging you in...</div>
</template>

<script>
import authState from "../stores/auth";
import axiosClient from "../util/axiosClient";

export default {
  async mounted() {
    try {
      const apiKey = import.meta.env.VITE_API_KEY;

      const res = await axiosClient.get("auth/me", {
        headers: {
          "x-api-key": apiKey,
        },
        credentials: "include",
        withCredentials: true, // ✅ This is critical for sending cookies
      });

      if (res.status === 200) {
        authState.isAuthenticated = true;
        authState.user = res.data;
        this.$router.push("/");
      } else {
        this.$router.push("/login");
      }
    } catch (err) {
      console.warn("Not authenticated or token expired:", err);
      this.$router.push("/login");
    }
  }
};
</script>
