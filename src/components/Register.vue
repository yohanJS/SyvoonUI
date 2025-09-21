<template>
    <div class="container my-5 pt-5">
        <div class="row p-2 d-flex justify-content-center">
            <div class="col-12 col-md-6 register-card mb-5 p-4 shadow-sm">
                <form @submit.prevent="register">
                    <!-- Email -->
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control rounded-3" id="email" v-model="email" required />
                        <label for="email">Email</label>
                    </div>

                    <!-- Confirm Email -->
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control rounded-3" id="confirmEmail" v-model="confirmEmail"
                            required />
                        <label for="confirmEmail">Confirm Email</label>
                        <div v-if="emailsMismatch" class="text-danger mt-1">
                            Emails do not match
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control rounded-3" id="password" v-model="password"
                            required />
                        <label for="password">Password</label>
                    </div>

                    <!-- Confirm Password -->
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control rounded-3" id="confirmPassword"
                            v-model="confirmPassword" required />
                        <label for="confirmPassword">Confirm Password</label>
                        <div v-if="passwordMismatch" class="text-danger mt-1">
                            Passwords do not match
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn register-btn w-100 text-white"
                        :disabled="passwordMismatch || emailsMismatch">
                        Register
                    </button>
                </form>

                <!-- Toggle to Login -->
                <p class="text-center mt-3">
                    <RouterLink to="/login" class="nav-link text-primary text-decoration-underline">
                        Already have an account? Login
                    </RouterLink>
                </p>
                <a class="google-login-btn d-flex align-items-center justify-content-center mt-2"
                    @click="loginWithGoogle">
                    <i class="bi bi-google me-2 google-icon"></i>
                    <span>Login with Google</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import httpClient from "../util/axiosClient";
export default {
    data() {
        return {
            isPrd: true,
            email: "",
            confirmEmail: "",
            password: "",
            confirmPassword: "",
            userRegisterUrl: "/Account/register",
        };
    },
    computed: {
        emailsMismatch() {
            return this.email !== this.confirmEmail;
        },
        passwordMismatch() {
            return this.password !== this.confirmPassword;
        },
    },
    methods: {
        async register() {
            this.errorMessage = "";
            this.successMessage = "";

            // Validate that passwords match
            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Passwords do not match.";
                return;
            }

            // Prepare registration data
            const payload = {
                email: this.email,
                password: this.password,
            };
            this.isLoading = true;
            try {
                const response = await httpClient.post(this.userRegisterUrl, payload);
                this.successMessage = response.data.message || "Registration successful!";

                // Set a flag in sessionStorage to indicate successful login
                sessionStorage.setItem("isLoggedIn", "true");

                // Redirect to the home page
                this.$router.push({ path: "/" });

                // Clear form fields
                this.email = "";
                this.confirmEmail = "";
                this.password = "";
                this.confirmPassword = "";
            } catch (error) {
                this.errorMessage = error.response?.data?.message || "Registration failed.";
            } finally {
                this.isLoading = false;
            }
        },
        async loginWithGoogle() {
            // Redirect user to the .NET backend login endpoint
            window.location.href = this.isPrd ? "https://engfuel.com/Account/login-google" : "https://localhost:7091/Account/login-google";
        },
    },
};
</script>

<style scoped>
.register-card {
    background: #fff;
    border-radius: 12px;
}

.register-btn {
    background: linear-gradient(135deg, #007fff, #4e44bc);
    border-radius: 5px;
    padding: 10px 20px;
}

.btn-primary:hover {
    background-color: #4e44bc;
}

.text-danger {
    font-size: 0.875rem;
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
  transition: box-shadow 0.2s;
  text-decoration: none !important;
  box-shadow: 0 2px 4px rgba(60,64,67,.08);
}

.google-login-btn:hover {
  box-shadow: 0 4px 12px rgba(60,64,67,.15);
  background: #f7f7f7;
  color: #222;
}

.google-icon {
  color: #ea4335;
  font-size: 1.2rem;
}
@media (max-width: 576px) {
    .register-card {
        padding: 20px;
    }
}
</style>