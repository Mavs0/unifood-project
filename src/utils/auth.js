export function getAuthToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function getAuthHeaders() {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
