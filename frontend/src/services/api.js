import axios from "axios";

const API = axios.create({
  baseURL: "https://student-project-management-9gjm.onrender.com",
});

export default API;
