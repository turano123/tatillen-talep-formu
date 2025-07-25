// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tatillen-backend-fixed.onrender.com/api', // ← senin backend URL’in bu olmalı
});

export default api;
