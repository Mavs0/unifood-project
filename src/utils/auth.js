export function getAuthHeaders() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
