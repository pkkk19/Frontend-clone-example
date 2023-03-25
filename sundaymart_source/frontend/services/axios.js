import axios from "axios";

const axiosService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 16000,
  headers: {
    "X-Custom-Header": "lEWGIQU",
    Accept: "application/json; charset=utf-8",
  },
});

axiosService.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error.response.data);
  }
);

// Add a response interceptor
axiosService.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response?.data);
  }
);

export default axiosService;
