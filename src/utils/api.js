// api.js
import { getAuthHeaders } from "./auth"; // Certifique-se de importar de auth.js

export const API_URL = import.meta.env.VITE_API_URL;

export function getApiUrl() {
  return API_URL;
}

// Função para buscar pedidos
export async function buscarPedidos() {
  // Simula um pequeno atraso (ex: 800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Dados fictícios de pedidos
  return [
    {
      id: "PED-1001",
      userId: "João Silva",
      total: 49.9,
      status: "Pendente",
    },
    {
      id: "PED-1002",
      userId: "Maria Oliveira",
      total: 89.5,
      status: "Aguardando Entrega",
    },
    {
      id: "PED-1003",
      userId: "Lucas Pereira",
      total: 120.0,
      status: "Entregue",
    },
    {
      id: "PED-1004",
      userId: "Amanda Costa",
      total: 65.3,
      status: "Cancelado",
    },
    {
      id: "PED-1005",
      userId: "Felipe Souza",
      total: 33.7,
      status: "A caminho",
    },
  ];
}

export async function buscarProdutos() {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: "PROD-001",
      nome: "Hambúrguer Duplo",
      preco: 25.9,
      categoria: "lanches",
      loja: "Lanchonete Universitária",
      imagemUrl:
        "https://firebasestorage.googleapis.com/v0/b/1:52534721759:web:296e50e8ed5ffb32f33d6a.appspot.com/o/produtos%2Fhamburguer.jpg?alt=media",
    },
    {
      id: "PROD-002",
      nome: "Prato Executivo",
      preco: 32.5,
      categoria: "refeições",
      loja: "Restaurante Central",
      imagemUrl:
        "https://firebasestorage.googleapis.com/v0/b/1:52534721759:web:296e50e8ed5ffb32f33d6a.appspot.com/o/produtos%2Fprato.jpg?alt=media",
    },
    {
      id: "PROD-003",
      nome: "Bolo de Chocolate",
      preco: 12.0,
      categoria: "Doces e Sobremesas",
      loja: "Doceria Campus",
      imagemUrl:
        "https://firebasestorage.googleapis.com/v0/b/seu-projeto-id.appspot.com/o/produtos%2Fbolo.jpg?alt=media",
    },
    {
      id: "PROD-004",
      nome: "Suco Natural",
      preco: 8.5,
      categoria: "bebidas",
      loja: "Cantina Saúde",
      imagemUrl:
        "https://firebasestorage.googleapis.com/v0/b/1:52534721759:web:296e50e8ed5ffb32f33d6a.appspot.com/o/produtos%2Fsuco.jpg?alt=media",
    },
    {
      id: "PROD-005",
      nome: "Salada Fitness",
      preco: 18.0,
      categoria: "Alimentos Saudáveis",
      loja: "Veggie Point",
      imagemUrl:
        "https://firebasestorage.googleapis.com/v0/b/1:52534721759:web:296e50e8ed5ffb32f33d6aappspot.com/o/produtos%2Fsalada.jpg?alt=media",
    },
    {
      id: "PROD-006",
      nome: "Combo Lanche + Suco",
      preco: 29.9,
      categoria: "Combos e Kits",
      loja: "Food Truck Campus",
      imagemUrl:
        "https://firebasestorage.googleapis.com/v0/b/1:52534721759:web:296e50e8ed5ffb32f33d6a.appspot.com/o/produtos%2Fcombo.jpg?alt=media",
    },
  ];
}
