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
                <h5 class="fw-bold text-secondary mb-3">Business Details</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Business Name</th>
                                <th scope="col">ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(biz, index) in businessDetails" :key="index">
                                <tr>
                                    <td>{{ index + 1 }}</td>
                                    <td class="fw-semibold">{{ biz.name }}</td>
                                    <td>
                                        <span class="badge bg-primary">{{ biz.id }}</span>
                                        <button class="btn btn-sm btn-outline-secondary ms-2"
                                            @click="toggleDetails(index)">
                                            {{ detailsVisible[index] ? "Hide" : "Show" }} Details
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="detailsVisible[index]">
                                    <td colspan="3">
                                        <div class="text-start ms-3">
                                            <p><strong>Address:</strong> {{ biz.address }}</p>
                                            <p><strong>Email:</strong> {{ biz.email }}</p>
                                            <p><strong>Phone:</strong> {{ biz.phone }}</p>
                                            <p><strong>Website:</strong> <a :href="biz.websiteUrl" target="_blank">{{
                                                    biz.websiteUrl }}</a></p>
                                            <p><strong>Category:</strong> {{ biz.category }}</p>
                                            <p><strong>Description:</strong> {{ biz.description }}</p>
                                            <p><strong>Created:</strong> {{ formatDate(biz.createdAt) }}</p>
                                            <p><strong>Updated:</strong> {{ formatDate(biz.lastUpdatedAt) }}</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
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
.card {
    backdrop-filter: blur(8px);
}

.btn-primary {
    background: linear-gradient(135deg, #007bff, #4e73df);
    border: none;
    transition: all 0.2s ease;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #0056d2, #375ac3);
    transform: translateY(-1px);
}

.table-hover tbody tr:hover {
    background-color: #f8f9fc;
    cursor: pointer;
}

.modal-content {
    border-radius: 15px;
}

@media (max-width: 576px) {
    h1 {
        font-size: 1.6rem;
    }

    .btn-lg {
        font-size: 1rem;
    }
}
</style>
