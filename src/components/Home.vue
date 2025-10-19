<script>
import axiosClient from "../util/axiosClient";

export default {
    name: "HomePage",
    data() {
        return {
            zipCode: null,
            error: null,
            businessDetails: [],
            loading: false,
            detailsVisible: {}, // Track expanded rows
        };
    },
    methods: {
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        },
        toggleDetails(index) {
            this.detailsVisible = {
                ...this.detailsVisible,
                [index]: !this.detailsVisible[index],
            };
        },
        async testEnrollProAPI() {
            this.loading = true;
            this.error = null;
            try {
                const token = sessionStorage.getItem("jwt");
                const apiKey = import.meta.env.VITE_API_KEY;

                const res = await axiosClient.get("/business/getAllBusinesses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-key": apiKey,
                    },
                });

                this.businessDetails = res.data;
            } catch (err) {
                this.error = "Failed to connect to EnrollPro API.\n" + err.message;
                this.showModal();
            } finally {
                this.loading = false;
            }
        },
        showModal() {
            const modal = new bootstrap.Modal(document.getElementById("geolocationModal"));
            modal.show();
        },
    },
};
</script>

<template>
    <div class="container mx-auto px-4 py-5">
        <div class="text-center mb-5">
            <h1 class="fw-bold mb-2 text-primary">Welcome to EnrollPro</h1>
            <p class="text-muted">Quickly test your API connection and view your registered businesses.</p>
        </div>

        <div class="card shadow-sm border-0 rounded-4 p-4 text-center bg-light">
            <button class="btn btn-primary btn-lg px-4 py-2 fw-semibold" @click="testEnrollProAPI" :disabled="loading">
                <span v-if="!loading">🚀 Test EnrollPro API</span>
                <span v-else>
                    <span class="spinner-border spinner-border-sm me-2"></span> Loading...
                </span>
            </button>

            <div v-if="businessDetails.length" class="mt-5">
                <h5 class="fw-bold text-secondary mb-4">Business Directory</h5>
                <div class="row g-4">
                    <div class="col-md-6 col-lg-4" v-for="(biz, index) in businessDetails" :key="index">
                        <div class="card h-100 shadow-sm border-0 rounded-4 position-relative">
                            <div class="card-body d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h5 class="card-title text-primary mb-1">{{ biz.name }}</h5>
                                        <span class="badge bg-secondary text-uppercase small">{{ biz.category }}</span>
                                    </div>
                                    <span class="badge bg-gradient bg-primary">{{ biz.id }}</span>
                                </div>

                                <ul class="list-unstyled small text-muted mb-3">
                                    <li v-if="biz.address"><i class="bi bi-geo-alt-fill me-2 text-secondary"></i>{{
                                        biz.address }}</li>
                                    <li v-if="biz.email"><i class="bi bi-envelope-fill me-2 text-secondary"></i>{{
                                        biz.email }}</li>
                                    <li v-if="biz.phone"><i class="bi bi-telephone-fill me-2 text-secondary"></i>{{
                                        biz.phone }}</li>
                                    <li v-if="biz.websiteUrl">
                                        <i class="bi bi-globe2 me-2 text-secondary"></i>
                                        <a :href="biz.websiteUrl" target="_blank" class="text-decoration-none">{{
                                            biz.websiteUrl }}</a>
                                    </li>
                                </ul>

                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <span v-if="biz.status" class="badge bg-light text-dark border">{{ biz.status
                                        }}</span>
                                    <span v-if="biz.verified" class="badge bg-success text-white">✔ Verified</span>
                                    <span v-for="tag in biz.tags || []" :key="tag" class="badge bg-info text-dark">{{
                                        tag }}</span>
                                </div>

                                <button class="btn btn-sm btn-outline-primary mt-auto" @click="toggleDetails(index)">
                                    {{ detailsVisible[index] ? "Hide" : "Show" }} More
                                </button>

                                <transition name="fade">
                                    <div v-if="detailsVisible[index]" class="mt-3 border-top pt-3">
                                        <p v-if="biz.description"><strong>Description:</strong> {{ biz.description }}
                                        </p>
                                        <p><strong>Created:</strong> {{ formatDate(biz.createdAt) }}</p>
                                        <p><strong>Updated:</strong> {{ formatDate(biz.lastUpdatedAt) }}</p>
                                        <p v-if="biz.rating"><strong>Rating:</strong> ⭐ {{ biz.rating }}/5</p>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="!loading" class="text-muted mt-4">
                No businesses loaded yet. Click the button above to test your connection.
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="geolocationModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title fw-semibold">Error</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="m-0">{{ error }}</p>
                    </div>
                    <div class="modal-footer bg-light">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Fade transition for details */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Card styling */
.card {
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  transition: box-shadow 0.2s ease;
}
.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

/* Card title and badge */
.card-title {
  font-size: 1.1rem;
  font-weight: 600;
}
.badge.bg-gradient {
  background: linear-gradient(135deg, #4e73df, #1cc88a);
}

/* Business info list */
.card-body ul {
  padding-left: 0;
  margin-bottom: 1rem;
}
.card-body ul li {
  margin-bottom: 0.25rem;
  list-style: none;
}

/* Button styling */
.btn-primary {
  background: linear-gradient(135deg, #007bff, #4e73df);
  border: none;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #0056d2, #375ac3);
  transform: translateY(-1px);
}
.btn-outline-primary {
  transition: all 0.2s ease;
}
.btn-outline-primary:hover {
  background-color: #4e73df;
  color: #fff;
  border-color: #4e73df;
}

/* Table hover effect */
.table-hover tbody tr:hover {
  background-color: #f8f9fc;
  cursor: pointer;
}

/* Modal styling */
.modal-content {
  border-radius: 15px;
}

/* Responsive typography */
@media (max-width: 576px) {
  h1 {
    font-size: 1.6rem;
  }
  .btn-lg {
    font-size: 1rem;
  }
  .card-title {
    font-size: 1rem;
  }
}
</style>
