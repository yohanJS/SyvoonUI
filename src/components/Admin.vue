<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Modal } from "bootstrap";
import httpClient from "../util/axiosClient";
import { scrollUp } from "../util/scrollUp.js";

export default {
  data() {
    return {
      step: 1,
      CreateService: "/CreateService",
      UpdateService: "/UpdateService",
      isFormOpen: false,
      isModalOpen: false,
      isEditEmployeeModalOpen: false,
      isEditServiceModalOpen: false,
      deleteServiceId: null,
      deleteEmployeeId: null,
      displaySpinnerMessage: false,
      services: [],
      employees: [],
      maleProfileImg: "https://imagedelivery.net/YIVCzYnz4796uVIlcnjggw/37136d59-6c82-4ccc-740b-9cc8e6fddf00/public",
      femaleProfileImg: "https://imagedelivery.net/YIVCzYnz4796uVIlcnjggw/af9acd96-99b8-404b-3e7a-460291ec7b00/public",
      formData: {
        file: "null",
        imageId: "",
        businessId: "YohanJS",
        name: "",
        description: ""
      },
      editEmployee: {
        FullName: "",
        Phone: "",
        Email: "",
        IsMale: true,
      },
      editService: {
        name: "",
        description: "",
        file: "",
        imageId: "",
      },
    };
  },
  created() {
    this.getServices(this.formData.businessId);
    this.getEmployees();
  },
  methods: {
    async toggleForm() {
      this.isFormOpen = !this.isFormOpen;
    },
    async openModal(id) {
      this.deleteServiceId = id;
      this.deleteEmployeeId = id;
      this.isModalOpen = true;
    },
    openEmployeeEditModal(id) {
      this.isEditEmployeeModalOpen = true;
      this.employees.forEach(employee => {
        if (employee.id === id) {
          this.editEmployee = {
            FullName: employee.fullName,
            Phone: employee.phone,
            Email: employee.email,
            IsMale: employee.isMale,
          };
        }
      });
    },
    openServiceEditModal(id) {
      this.deleteServiceId = id;
      this.isEditServiceModalOpen = true;
      this.services.forEach(service => {
        if (service.id === id) {
          this.editService = {
            name: service.name,
            description: service.description,
            file: service.imageUrl,
            imageId: service.imageId,
          };
        }
      });
    },
    async closeDeleteServiceModal() {
      this.isModalOpen = false;
    },
    async closeDeleteEmployeeModal() {
      this.isModalOpen = false;
    },
    async closeEditEmployeeModal() {
      this.isEditEmployeeModalOpen = false;
    },
    async closeEditServiceModal() {
      this.isEditServiceModalOpen = false;
    },
    async goToStep(stepNumber) {
      this.step = stepNumber;
    },
    // Fetch services from db
    async getServices(businessId) {
      try {
        const urlEndpoint = `/GetServices/${this.formData.businessId}`;
        const res = await httpClient.get(urlEndpoint);
        this.services = res.data; // Store API response
      } catch (error) {
        alert("Error fetching services:", error);
      }
    },
    async fetchBusinessDetails() {
      try {
        const token = sessionStorage.getItem("jwt");
        const VITE_API_KEY = import.meta.env.VITE_API_KEY;
        const res = await httpClient.get("/business/getAllBusinesses", {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-api-key': VITE_API_KEY
          }
        });

        this.businessDetails = res.data; // Store API response
      } catch (error) {
        console.error("Error fetching business details:", error);
      }
    },
    async onFileChange(event) {
      if (this.isEditServiceModalOpen) {
        this.editService.file = event.target.files[0]; // Store selected file
      }
      this.formData.file = event.target.files[0]; // Store selected file
    },
    async createService() {
      try {
        this.displaySpinnerMessage = true;

        // Create FormData to send the file
        let formData = new FormData();
        formData.append("file", this.formData.file);
        formData.append("name", this.formData.name);
        formData.append("description", this.formData.description);
        formData.append("businessId", this.formData.businessId);

        await httpClient
          .post(this.CreateService, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(() => {
            this.getServices(this.formData.businessId)
            const modalElement = document.getElementById("submissionModal");
            const submissionModal = new Modal(modalElement);
            submissionModal.show();
            scrollUp();
          })
          .catch(error => {
            alert("Failed to submit form. Please try again.", error);
          });

      } catch (error) {
        alert("Failed to submit form. Please try again.", error);
      }
      // Reset the form fields
      document.getElementById("createServiceForm").reset(); // Reset the form fields
      // Reset the form data
      this.formData = {
        name: "",
        description: "",
        businessId: "YohanJS",
        file: null,
      };
      this.displaySpinnerMessage = false;
    },
    async UpdateThisService(id) {
      try {
        this.displaySpinnerMessage = true;
        // Create FormData to send the file
        let formData = new FormData();
        formData.append("file", this.editService.file);
        formData.append("imageId", this.editService.imageId);
        formData.append("name", this.editService.name);
        formData.append("description", this.editService.description);
        formData.append("businessId", this.formData.businessId);
        await httpClient
          .put(
            this.UpdateService + `/${this.deleteServiceId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }
          )
          .then(() => {
            this.getServices(this.formData.businessId);
            this.closeEditServiceModal();
            alert("Service updated successfully!");
          })
          .catch(function (error) {
            alert("Failed to submit form. Please try again.", error);
          });
      } catch (error) {
        alert("Failed to submit form. Please try again.", error);
      }
      // Reset the form fields
      document.getElementById("createServiceForm").reset(); // Reset the form fields
      // Reset the form data
      this.formData = {
        name: "",
        description: "",
        businessId: "YohanJS",
        file: null,
      };
      this.displaySpinnerMessage = false;
    },
    async deleteService() {
      await httpClient.delete(`/${this.deleteServiceId}`)
        .then(() => {
          this.getServices(this.formData.businessId);
          this.closeDeleteServiceModal();
          scrollUp();
        })
    },
    async deleteEmployee() {
      console.log("click");
      await httpClient.delete(`DeleteEmployee/${this.deleteEmployeeId}`)
        .then(() => {
          this.getEmployees();
          this.closeDeleteEmployeeModal();
          scrollUp();
        })
    },
    //Fetch employees from db
    async getEmployees(businessId) {
      try {
        const urlEndpoint = `/GetAllEmployees/${this.formData.businessId}`;
        const res = await httpClient.get(urlEndpoint);
        this.employees = res.data; // Store API response
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },
  },
  setup() {
    const isMobile = ref(false);

    onMounted(() => {
      isMobile.value = window.innerWidth <= 768;
      window.addEventListener("resize", updateIsMobile);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateIsMobile);
    });

    const updateIsMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    return {
      isMobile,
      updateIsMobile,
    };
  }
};
</script>

<template>
  <div class="container-fluid mt-5 mb-5" style="max-width: 1920px;">
    <div class="row d-flex justify-content-around mt-3 pt-5">
      <div class="col-12 col-md-3 p-2 shadow-sm rounded-2 mt-3" :class="[{ 'min-vh-100': !isMobile }]">
        <h4 class="mb-4 fs-6">Hi, admin</h4>
        <div class="shadow-sm p-3 rounded-2">
          <p :class="['mb-3', { 'fill-bg': step === 1 }]" @click="goToStep(1)"
            style="cursor: pointer; font-size: 0.8rem;"><i class="bi bi-node-plus"></i> Services</p>
          <p :class="['mb-3', { 'fill-bg': step === 2 }]" @click="goToStep(2)"
            style="cursor: pointer; font-size: 0.8rem;"><i class="bi bi-person-add"></i> Employees</p>
          <p :class="['mb-3', { 'fill-bg': step === 3 }]" @click="goToStep(3)"
            style="cursor: pointer; font-size: 0.8rem;"><i class="bi bi-calendar3"></i> Calendar</p>
        </div>
      </div>

      <div class="col-12 col-md-9 p-2 mt-3 text-center">
        <!-- Step 1: Add Services -->
        <div v-if="step === 1">
          <div class="p-0">
            <!-- Add this inside your <template> -->
            <button @click="fetchBusinessDetails" class="btn btn-primary">
              Test Business API Call
            </button>
            <!-- Add Service Buttons Section -->
            <div class="col-12 text-end">
              <i v-if="!isFormOpen" @click="toggleForm" class="btn-add text-white" style="cursor: pointer;">
                Add service
                <i class="bi bi-plus bg-white text-dark rounded-5"></i>
              </i>
              <i v-else @click="toggleForm" class="btn-close-service text-white" style="cursor: pointer;">
                Close
                <i class="bi bi-dash bg-white text-dark rounded-5"></i>
              </i>
            </div>
          </div>
          <div class="mb--3">
            <div class="mt-4">
              <!-- Collapsible Form -->
              <div class="col-12 text-start mt-4" v-show="isFormOpen">
                <form @submit.prevent="createService" id="createServiceForm" class="p-3 shadow-lg rounded-2">

                  <!-- Image Upload -->
                  <div class="form-floating mb-3">
                    <input type="file" @change="onFileChange" class="form-control" id="serviceImage"
                      placeholder="Upload Image">
                    <label for="serviceImage">Service Image</label>
                  </div>

                  <!-- Service Name -->
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="serviceName" placeholder="Service Name"
                      v-model="formData.name" required>
                    <label for="serviceName">Service Name</label>
                  </div>

                  <!-- Service Description -->
                  <div class="form-floating mb-3">
                    <textarea class="form-control" id="serviceDescription" placeholder="Description"
                      style="height: 120px" maxlength="100" v-model="formData.description" required></textarea>
                    <label for="serviceDescription">Description (max 100 characters)</label>
                  </div>

                  <!-- Submit Button -->
                  <div class="d-flex justify-content-end">
                    <div v-if="displaySpinnerMessage">
                      <button class="btn btn-outline-dark border-0" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                      </button>
                    </div>
                    <div v-else>
                      <button type="submit" class="submit-btn btn text-white">
                        Submit
                        <i class="bi bi-send-check-fill"></i>
                      </button>
                    </div>
                  </div>
                </form>

                <!--SUCCESS MODAL-->
                <div>
                  <div class="modal fade" id="submissionModal" tabindex="-1" aria-labelledby="submissionModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content modern-modal rounded-2 border-0 shadow-lg">
                        <div class="modal-header border-0">
                          <button type="button" class="btn-close text-dark" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center p-4">
                          <h5 class="modal-title fw-bold mb-1">Thank You!</h5>
                          <i class="bi bi-emoji-smile-fill fs-4"></i>
                          <p>Your service has been successfully created.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 1: Display services dynamically -->
          <div class="row d-flex justify-content-center align-items-center m-0">
            <div class="col-12 col-md-4 col-lg-3 d-flex justify-content-center p-1" v-for="service in services">
              <div class="custom-card mt-4">
                <div class="card-header">
                  <h6 class="card-title p-3">{{ service.name }}</h6>
                  <img :src="service.imageUrl" class="card-img" alt="Service Image">
                </div>
                <div class="card-body">
                  <p class="card-text text-start small">
                    {{ service.description }}
                  </p>
                </div>
                <div class="card-footer d-flex justify-content-end mb-2">
                  <span @click="openModal(service.id)" class="bi bi-trash action-icon-trash">
                    Delete
                  </span>
                  <span @click="openServiceEditModal(service.id)" class="bi bi-pencil-square action-icon-services">
                    Edit
                  </span>
                </div>
              </div>
              <!--EDIT SERVICE MODAL-->
              <div v-if="isEditServiceModalOpen" class="modal-overlay">
                <div class="edit-modal-content rounded-2">
                  <span @click="closeEditServiceModal" class="close" title="Close Modal">X</span>
                  <div class="edit-container p-4 rounded">
                    <h4 class="text-center mb-4">Edit Service</h4>
                    <form @submit.prevent="UpdateThisService(service.id)">
                      <!-- Image Upload -->
                      <div class="mb-3">
                        <label class="form-label fw-bold">Service Image</label>
                        <input type="file" @change="onFileChange" class="form-control">
                      </div>

                      <!-- Image Id -->
                      <input type="hidden" v-model="editService.imageId" />

                      <!-- Service Name-->
                      <div class="form-floating mb-1">
                        <input type="text" class="form-control rounded-3" id="serviceName" v-model="editService.name"
                          required />
                        <label for="serviceName">Service name</label>
                      </div>

                      <!-- Description -->
                      <div class="form-floating mb-1">
                        <textarea class="form-control rounded-3" id="description" v-model="editService.description"
                          rows="10" style="height: auto; overflow: auto;" maxlength="100"></textarea>
                        <label for="description">Description</label>
                      </div>

                      <!-- Buttons -->
                      <div class="mt-4 d-flex justify-content-center">
                        <div v-if="displaySpinnerMessage">
                          <button class="btn btn-outline-dark border-0" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                          </button>
                        </div>
                        <div v-else>
                          <button type="submit" class="btn btn-primary px-4 py-2 rounded-3 shadow-sm">Update</button>
                          <button type="button" class="btn btn-outline-secondary px-4 py-2 ms-3 rounded-3 shadow-sm"
                            @click="closeEditServiceModal">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <!--DELETE SERVICE MODAL-->
              <div v-if="isModalOpen" class="delete-modal">
                <div class="delete-modal-content rounded-2">
                  <span @click="closeDeleteServiceModal" class="close" title="Close Modal">X</span>
                  <div class="delete-container">
                    <p>Are you sure you want to delete this service?</p>
                    <button class="deletebtn" @click="deleteService">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Add Employees -->
        <div v-if="step === 2" class="p-3 rounded">
          <div class="row p-0 mb-3">
            <div class="col-12 text-center">
              <button class="btn btn-outline-success px-4 py-2">
                <i class="bi bi-plus-circle me-2"></i> Add Employee
              </button>
            </div>
          </div>
          <div class="row d-flex justify-content-center align-items-center m-0">
            <div class="col-12 col-md-4 col-lg-3 d-flex justify-content-center p-1" v-for="employee in employees"
              :key="employee.id">
              <div class="custom-card mt-4">
                <div class="card-header">
                  <h6 class="card-title p-3">{{ employee.fullName }}</h6>
                  <img :src="employee.isMale ? maleProfileImg : femaleProfileImg" class="employee-card-img mt-3" alt="Employee Image">
                </div>
                <div class="card-body mx-2">
                  <p class="card-text text-start small">
                    <strong>Phone:</strong>
                    <a :href="'tel:' + employee.phone" class="text-dark d-block">{{ employee.phone }}</a>
                    <strong>Email:</strong>
                    <a :href="'mailto:' + employee.email" class="text-dark d-block">{{ employee.email }}</a>
                  </p>
                </div>
                <div class="card-footer d-flex justify-content-end mb-2">
                  <span @click="openModal(employee.id)" class="bi bi-trash action-icon-trash">
                    Delete
                  </span>
                  <span @click="openEmployeeEditModal(employee.id)" class="bi bi-pencil-square action-icon-services">
                    Edit
                  </span>
                  <!--EDIT EMPLOYEE MODAL-->
                  <div v-if="isEditEmployeeModalOpen" class="modal-overlay">
                    <div class="edit-modal-content rounded-2">
                      <span @click="closeEditEmployeeModal" class="close" title="Close Modal">X</span>
                      <div class="edit-container p-2 rounded">
                        <h4 class="text-center mb-4">Edit Employee</h4>
                        <form @submit.prevent="updateEmployee">

                          <!-- Full Name -->
                          <div class="form-floating mb-3">
                            <input type="text" class="form-control rounded-3" id="fullName"
                              v-model="editEmployee.FullName" required />
                            <label for="fullName">Full Name</label>
                          </div>

                          <!-- Phone -->
                          <div class="form-floating mb-3">
                            <input type="text" class="form-control rounded-3" id="phone" v-model="editEmployee.Phone"
                              maxlength="50" />
                            <label for="phone">Phone</label>
                          </div>

                          <!-- Email -->
                          <div class="form-floating mb-3">
                            <input type="email" class="form-control rounded-3" id="email" v-model="editEmployee.Email"
                              maxlength="50" />
                            <label for="email">Email</label>
                          </div>

                          <!-- Gender -->
                          <div class="mt-4">
                            <div class="form-check form-check-inline">
                              <input class="form-check-input" type="radio" name="gender" id="male" value="true"
                                v-model="editEmployee.IsMale" />
                              <label class="form-check-label" for="male">Male</label>
                            </div>
                            <div class="form-check form-check-inline">
                              <input class="form-check-input" type="radio" name="gender" id="female" value="false"
                                v-model="editEmployee.IsMale" />
                              <label class="form-check-label" for="female">Female</label>
                            </div>
                          </div>

                          <!-- Buttons -->
                          <div class="mt-4 d-flex justify-content-center">
                            <button type="submit" class="btn btn-primary px-4 py-2 rounded-3 shadow-sm">Update</button>
                            <button type="button" class="btn btn-outline-secondary px-4 py-2 ms-3 rounded-3 shadow-sm"
                              @click="closeEditEmployeeModal">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <!--DELETE EMPLOYEE MODAL-->
                  <div v-if="isModalOpen" class="delete-modal">
                    <div class="delete-modal-content rounded-2">
                      <span @click="closeDeleteEmployeeModal" class="close" title="Close Modal">X</span>
                      <div class="delete-container">
                        <p class="text-danger">Are you sure you want to delete this employee? </p>
                        <button class="deletebtn" @click="deleteEmployee">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Calendar -->
        <div v-if="step === 3" class="p-3 rounded shadow-sm">
          <h3 class="mb-3">Calendar</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-close-service {
  background: linear-gradient(135deg, #f94545, #ac2e2e);
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 0.9rem;
}

.btn-add {
  background: linear-gradient(135deg, #007FFF, #4e44bc);
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 0.9rem;
}

.submit-btn {
  background: linear-gradient(135deg, #007FFF, #4e44bc);
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 0.9rem;
}

.submit-btn:hover {
  color: #1a1919;
  background-color: #d9d9d9;
}

/* Background fill animation */
.fill-bg {
  color: #eee;
  font-weight: bold;
  border-radius: 5px;
  background: linear-gradient(135deg, #007FFF, #4e44bc);
  background-size: 0% 100%;
  background-repeat: no-repeat;
  padding: 10px;
  animation: fillEffect 1s ease-in-out forwards;
}

.card-img-top {
  border-top-right-radius: 15px 15px;
  border-top-left-radius: 15px 15px;
}

.custom-card {
  cursor: pointer;
  width: 300px;
  border-radius: 5px;
  overflow: hidden;
  background: #f5f6ff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  white-space: pre-wrap;
  /* Preserves line breaks and wraps text */
  word-wrap: break-word;
  /* Ensures long words wrap */
  overflow-wrap: break-word;
  /* Alternative for compatibility */
  border: none;
}

.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  text-align: center;
}

.card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.employee-card-img {
  width: 150px; /* Set a fixed width */
  height: 150px; /* Set a fixed height to maintain the circle */
  object-fit: cover; /* Ensure the image fits within the circle */
  border-radius: 50%; /* Make the image circular */
  border: 2px solid #ddd; /* Optional: Add a border for better visibility */
}
.card-body {
  height: 150px;
  margin-top: 10px;
  padding: 5px;
}

.card-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: #000;
  background-color: #e8eafd;
}

.card-text {
  font-size: 0.8rem;
  color: #666;
}

.card-footer {
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
  padding: 0px 5px;
}

.action-icon-trash {
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 5px;
}

.action-icon-trash:hover {
  color: #f3f3f3;
  background-color: #ec3a3a;
  padding: 2px 5px;
  border: none;
}

.action-icon-services {
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 5px;
}

.action-icon-services:hover {
  color: #f3f3f3;
  background: linear-gradient(135deg, #007FFF, #4e44bc);
  padding: 2px 5px;
  border: none;
}

@keyframes fillEffect {
  from {
    background-size: 0% 100%;
  }

  to {
    background-size: 100% 100%;
  }
}

.employee-card {
  background-color: #ffffff;
}

/* Delete Modal */
.deletebtn {
  background-color: #f82e1f;
  border: none;
  border-radius: 5px;
  color: white;
  width: 100%;
}

.delete-container {
  padding: 16px;
  text-align: center;
}

.delete-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(46, 45, 45, 0.5);
}

.delete-modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 400px;
  text-align: center;
  position: relative;
}

.close {
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #151515;
  cursor: pointer;
}

.close:hover {
  color: #f44336;
}

/* EDIT MODAL CSS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(46, 45, 45, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-modal-content {
  background: white;
  padding: 20px;
  margin-top: 70px;
  width: 400px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  font-size: 18px;
}

.edit-container {
  text-align: center;
}
</style>
