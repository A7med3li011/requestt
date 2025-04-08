import axios from "axios";

const ApiUrl = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: ApiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error.response exists, otherwise return a default error message
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request was made, but no response was received
      return Promise.reject({
        message: "No response received from the server",
      });
    } else {
      // Something happened in setting up the request
      return Promise.reject({
        message: error.message || "An unknown error occurred",
      });
    }
  }
);

export default axiosInstance;
