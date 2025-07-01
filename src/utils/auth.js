// auth.js

// Pega o token salvo
export function getAuthHeaders() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

// Salva novos tokens
export function saveTokens(accessToken, refreshToken) {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

// Limpa tokens (logout forçado)
export function clearTokens() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

// NOVO: Retorna o role do usuário decodificando o JWT
export function getUserRole() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    return decodedPayload.role || null;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}

export function saveUser(user) {
  localStorage.setItem("usuario", JSON.stringify(user));
}
