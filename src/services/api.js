import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-esquadrias.onrender.com"
});

export default api;