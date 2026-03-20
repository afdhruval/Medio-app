import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,          
  headers: { "Content-Type": "application/json" },
});

// On 401 → clear user state and go to register
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("instaa_user");
      window.location.href = "/register";
    }
    return Promise.reject(err);
  }
);

export default api;
