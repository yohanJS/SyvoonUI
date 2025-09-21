<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="container-fluid p-0 mb-5 text-white">
        <!-- Loading State with Placeholder Cards -->
        <div v-if="loading" class="mt-4">
            <div class="skeleton-card mb-3" v-for="n in 9" :key="n">
                <div class="skeleton-title"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
            </div>
        </div>
        <!-- Services Section -->
        <!-- Button to Fetch services -->
        <!-- <div class="text-end">
                <button @click="fetchServices" class="btn btn-small rounded-pill py-2 "
                    style="background-color: #f8b195; font-size: 0.8rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff"
                        class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                        <path
                            d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                    </svg>
                </button>
            </div> -->
        <div class="row m-0 p-4 text-center mt-5">
            <div class="col-12 p-0" v-if="services !== null">
                <h4 class="mt-5 text-dark">ADMIN DASHBOARD</h4>
                <!-- Month and Year Section -->
                <div class="row m-0 justify-content-center align-items-center p-0 rounded-bottom-2">
                    <!-- Week Range Section -->
                    <div class="row align-items-center text-dark text-center m-1 p-0">
                        <div class="col-2 col-md-5 p-0">
                            <i @click="previousWeek" class="bi bi-arrow-left-circle fs-3" style="color: #007bff;"></i>
                        </div>
                        <div class="col-8 col-md-2 p-0 text-center">
                            <p class="pt-2 pb-2 rounded-5 m-0 fs-6 rounded-5">{{ weekRange
                                }},
                                <span>{{ currentMonth }}</span>
                            </p>
                        </div>
                        <div class="col-2 col-md-5 p-0">
                            <i @click="nextWeek" class="bi bi-arrow-right-circle fs-3" style="color: #007bff;"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-2 mb-5 m-2" v-if="services !== null">
            <!--Mobile Services Section-->
            <div v-if="isMobile" v-for="record in services">
                <p v-if="isDateInWeekRange(record.serviceDate)" :id="isToday(record.serviceDate) ? 'today' : null"
                    :class="{
                        'fs-4': true,
                        'text-dark': true,
                        'fw-bold': true,
                        'mb-2': true,
                        'fs-2': true,
                        'p-3': true,
                        'rounded-3': true,
                        'shadow-sm': isToday(record.serviceDate)
                    }">
                    {{ formatMonthAndDay(record.serviceDate) }}
                </p>
                <div>
                    <div class="row m-1 d-flex justify-content-end" v-if="isDateInWeekRange(record.serviceDate)"
                        v-for="service in record.services">
                        <div class="col-12 mb-2">
                            <p class="mb-1 text-dark fs-5">{{ service.time }}</p>
                        </div>
                        <div class="col-10">
                            <div class="m-0 details-card mb-3 rounded-3">
                                <p class="mb-0"><span class="fw-bold">Client: </span><span
                                        style="font-family: Arial, Helvetica, sans-serif">{{ service.name }}</span>
                                </p>
                                <p class="mb-0"><span class="fw-bold">Service: </span><span
                                        style="font-family: Arial, Helvetica, sans-serif">{{ service.serviceName
                                        }}</span></p>
                                <!--Collapse Button-->
                                <button class="btn btn-sm w-100 btn-details mt-3 mb-2" type="button"
                                    :data-bs-toggle="'collapse'" :data-bs-target="'#collapse' + service.serviceId"
                                    :aria-expanded="false" :aria-controls="'collapse' + service.serviceId">
                                    <i class="bi bi-chevron-double-down"></i> Contact Info
                                </button>
                                <!--Collapsible Section-->
                                <div :id="'collapse' + service.serviceId" class="collapse">
                                    <p class="card-text mb-1 mt-3 fw-bold">
                                        Email:
                                        <a :href="'mailto:' + service.email" aria-label="Email to button" class="fw-bold text-dark">
                                            <span>{{ service.email }} ok</span>
                                            <i class="m-1 bi bi-envelope-plus"></i>
                                        </a>
                                    </p>
                                    <p class="card-text mb-1 fw-bold">
                                        Phone:
                                        <a :href="'tel:' + service.phone" aria-label="Phone Call Button" class="fw-bold text-dark">
                                            <span style="font-family: Arial, Helvetica, sans-serif">{{ service.phone
                                                }}</span>
                                            <i class="m-1 bi bi-telephone-outbound"></i>
                                        </a>
                                    </p>
                                    <p class="card-text">
                                    <div v-if="!service.address">
                                        Online
                                    </div>
                                    <div v-else>
                                        <span class="fw-bold">Address:</span> <span>{{
                                            service.address }}</span>
                                    </div>
                                    </p>
                                </div>
                                <!--Edit btn-->
                                <div class="text-end mt-2">
                                    <!-- <i @click="deleteService(service.serviceId)" class="bi bi-trash3 me-2">
                                            Cancel</i> -->
                                    <i @click="editService(service.serviceId)" class="bi bi-pencil"
                                        style="font-family: Arial, Helvetica, sans-serif"> Edit</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr v-if="isDateInWeekRange(record.serviceDate)" class="border-2 mt-3 w-75 m-4 text-dark">
            </div>
            <!--Desktop Services Section-->
            <div v-else class="container-fluid">
                <div class="row shadow-sm m-0 mb-4">
                    <div class="col-12 mt-3 mb-3">
                        <h2 class="text-dark">{{ currentMonth }}</h2>
                    </div>
                </div>
                <div class="d-flex flex-wrap justify-content-center p-3 rounded-2 shadow-sm">                   
                    <div v-for="record in services" :key="record.id">
                        <div class="col">
                            <h5 class="text-dark mb-3 p-2 shadow-sm" v-if="isDateInWeekRange(record.serviceDate)" :class="{'today-class': isToday(record.serviceDate)}">
                            {{ formatMonthAndDay(record.serviceDate) }}
                            <hr class="border-2 mt-2" style="width:50%; color: #000;">
                        </h5>
                        <div v-for="service in record.services" v-if="isDateInWeekRange(record.serviceDate)">
                            <p class="mb-0 text-dark">{{ service.time }}</p>
                            <div class="m-0 details-card mb-3 rounded-3 shadow-sm">
                                <p class="mb-0"><span class="fw-bold">Client: <br></span><span
                                        style="font-family: Arial, Helvetica, sans-serif">{{ service.name }}</span>
                                </p>
                                <p class="mb-0"><span class="fw-bold">Service:<br> </span><span
                                        style="font-family: Arial, Helvetica, sans-serif">{{ service.serviceName
                                        }}</span></p>

                                <p class="card-text mb-1 mt-2">
                                    <span class="fw-bold">Email:</span><br>
                                    <a :href="'mailto:' + service.email" aria-label="Email to Button" class="fw-bold text-dark">
                                        <span style="font-family: Arial, Helvetica, sans-serif">{{ service.email
                                            }}</span>
                                        <i class="m-1 bi bi-envelope-plus"></i>
                                    </a>
                                </p>
                                <p class="mb-0"><span class="fw-bold">Time:<br> </span><span
                                        style="font-family: Arial, Helvetica, sans-serif">{{ service.time
                                        }}</span></p>
                                <p class="card-text mb-1">
                                    <span class="fw-bold">Phone:</span><br>
                                    <a :href="'tel:' + service.phone" aria-label="Call to Button" class="fw-bold text-dark">
                                        <span style="font-family: Arial, Helvetica, sans-serif">{{ service.phone
                                            }}</span>
                                        <i class="m-1 bi bi-telephone-outbound"></i>
                                    </a>
                                </p>
                                <p class="card-text mb-0">
                                <div v-if="!service.address">Online</div>
                                <div v-else> <span class="fw-bold">Address:</span> <br><span
                                        style="font-family: Arial, Helvetica, sans-serif">{{
                                            service.address }}</span>
                                </div>
                                </p>
                                <!-- Edit button -->
                                 <div class="col-12">
                                    <div class="text-end mt-3">
                                    <i @click="editService(service.serviceId)" class="bi bi-pencil"
                                        style="font-family: Arial, Helvetica, sans-serif"> Edit</i>
                                </div>
                                 </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <i class="bi bi-arrow-up-circle up-icon text-white fs-5 fw-bold" @click="takeMeUp"></i>
    </div>
</template>

<script>
import httpClient from "../util/axiosClient";
import moment from 'moment';
import NavBar from './NavBar.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
    components: {
        NavBar,
    },
    data() {
        return {
            today: moment().format('MMM DD'),
            todaysDate: "",
            currentMonth: moment().format('MMM YYYY'),
            weekDays: moment.weekdays(),
            weekRange: "",
            loading: false,
            services: null,
            serviceId: null,
            startOfWeek: moment().startOf('week').format('YYYY-MM-DD'),
            endOfWeek: moment().endOf('week').format('YYYY-MM-DD'),
            GetservicesUrl: "Bookings/GetAllBookings?businessId=YohanJS",
            EditServicesUrl: "Bookings/EditBooking",
        };
    },
    async created() {
        await this.$nextTick();
        this.getWeekRange();
        await this.fetchServices();
    },
    watch: {
        weekRange(newVal, oldVal) {
            this.getWeekRange();
        },
        startOfWeek() {
            this.updateDisplayedServices();
        },
        endOfWeek() {
            this.updateDisplayedServices();
        },
        currentMonth() {
            this.updateDisplayedServices();
        }
    },
    methods: {
        takeMeUp() {
            window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Optional for smooth scrolling
            });
        },
        formatMonthAndDay(serviceDate) {
            const today = moment().startOf('day');
            const serviceDateMoment = moment(serviceDate, "YYYY/MM/DD", true);

            if (serviceDateMoment.isValid() && serviceDateMoment.isSame(today, 'day')) {
                return serviceDateMoment.format("MMM DD") + " Today";
            }

            return serviceDateMoment.isValid() ? serviceDateMoment.format("MMM D") : "Invalid Date";
        },
        isToday(serviceDate) {
            const today = moment().startOf('day'); // Normalize today to midnight
            const date = moment(serviceDate, "YYYY/MM/DD", true); // Strict parsing of serviceDate
            return date.isValid() && date.isSame(today, 'day');
        },
        isTodayBooking() {
            const today = moment(); // Get today's date
            const endOfWeek = moment().endOf('week'); // Get the end of the current week
            const days = [];

            // Loop from today to the end of the week
            while (today.isSameOrBefore(endOfWeek, 'day')) {
                days.push(today.format('dddd')); // Add day of the week (e.g., Monday, Tuesday) to the list
                today.add(1, 'day'); // Move to the next day
            }

            for (var i = 0; i < days.length; i++) {
                if (days[i] === moment().format('dddd')) {
                    return moment().format('MMM YY') + " Today";
                }
                return day
            }
        },
        updateDisplayedServices() {
            // Force re-evaluation of services by simply triggering Vue's reactivity
            //TODO read more about this*************************
            this.services = [...this.services]; // Shallow copy to trigger re-render
        },
        getDay(date) {
            return moment(new Date(date)).format('dddd');
        },
        previousMonth() {
            this.currentMonth = moment(this.currentMonth, 'MMM YYYY').subtract(1, 'months').startOf('month').format('MMM YYYY');
        },
        nextMonth() {
            this.currentMonth = moment(this.currentMonth, 'MMM YYYY').add(1, 'months').startOf('month').format('MMM YYYY');
        },
        getWeekRange() {
            const startOfWeekFormatted = moment(this.startOfWeek, 'YYYY-MM-DD').format('DD');
            this.weekDays = moment.weekdays().map((day, index) => ({ name: day, date: moment(this.startOfWeek).clone().add(index, 'days').format('D') }));
            const endOfWeekFormatted = moment(this.endOfWeek, 'YYYY-MM-DD').format('DD');

            this.weekRange = `Week ${startOfWeekFormatted}-${endOfWeekFormatted}`;
        },
        isDateInWeekRange(serviceDate) {
            const currentStartDate = moment(this.startOfWeek, 'YYYY-MM-DD');
            const currentEndDate = currentStartDate.clone().endOf('week');
            const serviceMoment = moment(serviceDate, 'YYYY-MM-DD');

            return serviceMoment.isBetween(currentStartDate, currentEndDate, null, '[]');
        },
        isbookingBookedInWeek(booking) {
            if (booking.services.length > 0) {
                for (let i = 0; i < booking.services.length; i++) {
                    if (this.isDateInWeekRange(booking.services[i].date)) {
                        return true;
                    }
                }
            }
            return false;
        },
        nextWeek() {
            const newStartOfWeek = moment(this.startOfWeek, 'YYYY-MM-DD').add(7, 'days'); // Parse and add 7 days

            this.startOfWeek = moment(newStartOfWeek).startOf('week').format('YYYY-MM-DD');
            this.currentMonth = newStartOfWeek.format('MMM YYYY');

            const newEndOfWeek = newStartOfWeek.clone().endOf('week');

            this.endOfWeek = newEndOfWeek.format('YYYY-MM-DD');
            this.getWeekRange();
        },
        previousWeek() {
            const newStartOfWeek = moment(this.startOfWeek, 'YYYY-MM-DD').subtract(7, 'days'); // Parse and subtract 7 days

            this.startOfWeek = moment(newStartOfWeek).startOf('week').format('YYYY-MM-DD');
            this.currentMonth = newStartOfWeek.format('MMM YYYY');

            const newEndOfWeek = newStartOfWeek.clone().endOf('week');

            this.endOfWeek = newEndOfWeek.format('YYYY-MM-DD');
            this.getWeekRange();
        },
        formatDate(date) {
            return moment(date).format('D'); // Format date to numeric day of the month
        },
        async fetchServices() {
            this.services = null;
            this.loading = true;
            try {
                const response = await httpClient.get(this.GetservicesUrl);
                this.services = response.data;

                // Wait for DOM updates
                //this.$nextTick() ensures that any DOM updates triggered by changes to this.services are completed before proceeding.
                await this.$nextTick();
                this.todaysDate = document.getElementById("today");

                if (this.todaysDate) {
                    this.todaysDate.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            } catch (error) {
                alert("Error fetching services:", error);
            } finally {
                this.loading = false;
            }
        },
        async editService(id) {
            try {
                this.services
                const response = await httpClient.post(this.EditServicesUrl,
                    {
                        serviceId: id,
                    }
                );
            } catch (error) {
                alert("Error deleting services:", error);
            } finally {
                this.loading = false;
                this.fetchServices();
            }
        },
    },
    setup() {
    const isMobile = ref(false);

    onMounted(() => {
      isMobile.value = window.innerWidth <= 1024;

      window.addEventListener('resize', updateIsMobile);
      window.addEventListener('scroll', makeNavBarSticky);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateIsMobile);
      window.removeEventListener('scroll', makeNavBarSticky);
    });

    const updateIsMobile = () => {
      isMobile.value = window.innerWidth <= 1024;
    };

    const makeNavBarSticky = () => {
      const navbar = document.getElementById("home");
      const sticky = 64;

      if (navbar) {
        if (window.scrollY >= sticky) {
          navbar.classList.add("position-sticky", "sticky");
        } else {
          navbar.classList.remove("position-sticky", "sticky");
        }
      } else {
        console.error('Navbar element not found.');
      }
    };

    return {
      isMobile,
      makeNavBarSticky,
      updateIsMobile,
    };
  }
};
</script>

<style scoped>
/* Styles for the floating booking button */
.up-icon {
  position: fixed;
  border-radius: 10px;
  bottom: 20px;
  right: 20px;
  height: 35px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #007FFF, #4e44bc);
  z-index: 1000;
  transition: background-color 0.3s ease;
}
#today {
    top: 10px;
    scroll-margin-top: 1000px;
}

/* Loading Skeleton */
.skeleton-card {
    background-color: #e0e0e0;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-title {
    height: 20px;
    background-color: #cfcfcf;
    width: 50%;
    margin-bottom: 0.5rem;
    border-radius: 4px;
}

.skeleton-line {
    height: 15px;
    background-color: #d9d9d9;
    margin-bottom: 0.5rem;
    border-radius: 4px;
}

.skeleton-line.short {
    width: 70%;
}

.border-color {
    border: 2px solid rgba(var(--bs-white-rgb), var(--bs-text-opacity)) !important;
    ;
}

.vl {
    border-left: 2px solid rgba(var(--bs-white-rgb), var(--bs-text-opacity)) !important;
    height: 50px;
}

@keyframes pulse {
    0% {
        background-color: #e0e0e0;
    }

    50% {
        background-color: #f0f0f0;
    }

    100% {
        background-color: #e0e0e0;
    }
}

.today-class {
    box-shadow: 1px 10px 2px 2px #ffffff;
    color: #000 !important;
    padding: 10px;
    border-radius: 5px;
}

.orange-txt {
    color: #F28C28;
}

.btn-details {
    background: linear-gradient(135deg, #007FFF, #4e44bc);
    color: #ffffff;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.btn-details:active {
    color: #192c39;
}

.details-card {
    color: #000000;
    font-size: 1rem;
    padding-left: 15px;
    padding-right: 15px;
    box-shadow: 2px 2px 5px rgba(200, 200, 200, 0.3);
}

/* ONLY DESKTOP */
@media screen and (min-width: 1024px) {
    .details-card {
        width: 230px;
        height: 385px;
        font-size: 0.8rem;
        cursor: pointer;
    }
    .details-card:hover {
        background-color: #007FFF;
        color: #ffffff;
    }
}

@media screen and (min-width: 1920px) {
    .details-card {
        width: 250px;
        height: 350px;
    }
}

/* Modern pastel card styling */
.pastel-card {
    background-color: #192c39;
    /* Soft gradient */
    border-radius: 16px;
    border: none;
    box-shadow: 0 6px 15px rgba(200, 200, 200, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
    /* Ensure cards take full height */
}

.pastel-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(200, 200, 200, 0.3);
}

/* Card body styling */
.pastel-card .card-body {
    padding: 1rem;
    font-size: 0.8rem;
    background-color: #e0e0e0;
    flex: 1;
    /* Make the body fill available space */
    display: flex;
    flex-direction: column;
}

/* Card title styling */
.pastel-card .card-title {
    font-size: 0.9rem;
    /* Slightly smaller font for mobile look */
    margin-bottom: 1rem;
}

/* Card text styling */
.pastel-card .card-text {
    font-size: 0.8rem;
    /* Smaller font for a modern mobile look */
    margin-bottom: 0.75rem;
}

/* List group styling */
.pastel-list-item {
    background-color: #f2f4ff;
    /* Light pastel blue */
    border: none;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    padding: 0.75rem;
    font-size: 0.9rem;
    /* Smaller font for consistency */
    transition: background-color 0.3s ease;
}

.pastel-list-item:hover {
    background-color: #e5e7ff;
    /* Slightly darker pastel blue on hover */
}

/* Centered grid layout */
.justify-content-center {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

/* DESKTOP CARD */
.mr {
    margin-right: 10px;
}
</style>