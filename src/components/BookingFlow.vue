<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import moment from 'moment';
import { Modal } from "bootstrap";
import httpClient from "../util/axiosClient";
import { scrollUp } from "../util/scrollUp.js";
//Options API
export default {
    components: {

    },
    data() {
        const today = new Date();
        return {
            CreateBookingUrl: "/Bookings/CreateBooking",
            GetTimesUrl: "/Bookings/GetTimes",
            step: 1,
            //this will be populated dynamically once the component gets rendered
            services: [],
            selectedDate: today,
            currentYear: today.getFullYear(),
            currentMonth: today.getMonth(),
            weekdays: Array.from({ length: 7 }, (_, index) => moment().weekday(index).format('ddd')),
            monthNames: Array.from({ length: 12 }, (_, index) => moment().month(index).format('MMMM')),
            timeSlots: this.generateTimeSlots(),
            selectedTime: null,
            takenTimes: [],
            displaySpinnerMessage: false,
            isSubmissionOk: false,
            formData: {
                businessId: "YohanJS",
                name: "",
                email: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                service: "",
                meetingType: "",
                date: "",
                time: "",
            },
        };
    },
    created() {
        scrollUp();
        this.getServices(this.formData.businessId);
    },
    computed: {
        formattedTime() {
            // Format as HH:MM AM/PM
            if (this.selectedTime === "" || this.selectedTime === null) {
                return ""
            }
            return moment(this.selectedTime, 'HH:mm').format('h:mm A');
        },
        formattedDate() {
            return moment(this.selectedDate).format('MM/DD/YYYY');
        }
    },
    methods: {
        async goToStep(stepNumber) {
            this.step = stepNumber;
            await this.$nextTick();

            scrollUp();
        },
        //This function will get the services from the db
        async getServices(businessId) {
            try {
                const urlEndpoint = `/GetServices/${this.formData.businessId}`;
                const res = await httpClient.get(urlEndpoint);
                this.services = res.data; // Store API response
            } catch (error) {
                alert("Error fetching services:", error);
            }
        },
        getDates() {
            const dates = [];
            const startOfMonth = moment([this.currentYear, this.currentMonth]); // Start of the current month
            const endOfMonth = moment(startOfMonth).endOf('month'); // End of the current month

            // Add days from the previous month to fill the first week
            const startDay = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)
            for (let i = 0; i < startDay; i++) {
                dates.push(moment(startOfMonth).subtract(startDay - i, 'days').toDate());
            }

            // Add all dates from the current month
            for (let i = 0; i < endOfMonth.date(); i++) {
                dates.push(moment(startOfMonth).add(i, 'days').toDate());
            }

            // Add days from the next month to complete the grid
            const remainingDays = 7 - (dates.length % 7);
            for (let i = 1; i <= remainingDays && remainingDays < 7; i++) {
                dates.push(moment(endOfMonth).add(i, 'days').toDate());
            }

            return dates;
        },
        prevMonth() {
            this.currentMonth -= 1;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear -= 1;
            }
        },
        nextMonth() {
            this.currentMonth += 1;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear += 1;
            }
        },
        generateTimeSlots() {
            const slots = [];
            const startTime = moment().startOf('day').hour(8); // Start at 8:00 AM
            const endTime = moment().startOf('day').hour(18); // End at 6:00 PM
            while (startTime <= endTime) {
                slots.push(startTime.format('h:mm A'));
                startTime.add(30, 'minutes'); // Increment by 15 minutes
            }
            return slots;
        },
        getTimeCount(time) {
            let count = 0;
            this.takenTimes.forEach(t => {
                if (t === time) {
                    count++;
                };
            });
            return count;
        },
        selectService(service) {
            this.formData.service = service.name;
            this.goToStep(2);
        },
        selectDate(date) {
            this.selectedDate = date;
            this.formData.date = moment(date).format('YYYY/MM/DD');
            this.fetchTimes(moment(date).format('YYYY/MM/DD'), this.formData.businessId);
            if(this.isMobile) {
                document.getElementById("timePicker").scrollIntoView();
            }
        },
        selectTime(time) {
            this.selectedTime = time;
            this.formData.time = time;
            this.goToStep(3);
        },
        isToday(date) {
            const today = new Date();
            return (
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
            );
        },
        isSelectedDate(date) {
            return (
                this.selectedDate.getFullYear() === date.getFullYear() &&
                this.selectedDate.getMonth() === date.getMonth() &&
                this.selectedDate.getDate() === date.getDate()
            );
        },
        async goToHome() {
            window.location.href = "/";
        },
        async fetchTimes(date, businessId) {
            await httpClient.get(this.GetTimesUrl, { params: { serviceDate: date, businessId: this.formData.businessId } })
                .then((response) => {
                    this.takenTimes = response.data;
                });
        },
        async submitForm() {
            try {
                this.displaySpinnerMessage = true;
                await httpClient
                    .post(
                        this.CreateBookingUrl,
                        {
                            BusinessId: this.formData.businessId,
                            Name: this.formData.name,
                            Email: this.formData.email,
                            Phone: this.formData.phone,
                            Street: this.formData.street,
                            City: this.formData.city,
                            State: this.formData.state,
                            ZipCode: this.formData.zip,
                            Service: this.formData.service,
                            date: this.formData.date,
                            Time: this.formData.time,
                        })
                    .then(function (response) {
                        const modalElement = document.getElementById("submissionModal");
                        const submissionModal = new Modal(modalElement);
                        submissionModal.show();
                    })
                    .catch(function (error) {
                        alert("Failed to submit form. Please try again.", error);
                    });
            } catch (error) {
                alert("Failed to submit form. Please try again.", error);
            }
            // Clear the form
            this.step = 1;
            this.formattedTime = "";
            this.formData = {
                businessId: "YohanJS",
                name: "",
                email: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                service: "",
                date: "",
                time: "",
            };
            this.displaySpinnerMessage = false;
            // Handle form submission (e.g., send to an API)
            //alert(`Booking submitted: \n${JSON.stringify(this.formData, null, 2)}`);
        }
    },
    setup() {
        const isMobile = ref(false);

        onMounted(() => {
            isMobile.value = window.innerWidth <= 768;

            window.addEventListener('resize', updateIsMobile);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', updateIsMobile);
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
        <div class="row d-flex justify-content-around mt-3 pt-3">
            <div class="col-12 col-md-3 p-2 rounded-2">
                <h4 class="mb-2 fw-bold text-center">MD Tank Wolf</h4>
                <div v-if="!isMobile" class="shadow-sm p-3 rounded-2">
                    <p :class="['mb-3', { 'fill-bg': step === 1 }]" @click="goToStep(1)" style="cursor: pointer ;">
                        <i class="bi bi-node-plus"></i> Select Service
                    </p>
                    <p v-if="formData.service !== ''" :class="['mb-3', { 'fill-bg': step === 2 }]" @click="goToStep(2)"
                        style="cursor: pointer ;">
                        <i class="bi bi-clock"></i> Date and Time
                    </p>
                    <p v-if="formData.service !== ''" :class="['mb-3', { 'fill-bg': step === 3 }]" @click="goToStep(3)"
                        style="cursor: pointer ;">
                        <i class="bi bi-person-rolodex"></i> Contact Info
                    </p>
                </div>

                <!--Booking Details-->
                <div v-if="formData.service !== ''" class="rounded shadow-sm p-3 mt-4 rouneded-2 form-style">
                    <i class="bi bi-info-circle fs-6"> Your Appointment Details:</i>
                    <div class="mb-2 mt-3" style="font-size: 0.85rem;">
                        <p class="mb-1"><strong>Service:</strong> {{ formData.service }}</p>
                        <p v-if="formattedDate !== ''" class="mb-1"><strong>Date:</strong> {{ formattedDate }}</p>
                        <p v-if="formattedTime !== ''" class="mb-1"><strong>Time:</strong> {{ formattedTime }} </p>
                        <p v-else class="text-danger">Select time</p>
                        <div :class="{ 'p-2 celadon-bg rounded-2': formData.name }">
                            <p v-if="formData.name !== ''" class="fs-6 mt-1 mb-2">Your Info</p>
                            <p v-if="formData.name !== ''" class="mb-1"><strong>Name: </strong>{{ formData.name }}</p>
                            <p v-if="formData.email !== ''" class="mb-1 text-break"><strong>Email: </strong>{{
                                formData.email }}</p>
                            <p v-if="formData.phone !== ''" class="mb-1"><strong>Phone: </strong>{{ formData.phone }}
                            </p>
                            <p v-if="formData.street !== ''" class="mb-1"><strong>Street: </strong>{{ formData.street }}
                            </p>
                            <p v-if="formData.city !== ''" class="mb-1"><strong>City: </strong>{{ formData.city }}</p>
                            <p v-if="formData.state !== ''" class="mb-1"><strong>State: </strong>{{ formData.state }}
                            </p>
                            <p v-if="formData.zip !== ''" class="mb-1"><strong>Zip Code: </strong>{{ formData.zip }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <form @submit.prevent="submitForm" class="col-12 col-md-8 rounded-2 p-2">
                <!--Select Service Section-->
                <div v-if="step === 1">
                    <div class="row d-flex justify-content-center align-items-center m-0">
                        <div v-if="isMobile" class="col-12 text-center mb-3">
                            <h4 class="mt-2 fs-6">
                                <i class="bi bi-node-plus"></i> Select service
                            </h4>
                        </div>
                        <div class="col-6 col-md-4 col-lg-3 d-flex justify-content-center p-1" v-for="service in services" :key="service.id">
                            <div class="custom-card mt-4" @click="selectService(service)">
                                <div class="card-header">
                                    <img :src="service.imageUrl" class="card-img" alt="Service Image">
                                </div>
                                <div class="card-body">
                                    <h6 class="card-title mb-2">{{ service.name }}</h6>
                                    <p class="card-text text-start small">
                                        {{ service.description }}
                                    </p>
                                </div>
                                <div class="card-footer d-flex justify-content-end">
                                    <span class="mb-2">
                                        Next
                                        <i class="bi bi-arrow-right-circle text-dark" title="Select"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--Date Time Picker Section-->
                <div v-if="step === 2">
                    <div class="col-12 text-center mb-4">
                        <h4 v-if="isMobile" class="mt-2 mb-5 fs-6">
                            <i class="bi bi-clock"></i>
                            Select date and time
                        </h4>
                    </div>
                    <div class="container">
                        <div class="row d-flex justify-content-center shadow-sm rounded-2 p-0">
                            <div class="col-12 col-lg-6 align-self-center p-0">
                                <div class="row p-0 m-0">
                                    <div class="col-12 d-flex justify-content-evenly p-0">
                                        <i @click="prevMonth" class="bi bi-arrow-left-circle fs-3 arrow-btn"></i>
                                        <h5 class="m-0 fw-bold">{{ monthNames[currentMonth] }} {{ currentYear }}</h5>
                                        <i @click="nextMonth" class="bi bi-arrow-right-circle fs-3 arrow-btn"></i>
                                    </div>
                                </div>
                                <!--Date-->
                                <div class="datepicker-container m-2 mx-auto border">
                                    <div class="calendar pt-3 pb-3 p-0 rounded-2">
                                        <div class="calendar-body p-0 p-md-3 rounded-3">
                                            <div class="calendar-weekdays mb-3">
                                                <span v-for="day in weekdays" :key="day" class="weekday">{{ day
                                                }}</span>
                                            </div>
                                            <div class="calendar-dates">
                                                <span v-for="(date, index) in getDates()" :key="index"
                                                    :class="['date', { 'current-date': isToday(date), 'selected-date': isSelectedDate(date) }]"
                                                    @click="selectDate(date)">
                                                    {{ date.getDate() }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--this is used to scroll into the time picker view-->
                            <span v-if="isMobile" id="timePicker"></span>
                            <div class="col-12 col-lg-6 align-self-center">
                                <!--Time-->
                                <div class="timepicker-container pt-3 pb-3 mt-5 mb-5 mx-auto">
                                    <div class="time-grid rounded-2">
                                        <div v-for="(time, index) in timeSlots" :key="index" :class="['time-box shadow-sm', {
                                        'taken': getTimeCount(time) > 0,
                                        'selected': selectedTime === time
                                    }]" @click="getTimeCount(time) <= 3 && selectTime(time)">
                                            {{ time }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 text-end mt-3 mb-3">
                        <button @click="goToStep(1)" class="btn btn-sm flow-btn">Back</button>
                    </div>
                </div>
                <!--Contact Info Section-->
                <div v-if="step === 3">
                    <div v-if="isMobile" class="col-12 text-center mb-3 fs-6">
                        <h4 class="mt-2 mb-1 fs-6">
                            <i class="bi-person-rolodex"></i> Enter contact info
                        </h4>
                    </div>
                    <div class="p-3 mt-5 rounded-2 form-style">
                        <div>
                            <div class="row p-0 mb-3">
                                <div class="col-12 col-lg-6">
                                    <div class="mb-2">
                                        <label for="name" class="form-label">Name</label>
                                        <input type="text" id="name" class="form-control" v-model="formData.name"
                                            placeholder="" required />
                                    </div>
                                </div>
                                <div class="col-12 col-lg-6">
                                    <div class="mb-2">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" id="email" class="form-control" v-model="formData.email"
                                            placeholder="" required />
                                    </div>
                                </div>
                            </div>
                            <div class="row p-0 mb-3">
                                <div class="col-12 col-lg-6">
                                    <div class="mb-2">
                                        <label for="phone" class="form-label">Phone Number</label>
                                        <input type="tel" id="phone" class="form-control" v-model="formData.phone"
                                            placeholder="" required />
                                    </div>
                                </div>
                                <div class="col-12 col-lg-6">
                                    <div class="mb-2">
                                        <label for="street" class="form-label">Street Address</label>
                                        <input type="text" id="street" class="form-control" v-model="formData.street"
                                            placeholder="" required />
                                    </div>
                                </div>
                            </div>
                            <div class="row p-0 mb-3">
                                <div class="col">
                                    <label for="city" class="form-label">City</label>
                                    <input type="text" id="city" class="form-control" v-model="formData.city"
                                        placeholder="" required />
                                </div>
                                <div class="col">
                                    <label for="state" class="form-label">State</label>
                                    <input type="text" id="state" class="form-control" v-model="formData.state"
                                        placeholder="" required />
                                </div>
                                <div class="col">
                                    <label for="zip" class="form-label">ZIP Code</label>
                                    <input type="text" id="zip" class="form-control" v-model="formData.zip"
                                        placeholder="" required />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4 m-0">
                        <div class="col-6 mt-3 mb-3">
                            <button @click="goToStep(2)" class="btn btn-sm flow-btn rounded-3 shadow-sm">Back</button>
                        </div>
                        <div class="col-6 mt-3 mb-3">
                            <!--Buttons Section-->
                            <div class="d-flex justify-content-end">
                                <div v-if="displaySpinnerMessage">
                                    <button class="btn btn-outline-dark border-0" type="button" disabled>
                                        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                    </button>
                                </div>
                                <div v-else>
                                    <button type="submit" class="rounded-3 btn submit-btn">
                                        Submit
                                        <i class="bi bi-send-check-fill"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
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
                                <p>
                                    Your appointment has been successfully scheduled.
                                    We’ll be in touch soon! Please check your email for confirmation, and
                                    <span class="text-danger fw-bold">
                                        don't forget to check your spam or junk folder if you don't see it in your
                                        inbox.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!--<div v-if="errorMessage != ''" class="alert alert-danger mt-2" role="alert">
        {{ errorMessage }}
      </div>-->
            </div>
        </div>
    </div>
</template>

<style scoped>
.celadon-bg {
    background-color: #e9e9e9;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
/* Background fill animation */
.fill-bg {
    border-radius: 5px;
    background: linear-gradient(135deg, #007FFF, #ffffff);
    background-size: 0% 100%;
    background-repeat: no-repeat;
    padding: 10px;
    animation: fillEffect 1s ease-in-out forwards;
    color: #fff;
}
@keyframes fillEffect {
    from {
        background-size: 0% 100%;
    }

    to {
        background-size: 100% 100%;
    }
}
.custom-card {
    cursor: pointer;
    width: 300px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #efeff0;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
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
  height: 100px;
  object-fit: cover;
}
.card-body {
  height: 150px;
  margin-top: 10px;
  padding: 5px;
}
.card-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #000;
}
.card-text {
  font-size: 0.8rem;
  color: #666;
  height: 120px;
}
.card-footer {
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
  padding: 0px 5px;
}
.action-icon {
    font-size: 1.2rem;
    color: #666;
    cursor: pointer;
    transition: color 0.2s ease;
}
.action-icon:hover {
    color: #007bff;
}
.datepicker-container {
    max-width: 380px;
    padding: 10px;
    border-radius: 15px !important;
    margin: 0 auto;
}
.calendar {
    color: #000;
    font-size: 0.9rem;
}
.calendar-weekdays {
    color: #919191;
    font-size: 1rem;
    font-weight: bold;
}
.calendar-weekdays,
.calendar-dates {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    gap: 10px;
}
.date {
    cursor: pointer;
    padding: 5px;
    border-radius: 10%;
    transition: background-color 0.3s ease;
}
.date:hover {
    background-color: #007bff;
}
.current-date {
    background-color: #acacac;
    color: #fff;
}
.selected-date {
    background-color: #FF5F15;
    color: #ffffff;
}
.arrow-btn {
    cursor: pointer;
    color: #007bff;
}
.flow-btn {
    background: linear-gradient(135deg, #007FFF, #4e44bc);
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 0.9rem;
    color: #fff;
}
/*TIME PICKER CSS*/
.timepicker-container {
    max-width: 380px;
    padding: 10px;
    border-radius: 15px !important;
}
.time-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 3 boxes per row */
    gap: 5px;
}
.time-box {
    font-size: 0.8rem;
    text-align: center;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.time-box.taken {
    background-color: #E31837;
    cursor: not-allowed;
    color: #ffffff;
    text-decoration: line-through;
}
.time-box.selected {
    background-color: #FF5F15;
    color: #ffffff;
}
.submit-btn {
    background: linear-gradient(135deg, #007FFF, #4e44bc);
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 0.9rem;
    color: #fff;
}
.submit-btn:hover {
    color: #1a1919;
    background-color: #d9d9d9;
}
</style>
