import axios from "axios";

var isPrd = true;

const axiosClient = axios.create({
    baseURL: isPrd ? 'https://engfuel.com' : 'https://localhost:7091',
    // Include credentials (cookies)
    withCredentials: true,
});

export default axiosClient;