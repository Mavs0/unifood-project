import React, { useState } from "react";
import styles from "./PaginaReviewGeralLoja.module.css";
import NavBarraSide from "../../../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../../../components/layout/navBarraTop/NavBarraTop";
import LojaTabs from "../../components/LojaTabs";
import { ProgressBar } from "primereact/progressbar";
import { InputText } from "primereact/inputtext";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";

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

const estrelasDistribuicao = { 5: 300, 4: 50, 3: 30, 2: 15, 1: 12 };

export default function PaginaReviewGeralLoja() {
  const [tagSelecionada, setTagSelecionada] = useState(null);
  const [comentarios, setComentarios] = useState(comentariosMock);
  const [novoComentario, setNovoComentario] = useState("");
  const [novaNota, setNovaNota] = useState(null);

  const comentariosFiltrados = tagSelecionada
    ? comentarios.filter((c) =>
        c.texto.toLowerCase().includes(tagSelecionada.toLowerCase())
      )
    : comentarios;

  const adicionarComentario = () => {
    if (!novaNota || novoComentario.trim() === "") return;

    const novo = {
      usuario: "Você",
      nota: novaNota,
      texto: novoComentario,
      tempo: "agora",
    };

    setComentarios([novo, ...comentarios]);
    setNovoComentario("");
    setNovaNota(null);
  };

  return (
    <div className={styles.container}>
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <LojaTabs />

        <div className={styles.grid}>
          <div className={styles.colunaAvaliacao}>
            <div className={styles.notaGeral}>
              <h1>
                4.8 <span className={styles.estrela}>⭐</span>
              </h1>
              <p>{comentarios.length} avaliações</p>
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

          <div className={styles.colunaComentarios}>
            <h3>Comentários</h3>

            {/* NOVO CAMPO PARA ADICIONAR COMENTÁRIO */}
            <div className={styles.comentario}>
              <div className={styles.topoComentario}>
                <strong>Você</strong>
                <Rating
                  value={novaNota}
                  onChange={(e) => setNovaNota(e.value)}
                  stars={5}
                  cancel={false}
                />
              </div>
              <InputText
                placeholder="Escreva seu comentário..."
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                className={styles.inputNovoComentario}
              />
              <Button
                label="Enviar"
                onClick={adicionarComentario}
                className="p-button-sm p-button-success"
                style={{ marginTop: "8px" }}
              />
            </div>

            {/* LISTAGEM */}
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
