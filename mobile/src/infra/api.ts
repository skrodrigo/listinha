import axios from 'axios';

const API_BASE_URL = 'https://sacolafacil.vercel.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
