import axios from 'axios';

const service = axios.create({
    baseURL: 'http://localhost:8101',
    withCredentials: true,
    timeout: 5000,
});

export default service;
