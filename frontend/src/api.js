import axios from "axios";

// Create an instance of axios with the backend base URL
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Add a request interceptor to attach the token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers["x-auth-token"] = token; // Add token to headers if it exists
  }
  return req;
});

export default API;
