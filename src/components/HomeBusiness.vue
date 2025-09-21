<template>
    <div class="register-container mt-5">
        <div class="register-card">
            <h2 class="hero-title text-center">Your business, Your reputation—claim it for <span class="brand-class fs-2">FREE</span> 
                now</h2>
            <p class="text-center">
                <small>
                    <span class="brand-class fs-6">No fake </span>
                    reviews—only customers who have done business with you can submit a review
                </small>
            </p>

            <form @submit.prevent="handleRegister">
                <!-- Full Name -->
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="name" v-model="name" required>
                    <label for="name">Full Name</label>
                </div>

                <!-- Business Name -->
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="businessName" v-model="businessName" required>
                    <label for="businessName">Business Name</label>
                </div>

                <!-- Business Type -->
                <div class="form-floating mb-3">
                    <select class="form-select" id="businessType" v-model="businessType" required>
                        <option value="" disabled>Select Business Type</option>
                        <option value="Retail">Retail</option>
                        <option value="Service">Service</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="E-commerce">E-commerce</option>
                    </select>
                    <label for="businessType">Business Type</label>
                </div>

                <!-- Contact Number (Optional) -->
                <div class="form-floating mb-3">
                    <input type="tel" class="form-control" id="contactNumber" v-model="contactNumber">
                    <label for="contactNumber">Contact Number (Optional)</label>
                </div>

                <!-- Email -->
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="email" v-model="email" required>
                    <label for="email">Email</label>
                </div>

                <!-- Confirm Email -->
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="confirmEmail" v-model="confirmEmail" required>
                    <label for="confirmEmail">Confirm Email</label>
                    <div v-if="emailsMismatch" class="text-danger mt-1">Emails do not match</div>
                </div>

                <!-- Password -->
                <div class="form-floating mb-3">
                    <input type="password" class="form-control" id="password" v-model="password" required>
                    <label for="password">Password</label>
                </div>

                <!-- Confirm Password -->
                <div class="form-floating mb-3">
                    <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
                    <label for="confirmPassword">Confirm Password</label>
                    <div v-if="passwordMismatch" class="text-danger mt-1">Passwords do not match</div>
                </div>

                <!-- Register Button -->
                <button type="submit" class="btn register-btn w-100 text-white"
                    :disabled="passwordMismatch || emailsMismatch">
                    Register Business
                </button>
            </form>
            <p class="mt-3">
                <small>
                    By continuing, you agree to <span class="brand-class">Syvoon’s</span> Terms of Service and acknowledge our Privacy Policy.
                </small>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: '',
            businessName: '',
            businessType: '',
            contactNumber: '',
            email: '',
            confirmEmail: '',
            password: '',
            confirmPassword: ''
        };
    },
    computed: {
        emailsMismatch() {
            return this.email !== this.confirmEmail;
        },
        passwordMismatch() {
            return this.password !== this.confirmPassword;
        }
    },
    methods: {
        handleRegister() {
            if (!this.passwordMismatch && !this.emailsMismatch) {
                console.log('Registering business with:', {
                    name: this.name,
                    businessName: this.businessName,
                    businessType: this.businessType,
                    contactNumber: this.contactNumber,
                    email: this.email,
                    password: this.password
                });
                // Add registration logic here (API call)
            }
        }
    }
};
</script>

<style scoped>
.brand-class {
    color: #007FFF;
    font-weight: bold;
}
/* Hero Title */
.hero-title {
    font-size: 1.8rem;
    margin-bottom: 20px;
}

.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
}

.register-card {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
}

.register-btn {
    background: linear-gradient(135deg, #007FFF, #4e44bc);
    border-radius: 5px;
    padding: 10px 20px;
}

.text-danger {
    font-size: 0.875rem;
    color: red;
}
</style>