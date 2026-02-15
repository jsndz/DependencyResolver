 const API_BASE_URL = 'http://localhost:3000/api';


import axios from "axios";


export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});