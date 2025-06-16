import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:5001/unifood-aaa0f/us-central1/api";

export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Erro na requisição");
  }

  return response.json();
};
