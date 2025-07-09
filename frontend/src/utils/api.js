import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleApiError = (error) => {
  const errorMessage =
    error.response?.data?.message || error.message || "Errore sconosciuto";
  const statusCode = error.response?.status;

  console.error(`API Error ${statusCode || ""}:`, errorMessage);
  throw new Error(errorMessage);
};

// Auth APIs
export const registerApi = async (username, password) => {
  try {
    const response = await api.post("/auth/register", { username, password });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const loginApi = async (username, password) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getUserProfileApi = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Two-Factor Authentication APIs
export const setupTwoFactorApi = async () => {
  try {
    const response = await api.post("/auth/setup-2fa");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const enableTwoFactorApi = async (token) => {
  try {
    const response = await api.post("/auth/enable-2fa", { token });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const disableTwoFactorApi = async (token) => {
  try {
    const response = await api.post("/auth/disable-2fa", { token });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyTwoFactorApi = async (token, tempToken = null) => {
  try {
    const config = tempToken
      ? { headers: { Authorization: `Bearer ${tempToken}` } }
      : {};
    const response = await api.post("/auth/verify-2fa", { token }, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Product APIs
export const getProductsApi = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getProductByIdApi = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createProductApi = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Dettagli errore creazione prodotto:', {
      payload: productData,
      error: error.response?.data
    });
    handleApiError(error);
  }
};

export const updateProductApi = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const toggleProductAvailabilityApi = async (id) => {
  try {
    const response = await api.patch(`/products/${id}/toggle-availability`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// User APIs (Admin only)
export const getUsersApi = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getUserByIdApi = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createUserApi = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateUserApi = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const toggleUserStatusApi = async (id) => {
  try {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export default api;
