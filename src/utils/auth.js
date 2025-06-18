export function getAuthHeaders() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado. Faça login novamente.");
    // Lidar com o caso onde não há token
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
