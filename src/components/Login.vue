<template>
  <div class="container my-5 pt-5">
    <div class="row p-2 d-flex justify-content-center">
      <div class="col-12 col-md-6 login-card mb-5 p-4 shadow-sm">
        <form @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="form-floating mb-3">
            <input type="email" class="form-control rounded-3" id="email" v-model="email" required>
            <label for="email">Email</label>
          </div>

          <!-- Password -->
          <div class="form-floating mb-3">
            <input type="password" class="form-control rounded-3" id="password" v-model="password" required>
            <label for="password">Password</label>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn login-btn w-100 text-white">Login</button>
        </form>

        <!-- Toggle between Login & Register -->
        <div class="text-center mt-3">
          <RouterLink to="/Register" class="nav-link text-primary text-decoration-underline">Register now</RouterLink>
          <p class="mt-2 mb-2">Or</p>
          <!-- filepath: d:\Repos\SyvoonUI\src\components\Login.vue -->
          <a class="google-login-btn d-flex align-items-center justify-content-center mt-2" @click="loginWithProvider('google')">
            <i class="bi bi-google me-2 google-icon"></i>
            <span>Login with Google</span>
          </a>
          <a class="facebook-login-btn d-flex align-items-center justify-content-center mt-2"
            @click="loginWithFacebook">
            <i class="bi bi-facebook me-2 facebook-icon"></i>
            <span>Login with Facebook</span>
          </a>
          <a class="microsoft-login-btn d-flex align-items-center justify-content-center mt-2"
            @click="loginWithMicrosoft">
            <i class="bi bi-microsoft me-2 microsoft-icon"></i>
            <span>Login with Microsoft</span>
          </a>
        </div>

        <!-- Forgot Password -->
        <div class="text-center mt-2">
          <a href="#" class="text-danger">Forgot password?</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import httpClient from "../util/axiosClient";
export default {
  data() {
    return {
      isPrd: false,
      email: '',
      password: '',
      loginUrl: '/Account/login',
    };
  },
  methods: {
      async loginWithProvider(provider) {
        const baseUrl = this.isPrd
          ? "https://enrollpro-ctdeb9a9a9c8b8ez.canadacentral-01.azurewebsites.net"
          : "https://localhost:7041";

        const redirectUrl = `${baseUrl}/login/${provider}`;
        window.location.href = redirectUrl;
      },

      async handleLogin() {
        this.errorMessage = "";
        this.successMessage = "";
        const payload = {
          email: this.email,
          password: this.password,
        };
        this.isLoading = true;
        try {
          const response = await httpClient.post(this.loginUrl, payload);
          const token = response.data.token;
          if (token) {
            sessionStorage.setItem("jwt", token);
            this.successMessage = "Login successful!";
            this.$router.push("/dashboard");
          } else {
            this.errorMessage = "Invalid login response.";
          }
        } catch (error) {
          this.errorMessage = error.response?.data?.message || "Login failed.";
        } finally {
          this.isLoading = false;
        }
      }
    }
};
</script>

<style scoped>
.login-card {
  background: #fff;
  border-radius: 12px;
}

.login-btn {
  background: linear-gradient(135deg, #007FFF, #4e44bc);
  border-radius: 5px;
  padding: 10px 20px;
}

.google-login-btn {
  background: #fff;
  color: #444;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  text-decoration: none !important;
  box-shadow: 0 2px 4px rgba(60, 64, 67, .08);
  margin-bottom: 8px;
}

.google-login-btn:hover {
  box-shadow: 0 4px 12px rgba(60, 64, 67, .15);
  background: #f7f7f7;
  color: #222;
}

.google-icon {
  color: #ea4335;
  font-size: 1.2rem;
}

.facebook-login-btn {
  background: #1877f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  text-decoration: none !important;
  box-shadow: 0 2px 4px rgba(24, 119, 242, .08);
  margin-bottom: 8px;
}

.facebook-login-btn:hover {
  background: #145db2;
}

.facebook-icon {
  color: #fff;
  font-size: 1.2rem;
}

.microsoft-login-btn {
  background: #f3f3f3;
  color: #444;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  text-decoration: none !important;
  box-shadow: 0 2px 4px rgba(60, 64, 67, .08);
  margin-bottom: 8px;
}

.microsoft-login-btn:hover {
  background: #e5e5e5;
}

.microsoft-icon {
  color: #1d59a2;
  font-size: 1.2rem;
}

.btn-primary:hover {
  background-color: #4e44bc;
}

.text-danger {
  font-size: 0.875rem;
}

@media (max-width: 576px) {
  .login-card {
    padding: 20px;
  }
}
</style>