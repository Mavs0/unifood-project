const API_URL = "http://127.0.0.1:5001/unifood-aaa0f/us-central1/api";

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Falha no login.");
  }

  const data = await response.json();
  localStorage.setItem("token", data.access_token);
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};
