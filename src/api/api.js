import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tpuniv.onrender.com/', 
});

export default api;