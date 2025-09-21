<template>
    <div class="container my-5 pt-5">
        <h2 class="text-center mb-4 pt-4 pb-4">Cloudflare Image Manager</h2>

        <!-- Upload Form -->
        <div class="card p-4 shadow-sm">
            <h5 class="mb-3">Upload an Image</h5>
            <div class="mb-3">
                <input type="file" class="form-control" @change="onFileChange" />
            </div>
            <!-- Upload Image -->
            <div v-if="displaySpinnerMessage">
                <button class="btn btn-outline-dark border-0" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                </button>
            </div>
            <div v-else>
                <button class="btn btn-primary w-100" @click="uploadImage" :disabled="!selectedFile">
                    Upload Image
                </button>
            </div>

        </div>
        <!-- Load All Images -->
        <div v-if="displaySpinnerMessage">
            <button class="btn btn-outline-dark border-0" type="button" disabled>
                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            </button>
        </div>
        <div v-else>
            <div class="text-center mt-3">
                <button class="btn btn-primary" @click="fetchAllImages">Load All Images</button>
            </div>
        </div>

        <!-- Display Images -->
        <div v-if="images.length" class="mt-4">
            <h3 class="text-center mb-4">Images</h3>
            <div class="row justify-content-center pt-4 p-0">
                <div v-for="image in images" :key="image.id" class="col-6 col-md-4 col-sm-6 mb-4">
                    <div class="card shadow-sm">
                        <img :src="image.variants[0]" :alt="image.filename" class="card-img-top" loading="lazy" />
                        <div class="card-body text-center">
                            <p class="fw-bold">Timestamp</p>
                            <p>{{ formatDateTime(image.uploaded) }}</p>
                        </div>
                    </div>
                    <div v-if="displayDeletingMessage">
                        <div class="spinner-grow spinner-grow-sm text-danger" role="status">
                            <span class="visually-hidden">Deleting image..</span>
                        </div>
                    </div>
                    <div v-else>
                        <div class="text-center mt-3">
                            <button class="btn btn-sm btn-danger" @click="deleteImage(image.id)">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- No Images Found -->
        <div v-else class="text-center text-muted mt-4">
            <p>No images found. Try searching or uploading an image.</p>
        </div>
    </div>
</template>

<script>
import httpClient from "../util/axiosClient";
import moment from "moment";

export default {
    data() {
        return {
            images: [],
            businessName: "",
            selectedFile: null,
            displaySpinnerMessage: false,
            displayDeletingMessage: false
        };
    },
    created() {
        this.displaySpinnerMessage = true;
        this.fetchAllImages();
    },
    methods: {
        formatDateTime(dateTime) {
            return moment(dateTime).format("MMMM D, YYYY h:mm A"); // Example: June 5, 2024 2:30 PM
        },
        async fetchAllImages() {
            this.displaySpinnerMessage = true;
            try {
                const response = await httpClient.get("/ImageUploader/GetAllImages");
                this.displaySpinnerMessage = false;
                this.images = response.data.result.images;
            } catch (error) {
                console.error("Error fetching all images:", error);
            }
        },
        async fetchImagesByBusiness() {
            if (!this.businessName) {
                alert("Please enter a business name.");
                return;
            }
            try {
                const response = await httpClient.get(`/ImageUploader/GetImageByBussinesName?businessName=${this.businessName}`);
                this.images = response.data;
            } catch (error) {
                console.error("Error fetching images by business:", error);
            }
        },

        onFileChange(event) {
            this.selectedFile = event.target.files[0];
        },

        async uploadImage() {
            if (!this.selectedFile) {
                alert("Please select an image.");
                return;
            }

            let formData = new FormData();
            formData.append("file", this.selectedFile);

            try {
                this.displaySpinnerMessage = true;
                await httpClient.post("/ImageUploader/UploadFile", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                this.fetchAllImages();
                this.displaySpinnerMessage = false;
                alert("Image uploaded successfully!");
                this.selectedFile = null;
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        },
        async deleteImage(id) {
            console.log(id);
            try {
                this.displayDeletingMessage = true;
                await httpClient.delete("/ImageUploader/DeleteImage", { params: { imageId: id } }, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                this.fetchAllImages();
                this.displayDeletingMessage = false;
                alert("Image deleted successfully!");
                this.selectedFile = null;
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        },
    },
};
</script>


<style scoped>
.container {
    max-width: 800px;
}

.card {
    border-radius: 10px;
}

.card-img-top {
    height: 200px;
    object-fit: cover;
}

.btn {
    font-weight: 600;
}
</style>