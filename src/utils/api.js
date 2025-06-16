export const API_URL = import.meta.env.VITE_API_URL;

export function getApiUrl() {
  return API_URL;
}

export function getAuthHeaders() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
