// src/services/taskService.js
// All API calls go through here — one place to change the base URL or add auth headers

import axios from 'axios';

const API_BASE = '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Intercept errors globally — components get clean error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

const taskService = {
  getAll: () => api.get('/tasks').then((r) => r.data),
  getById: (id) => api.get(`/tasks/${id}`).then((r) => r.data),
  create: (task) => api.post('/tasks', task).then((r) => r.data),
  update: (id, task) => api.put(`/tasks/${id}`, task).then((r) => r.data),
  delete: (id) => api.delete(`/tasks/${id}`),
  health: () => api.get('/health').then((r) => r.data),
};

export default taskService;
