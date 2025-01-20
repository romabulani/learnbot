import axios from "axios";
import { API_URL } from "../constants";

const axiosInstance = axios.create({
  baseURL: API_URL, // Replace with your FastAPI server URL
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default axiosInstance;
