<script>
import authState from '../stores/auth';

export default {
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    isLoggedIn() {
      return authState.isAuthenticated;
    },
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    closeMenu() {
      this.isOpen = false;
    },
    logout() {
      // Optional: call logout endpoint to clear cookie
      authState.isAuthenticated = false;
      this.$router.push("/login");
    },
  },
  created() {
    // Optional: perform a silent auth check here too
  },
};
</script>

<template>
    <nav class="navbar fixed-top">
        <div class="container-fluid d-flex justify-content-between align-items-center p-0">
            <div class="d-flex align-items-center">
                <a href="/" class="brand me-2 text-decoration-none">
                    Syvoon
                    <img src="https://imagedelivery.net/YIVCzYnz4796uVIlcnjggw/5e303e95-f9a1-4610-4dc7-edb6d568ad00/public"
                        class="img-fluid" style="width: 30px; height: auto;">
                </a>
            </div>

            <!-- Hamburger Icon (Only visible on small screens) -->
            <div class="hamburger d-md-none" @click="toggleMenu">
                <div :class="{ 'bar mb-1': true, 'open': isOpen }"></div>
                <div :class="{ 'bar mb-1': true, 'open': isOpen }"></div>
                <div :class="{ 'bar': true, 'open': isOpen }"></div>
            </div>

            <!-- Inline Nav Links (Only visible on md and up) -->
            <ul class="nav-links d-none d-md-flex align-items-center mb-0">
                <RouterLink to="/" class="nav-link mx-2">HOME</RouterLink>
                <RouterLink to="/HomeBusiness" class="nav-link mx-2 business-link rounded-2">SYVOON BUSINESS
                </RouterLink>
                <RouterLink to="/Book" class="nav-link mx-2">BOOK</RouterLink>
                <div v-if="isLoggedIn">
                    <RouterLink to="/UpcomingBookings" class="nav-link mx-2">UPCOMING BOOKINGS</RouterLink>
                </div>
                <div v-if="isLoggedIn">
                    <RouterLink to="/ImagesAdmin" class="nav-link mx-2">IMAGES</RouterLink>
                </div>
                <div v-if="isLoggedIn">
                    <RouterLink to="/Admin" class="nav-link mx-2">ADMIN</RouterLink>
                </div>
                <div v-if="!isLoggedIn">
                    <RouterLink to="/Login" class="nav-link mx-2">LOGIN</RouterLink>
                </div>
                <div v-if="!isLoggedIn">
                    <RouterLink to="/Register" class="nav-link mx-2">REGISTER</RouterLink>
                </div>
                <div v-if="isLoggedIn"><button class="nav-link mx-2 bg-danger text-white rounded-2"
                        @click="logout">LOGOUT</button></div>
            </ul>
        </div>

        <!-- Sidebar (only visible on small screens) -->
        <div class="sidebar text-center d-md-none" :class="{ 'active': isOpen }">
            <button class="close-btn text-dark mb-3" @click="closeMenu">✖</button>
            <ul class="nav-links">
                <RouterLink to="/" class="nav-link mb-1">HOME</RouterLink>
                <RouterLink to="/HomeBusiness" class="nav-link mb-1 text-danger shadow-lg rounded-2">SYVOON BUSINESS
                </RouterLink>
                <RouterLink to="/Book" class="nav-link mb-1">BOOK</RouterLink>
                <RouterLink to="/UpcomingBookings" class="nav-link mb-1">UPCOMING BOOKINGS</RouterLink>
                <RouterLink to="/ImagesAdmin" class="nav-link mb-1">IMAGES</RouterLink>
                <RouterLink to="/Admin" class="nav-link mb-1">ADMIN</RouterLink>
                <div v-if="!isLoggedIn">
                    <RouterLink to="/Login" class="nav-link mb-1">LOGIN</RouterLink>
                </div>
                <div v-if="!isLoggedIn">
                    <RouterLink to="/Register" class="nav-link mb-1">REGISTER</RouterLink>
                </div>
                <div v-if="isLoggedIn"><button class="nav-link mb-1 bg-danger text-white rounded-2 w-100"
                        @click="logout">LOGOUT</button></div>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
/* Navbar Styling */
.navbar {
    background: #f7f7f7;
    padding: 10px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    .nav-link {
        font-size: 0.7rem !important;
    }

    .router-link-active {
        background: linear-gradient(135deg, #007FFF, #4e44bc);
        border-radius: 5px;
        color: #ffffff !important;
    }
}
.business-link {
    color: #f53434 !important;
    border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
.brand {
    font-size: 1.1rem;
    text-decoration: none;
    color: #333;
}

/* Hamburger Menu */
.hamburger {
    display: flex;
    flex-direction: column;
    cursor: pointer;
}

.bar {
    width: 20px;
    height: 3px;
    background: #333;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.open:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.open:nth-child(2) {
    opacity: 0;
}

.open:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
}

/* Sidebar */
.sidebar {
    position: fixed;
    top: 0;
    right: -250px;
    width: 250px;
    height: 100%;
    background: #f8f9fa;
    transition: right 0.3s ease;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: 1000;
}

.sidebar.active {
    right: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* Nav Links */
.nav-links {
    list-style: none;
    padding: 0;
}

.nav-link {
    display: block;
    padding: 10px;
    text-decoration: none;
    color: #333;
    transition: background 0.3s ease;
}

.nav-link:hover {
    background: linear-gradient(135deg, #007FFF, #4e44bc);
    border-radius: 5px;
    color: #ffffff !important;
}
</style>
