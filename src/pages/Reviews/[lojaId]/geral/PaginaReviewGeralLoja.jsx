import React, { useState } from "react";
import styles from "./PaginaReviewGeralLoja.module.css";
import NavBarraSide from "../../../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../../../components/layout/navBarraTop/NavBarraTop";
import { ProgressBar } from "primereact/progressbar";

const comentariosMock = [
  {
    usuario: "Raquel",
    nota: 3,
    texto: "Tava um pouco doce demais o de amendoim :(",
    tempo: "há 1 hora",
  },
  {
    usuario: "Manu",
    nota: 5,
    texto: "Tava perfeito mana",
    tempo: "há 2 horas",
  },
];

const tagsFeedback = [
  "Boa aparência (140)",
  "Comida Saborosa (258)",
  "Temperatura certa (106)",
  "Boa embalagem (130)",
  "Boa quantidade (147)",
  "Bem temperada (165)",
  "Embalagem sustentável (73)",
  "No ponto certo (112)",
  "Bons ingredientes (111)",
];

const estrelasDistribuicao = {
  5: 300,
  4: 50,
  3: 30,
  2: 15,
  1: 12,
};

export default function PaginaReviewGeralLoja() {
  const [tagSelecionada, setTagSelecionada] = useState(null);

  const comentariosFiltrados = tagSelecionada
    ? comentariosMock.filter((c) =>
        c.texto.toLowerCase().includes(tagSelecionada.toLowerCase())
      )
    : comentariosMock;

  return (
    <div className={styles.container}>
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <h2>Brigadeiro da Raquel ⭐ 5.0</h2>

        <div className={styles.grid}>
          {/* Coluna da Avaliação */}
          <div className={styles.colunaAvaliacao}>
            <div className={styles.notaGeral}>
              <h1>
                4.8 <span className={styles.estrela}>⭐</span>
              </h1>
              <p>407 avaliações</p>
            </div>

            <div className={styles.estrelasDistribuicao}>
              {Object.keys(estrelasDistribuicao)
                .sort((a, b) => b - a)
                .map((estrela) => (
                  <div key={estrela} className={styles.barraEstrela}>
                    <span>{estrela}⭐</span>
                    <ProgressBar
                      value={(estrelasDistribuicao[estrela] / 407) * 100}
                    />
                  </div>
                ))}
            </div>

            <div className={styles.tags}>
              {tagsFeedback.map((tag, idx) => (
                <span
                  key={idx}
                  className={`${styles.tag} ${
                    tagSelecionada === tag ? styles.tagAtiva : ""
                  }`}
                  onClick={() =>
                    setTagSelecionada(tagSelecionada === tag ? null : tag)
                  }
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Coluna de Comentários */}
          <div className={styles.colunaComentarios}>
            <h3>Comentários</h3>
            {comentariosFiltrados.map((c, idx) => (
              <div key={idx} className={styles.comentario}>
                <div className={styles.topoComentario}>
                  <strong>{c.usuario}</strong>
                  <span className={styles.notaComentario}>⭐ {c.nota}</span>
                  <small>{c.tempo}</small>
                </div>
                <p>{c.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
