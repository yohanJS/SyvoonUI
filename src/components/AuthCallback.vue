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
      const email = new URLSearchParams(window.location.search).get("email");

      if (!email) {
        console.warn("Missing email in query string.");
        this.$router.push("/login");
        return;
      }

      // Step 1: Exchange token and receive JWT
      const exchangeRes = await axiosClient.post("auth/exchange", { email }, {
        headers: {
          "x-api-key": apiKey,
        }
      });

      const token = exchangeRes.data?.token;
      if (!token) {
        console.warn("No token returned from exchange.");
        this.$router.push("/login");
        return;
      }

      // Step 2: Use token in Authorization header to verify authentication
      const res = await axiosClient.get("auth/me", {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        console.log("User authenticated:", res.data);
        authState.isAuthenticated = true;
        authState.user = res.data;
        this.$router.push("/");
      } else {
        this.$router.push("/login");
      }
    } catch (err) {
      console.warn("Not authenticated or token exchange failed:", err);
      this.$router.push("/login");
    }
  }
};
</script>