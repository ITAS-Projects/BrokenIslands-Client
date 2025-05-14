// axiosAuth.js
import axios from 'axios';
import { getSessionToken } from '@descope/react-sdk';

const axiosAuth = axios.create();

axiosAuth.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAuth;
