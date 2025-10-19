<template>
  <div>Logging you in...</div>
</template>

<script>
import axiosClient from "../util/axiosClient";

export default {
  async mounted() {
    try {
      const apiKey = import.meta.env.VITE_API_KEY;

      const res = await axiosClient.get("auth/me", {
        headers: {
          "x-api-key": apiKey,
        },
      });

      // If it succeeds (JWT cookie is valid)
      if (res.status === 200) {
        console.log("User authenticated:", res.data);
        this.$router.push("/"); // Go to home
      } else {
        this.$router.push("/login"); // Not logged in
      }
    } catch (err) {
      console.warn("Not authenticated or token expired:", err);
      this.$router.push("/login");
    }
  }
};
</script>
