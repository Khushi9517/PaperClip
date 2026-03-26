import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);

// NOTES
export const getNotes = () => API.get('/notes');
export const getNoteById = (id) => API.get(`/notes/${id}`);
export const searchNotes = (query) => API.get(`/notes/search?query=${query}`);
export const createNote = (data) => API.post('/notes', data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);

// TASKS
export const getTasks = (params) => API.get('/tasks', { params });
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const toggleTask = (id) => API.patch(`/tasks/${id}/toggle`);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// CALENDAR
export const getEvents = (params) => API.get('/calendar', { params });
export const createEvent = (data) => API.post('/calendar', data);
export const updateEvent = (id, data) => API.put(`/calendar/${id}`, data);
export const deleteEvent = (id) => API.delete(`/calendar/${id}`);