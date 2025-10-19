<template>
  <div>Logging you in...</div>
</template>

<script>
export default {
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      sessionStorage.setItem("jwt", token);
      this.$router.push("/");
    } else {
     this.$router.push("/login");
   }
 }
};
</script>