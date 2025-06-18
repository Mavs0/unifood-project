import React from "react";
import styles from "./PaginaReviewsProdutosDaLoja.module.css";
import NavBarraSide from "../../../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../../../components/layout/navBarraTop/NavBarraTop";
import { useNavigate, useParams } from "react-router-dom";

const produtosMock = [
  {
    id: "prod1",
    nome: "Chocolate",
    preco: 3,
    descricao: "Chocolate clássico",
    imagem: "/imagens/chocolate.jpg",
  },
  {
    id: "prod2",
    nome: "Chocodoim",
    preco: 9,
    descricao: "Chocolate + amendoim",
    imagem: "/imagens/chocodoim.jpg",
  },
  {
    id: "prod3",
    nome: "Nesquik",
    preco: 39,
    descricao: "Nesquik ou bicho de pé",
    imagem: "/imagens/nesquik.jpg",
  },
];

export default function PaginaReviewsProdutosDaLoja() {
  const navigate = useNavigate();
  const { lojaId } = useParams();

  return (
    <div className={styles.container}>
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <h2>Produtos da Loja</h2>

        <div className={styles.produtosGrid}>
          {produtosMock.map((produto) => (
            <div
              key={produto.id}
              className={styles.card}
              onClick={() => navigate(`/reviews/${lojaId}/geral`)}
            >
              <img src={produto.imagem} alt={produto.nome} />
              <div>
                <h4>{produto.nome}</h4>
                <p>R${produto.preco}</p>
                <small>{produto.descricao}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
