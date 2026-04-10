import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mediquick-backend-yn5w.onrender.com'
});

export default api;