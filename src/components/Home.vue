<script>
import axiosClient from "../util/axiosClient"; // adjust path if needed

export default {
  name: "HomePage",
  data() {
    return {
      zipCode: null,
      error: null,
      businessDetails: [],
    };
  },
  mounted() {
    // this.getUserLocation();
  },
  methods: {
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    async testEnrollProAPI() {
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
        console.log("EnrollPro response:", this.businessDetails);
      } catch (err) {
        this.error = "Failed to connect to EnrollPro API. " + err.message;
        console.error("EnrollPro error:", err);
        this.showModal();
      }
    },

    getUserLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            this.reverseGeocode(lat, lon);
          },
          (err) => {
            this.error = "Location permission denied or unavailable.";
            console.error("Geolocation error:", err.message);
            this.showModal();
          }
        );
      } else {
        this.error = "Geolocation is not supported in this browser.";
        this.showModal();
      }
    },

    async reverseGeocode(lat, lon) {
      const apiKey = "e8319ff489074ad5bd84e3797767a4a0";
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const result = data.features?.[0];

        if (result?.properties?.postcode) {
          this.zipCode = result.properties.postcode;
        } else {
          this.error = "Could not retrieve ZIP code from location.";
        }
      } catch (err) {
        console.error("Geoapify error:", err);
        this.error = "Failed to connect to address service.";
      } finally {
        this.showModal();
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
  <div class="container mx-auto py-3 p-0 rounded-4 m-0 mt-5">
    <h2>Home Page</h2>
    <button class="btn btn-primary" @click="testEnrollProAPI">
      Test EnrollPro API
    </button>

    <div v-if="businessDetails.length" class="mt-3">
      <h5>Business Details:</h5>
      <ul>
        <li v-for="(biz, index) in businessDetails" :key="index">
          {{ biz.name }} - {{ biz.id }}
        </li>
      </ul>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="geolocationModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Notice</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>{{ error }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-header,
.modal-footer {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

@media (max-width: 576px) {
  .welcome-txt {
    font-size: 1rem;
  }

  .welcome-txt-under {
    font-size: 1.2rem;
  }
}
</style>
