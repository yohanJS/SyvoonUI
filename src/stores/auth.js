// src/stores/auth.js
import { reactive } from 'vue';

const authState = reactive({
  isAuthenticated: false,
});

export default authState;