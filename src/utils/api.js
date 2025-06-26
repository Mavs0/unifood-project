import { getAuthHeaders, saveTokens, clearTokens } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

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

// ============================== //
//           AUTH                //
// ============================== //
export async function loginUsuario(email, password) {
  const res = await apiPost("/auth/login", { email, password });
  return res.json();
}

export async function logoutUsuario() {
  await apiPost("/auth/logout", {});
}

// ============================== //
//          USERS                //
// ============================== //
export async function registrarUsuario(dados) {
  const res = await apiPost("/users/register", dados);
  return res.json();
}

export async function registrarVendedor(dados) {
  const res = await apiPost("/users/register", {
    ...dados,
    role: "vendedor",
  });
  return res.json();
}

export async function buscarPerfil() {
  const res = await apiGet("/users/profile");
  return res.json();
}

// ============================== //
//          PRODUCT              //
// ============================== //
export async function buscarProdutos() {
  const res = await apiGet("/product");
  return res.json();
}

export async function buscarProdutoPorId(id) {
  const res = await apiGet(`/product/${id}`);
  return res.json();
}

export async function criarProduto(dados) {
  const res = await apiPost("/product", dados);
  return res.json();
}

export async function atualizarProduto(id, dados) {
  const res = await apiPatch(`/product/${id}`, dados);
  return res.json();
}

export async function deletarProduto(id) {
  return apiDelete(`/product/${id}`);
}

export async function atualizarEstoqueProduto(id, quantidade) {
  const res = await apiPatch(`/product/${id}/quantity`, { quantidade });
  return res.json();
}

// ============================== //
//          ORDERS               //
// ============================== //
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

export async function atualizarPedido(id, dados) {
  const res = await apiPatch(`/order/${id}`, dados);
  return res.json();
}

export async function cancelarPedido(id) {
  const res = await apiPatch(`/order/${id}/cancel`, {});
  return res.json();
}

export async function buscarHistoricoPedidos() {
  const res = await apiGet("/order/history");
  return res.json();
}

export async function buscarDetalhesPedidoUsuario(id) {
  const res = await apiGet(`/order/${id}/details`);
  return res.json();
}

// ============================== //
//          RATING               //
// ============================== //
export async function criarAvaliacao(dados) {
  const res = await apiPost("/rating", dados);
  return res.json();
}

export async function listarAvaliacoesProduto(productId) {
  const res = await apiGet(`/rating/product/${productId}`);
  return res.json();
}

export async function listarAvaliacoesVendedor(sellerId) {
  const res = await apiGet(`/rating/seller/${sellerId}`);
  return res.json();
}
