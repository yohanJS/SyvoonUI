<script>
export default {
    name: "HomePage",
    data() {
        return {
            zipCode: null,
            error: null,
            popularServices: [
                {
                    name: "FixIt Solutions (USA)",
                    provider: "TechPro Hub",
                    date: "17/08/2023",
                    image: "https://imagedelivery.net/YIVCzYnz4796uVIlcnjggw/baaec369-962a-41fd-7f91-25b59b8b4600/public"
                },
                {
                    name: "Frank Gay Plumbing & Drains",
                    provider: "Sparkle House",
                    date: "19/09/2023",
                    image: "https://imagedelivery.net/YIVCzYnz4796uVIlcnjggw/e487008f-e855-403e-d07a-5aed81ad0f00/public"
                }
            ],
            localServices: [
                {
                    name: "Pipe Masters",
                    provider: "Frank Gay Plumbing & Drains",
                    date: "19/09/2023",
                    image: "https://imagedelivery.net/YIVCzYnz4796uVIlcnjggw/666bda77-7f20-4383-386e-037ddba92000/public"
                },
                {
                    name: "Green Thumb",
                    provider: "Acree Plumbing, Air & Electric",
                    date: "22/09/2023",
                    image: "https://imagedelivery.net/YIVCzYnz4796uVIlcnjggw/14b3bd84-581c-4bbe-e6af-0497ea322c00/public"
                },
                {
                    name: "ColorSplash",
                    provider: "Cozy Home",
                    date: "23/09/2023",
                    image: "https://imagedelivery.net/YIVCzYnz4796uVIlcnjggw/666bda77-7f20-4383-386e-037ddba92000/public"
                },
                {
                    name: "SwiftSend",
                    provider: "Express Service",
                    date: "28/09/2023",
                    image: "https://imagedelivery.net/YIVCzYnz4796uVIlcnjggw/14b3bd84-581c-4bbe-e6af-0497ea322c00/public"
                }
            ],
            reviews: [
                {
                    name: 'Emily Johnson',
                    avatar: 'https://i.pravatar.cc/50?img=1',
                    rating: 4.5,
                    date: 'March 15, 2023',
                    comment: 'Emily was fantastic! The garden looks amazing, and she was very professional throughout the process.'
                },
                {
                    name: 'Michael Smith',
                    avatar: 'https://i.pravatar.cc/50?img=2',
                    rating: 5.0,
                    date: 'April 5, 2023',
                    comment: 'Michael did an excellent job with our plumbing issues. Highly recommended!'
                },
                {
                    name: 'David Lee',
                    avatar: 'https://i.pravatar.cc/50?img=3',
                    rating: 4.0,
                    date: 'March 22, 2023',
                    comment: 'David provided great cleaning services. The house feels fresher than ever!'
                }
            ],
        };
    },
    mounted() {
        //this.getUserLocation();
    },
    methods: {
        getUserLocation() {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        this.reverseGeocode(lat, lon);
                    },
                    (err) => {
                        this.error = 'Location permission denied or unavailable.';
                        console.error('Geolocation error:', err.message);
                        this.showModal(); // Show modal on error
                    }
                );
            } else {
                this.error = 'Geolocation is not supported in this browser.';
                this.showModal(); // Show modal if geolocation is not supported
            }
        },
        async reverseGeocode(lat, lon) {
            const apiKey = 'e8319ff489074ad5bd84e3797767a4a0';
            const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                const result = data.features?.[0];

                if (result?.properties?.postcode) {
                    this.zipCode = result.properties.postcode;
                } else {
                    this.error = 'Could not retrieve ZIP code from location.';
                }
            } catch (err) {
                console.error('Geoapify error:', err);
                this.error = 'Failed to connect to address service.';
            } finally {
                this.showModal(); // Show modal after fetch finishes
            }
        },
        showModal() {
            const modal = new bootstrap.Modal(document.getElementById('geolocationModal'));
            modal.show();
        }
    }
};
</script>

<template>
    <div class="container mx-auto py-3 p-0 rounded-4 m-0">
        <!-- Header -->
        <div class="header text-white text-center position-relative my-5 mb-3">
            <img src="https://imagedelivery.net/YIVCzYnz4796uVIlcnjggw/7b504a6c-01be-4c1d-7cba-e9f801fb8900/public"
                class="img-fluid w-100 rounded shadow" alt="Map background" />
            <div
                class="header-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center">
                <div class="col-10 text-start ms-3">
                    <h6 class="welcome-txt">Welcome,</h6>
                    <h4 class="welcome-txt-under">Find trusted services near you <i class="bi bi-search"></i> </h4>
                </div>
            </div>
        </div>
        <div class="container-bg m-0 p-4 rounded-4">
            <!-- Search Bar -->
            <div class="form-floating mb-4 p-0">
                <input type="text" class="form-control search-input border-0 shadow-sm" id="search"
                    placeholder="Search for a service or provider" />
                <label class="search-label" for="search">Search for a business or service</label>
                <button class="btn-book position-absolute top-50 end-0 translate-middle-y me-3" type="button">
                    <i class="bi bi-search"></i>
                </button>
            </div>

            <!-- Popular Services -->
            <h5 class="mb-3 fw-bold services-txt">Popular services</h5>
            <div class="row g-3 mb-5">
                <div class="col-12 col-md-6" v-for="(service, index) in popularServices" :key="index">
                    <div class="card flex-row align-items-center p-1 border-0">
                        <img :src="service.image" class="img-fluid me-3 border-0 rounded-2"
                            style="width: 100px; height: 70px; object-fit: cover;" />
                        <div class="row flex-grow-1">
                            <p class="mb-1 card-title-txt p-1">{{ service.name }}</p>
                            <small class="text-muted">{{ service.provider }} {{ service.date }}</small>
                        </div>
                        <div class="row text-end">
                            <div class="col-12">
                                <i class="bi bi-star-fill text-primary"> 4.5/5</i>
                            </div>
                            <!-- Force next columns to break to new line -->
                            <div class="w-100"></div>
                            <div class="col-12">
                                <button class="btn-book">Book</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--Review Section-->
            <div id="reviewCarousel" class="carousel slide mb-4" data-bs-ride="carousel">
                <h5 class="mb-3 fw-bold services-txt">Customer reviews</h5>
                <div class="carousel-inner shadow-sm rounded-4" style="height: 190px;">
                    <div class="carousel-item" :class="{ active: index === 0 }" v-for="(review, index) in reviews"
                        :key="index">
                        <div class="review-card mx-auto p-2 mb-4 border-0">
                            <div class="d-flex align-items-start">
                                <img :src="review.avatar" class="rounded-circle me-3"
                                    style="width: 50px; height: 50px; object-fit: cover;" alt="User avatar" />
                                <div>
                                    <h6 class="fw-bold mb-1">{{ review.name }}</h6>
                                    <p class="mb-0"><span class="fw-bold">Rated:</span> Acree Plumbing, Air & Electric
                                    </p>
                                    <div class="text-warning small mb-1">
                                        <i class="bi bi-star-fill" v-for="n in Math.floor(review.rating)" :key="n"></i>
                                        <i class="bi bi-star" v-if="review.rating % 1 !== 0"></i>
                                        <span class="text-muted ms-2">{{ review.rating.toFixed(1) }} - {{ review.date
                                        }}</span>
                                    </div>
                                    <p class="mb-0">{{ review.comment }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Local Services -->
            <h5 class="mb-3 fw-bold services-txt">Local services</h5>
            <div class="row g-2 mb-4 d-flex justify-content-center">
                <div class="col-12 col-md-4 col-lg-3 mb-3" v-for="(service, index) in localServices" :key="index">
                    <div class="card h-100 p-0 border-0">
                        <img :src="service.image" class="card-img-top rounded"
                            style="height: 150px; object-fit: cover;" />
                        <div class="card-body align-items-center p-0">
                            <!-- Text Section -->
                            <div class="row text-center p-2">
                                <div class="col-6 text-start py-1">
                                    <h6 class="card-title mb-1 mt-2 card-title-txt">{{ service.name }}</h6>
                                </div>
                                <div class="col-12 text-start py-1">
                                    <small class="text-muted d-block">{{ service.provider }}</small>
                                    <small class="text-muted" style="font-size: 0.7rem;">{{ service.date }}</small>
                                </div>
                                <div class="col-12 text-end align-self-center">
                                    <!-- Button Section -->
                                    <div class="col-12">
                                        <i class="bi bi-star-fill text-primary"> 4.8/5</i>
                                    </div>
                                    <!-- Force next columns to break to new line -->
                                    <div class="w-100"></div>
                                    <div class="col-12 mt-2">
                                        <button class="btn-book">Book</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Geolocation Modal -->
            <div class="modal fade" id="geolocationModal" tabindex="-1" aria-labelledby="geolocationModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="geolocationModalLabel">Geolocation Status</h5>
                            <button type="button" aria-hidden="true" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div v-if="error" class="alert alert-danger">{{ error }}</div>
                            <div v-if="zipCode" class="alert alert-success">
                                <p class="fw-bold">Your ZIP code is: {{ zipCode }}</p>
                                <p class="text-muted">We will display business based on this result.</p>
                            </div>
                            <div v-else class="text-muted">Getting your location...</div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" aria-hidden="true" class="btn btn-success"
                                data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.welcome-txt {
    font-size: 1.5rem;
    font-weight: bold;
}

.welcome-txt-under {
    font-size: 1.9rem;
    font-weight: bold;
}

.header-overlay {
    background-color: rgba(214, 214, 214, 0.5);
    color: #000;
    border-radius: 0.5rem;
}

.container-bg {
    background-color: #efeff0;
}

.btn-book {
    background: linear-gradient(135deg, #1d1c1c, #222222);
    color: #fff;
    padding: 5px 20px;
    font-size: 0.7rem;
    border-radius: 5px;
    border: none;
}

.search-label {
    font-size: 0.8rem;
    color: #797979;
}

.services-txt {
    font-size: 1rem;
    margin: 8px;
}

.card-title-txt {
    font-size: 0.9rem;
    font-weight: bold;
}

.card {
    background-color: #efeff0;
    border-radius: 0.5rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.review-card {
    font-size: 0.9rem;
    max-width: 90%;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: #00000030;
    border-radius: 50%;
}

.modal-content {
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
}

.modal-footer {
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
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
