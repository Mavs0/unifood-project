import { getAuthHeaders, saveTokens, clearTokens } from "./auth"; // Certifique-se de importar de auth.js

const API_URL = import.meta.env.VITE_API_URL;

// Core Fetch com Refresh Token
export async function apiFetch(endpoint, options = {}, retry = true) {
  const url = `${API_URL}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 && retry) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return apiFetch(endpoint, options, false);
      } else {
        clearTokens();
        throw new Error("Sessão expirada. Faça login novamente.");
      }
    }

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(
        errorJson.message || errorJson.error || "Erro na requisição"
      );
    }

    return res;
  } catch (error) {
    console.error(`Erro API: ${error.message}`);
    throw error;
  }
}

// Helpers simples
export async function apiGet(endpoint, extraOptions = {}) {
  return apiFetch(endpoint, { method: "GET", ...extraOptions });
}

export async function apiPost(endpoint, body, extraOptions = {}) {
  return apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    ...extraOptions,
  });
}

/* ===============================
    API - Usuários - Vendedor
=============================== */
export async function registrarVendedor(dados) {
  const res = await apiPost("/users/register", {
    ...dados,
    role: "vendedor", // força o role para vendedor
  });
  return res.json();
}

export async function apiPatch(endpoint, body, extraOptions = {}) {
  return apiFetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
    ...extraOptions,
  });
}

export async function apiDelete(endpoint, extraOptions = {}) {
  return apiFetch(endpoint, {
    method: "DELETE",
    ...extraOptions,
  });
}

// Auto Refresh
async function tryRefreshToken() {
  const refreshToken =
    localStorage.getItem("refreshToken") ||
    sessionStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh-auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const json = await res.json();
    saveTokens(json.accessToken, json.refreshToken);
    return true;
  } catch (error) {
    console.error("Erro ao fazer refresh token:", error);
    return false;
  }
}

/* ===============================
    API - Produtos
=============================== */

// Buscar todos os produtos
export async function buscarProdutos() {
  const res = await apiGet("/product");
  return res.json();
}

// Buscar produto por ID
export async function buscarProdutoPorId(id) {
  const res = await apiGet(`/product/${id}`);
  return res.json();
}

// Criar novo produto
export async function criarProduto(dados) {
  const res = await apiPost("/product", dados);
  return res.json();
}

// Atualizar produto
export async function atualizarProduto(id, dados) {
  const res = await apiPatch(`/product/${id}`, dados);
  return res.json();
}

// Deletar produto
export async function deletarProduto(id) {
  return apiDelete(`/product/${id}`);
}

/* ===============================
    API - Pedidos
=============================== */

export async function buscarPedidos() {
  const res = await apiGet("/order");
  return res.json();
}

export async function buscarPedidoPorId(id) {
  const res = await apiGet(`/order/${id}`);
  return res.json();
}

export async function finalizarPedido(dados) {
  const res = await apiPost("/order/finalize", dados);
  return res.json();
}

export async function cancelarPedido(id) {
  const res = await apiPatch(`/order/${id}/cancel`, {});
  return res.json();
}

/* ===============================
    API - Auth
=============================== */

export async function loginUsuario(email, password) {
  const res = await apiPost("/auth/login", { email, password });
  return res.json();
}

export async function logoutUsuario() {
  await apiPost("/auth/logout", {});
}

/* ===============================
    API - Usuários
=============================== */

export async function registrarUsuario(dados) {
  const res = await apiPost("/users/register", dados);
  return res.json();
}

export async function buscarPerfil() {
  const res = await apiGet("/users/profile");
  return res.json();
}
