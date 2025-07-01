import React from "react";
import styles from "./ErroGenerico.module.css";

export default function ErroGenerico({
  codigo = "404",
  titulo = "Algo deu errado",
  descricao = "Não foi possível encontrar a informação solicitada.",
  imagem,
  onReload,
}) {
  return (
    <div className={styles.container}>
      {imagem && (
        <img
          src={imagem}
          alt={`Erro ${codigo}`}
          className={styles.ilustracao}
        />
      )}
      <h1 className={styles.codigo}>{codigo}</h1>
      <h2 className={styles.titulo}>{titulo}</h2>
      <p className={styles.descricao}>{descricao}</p>
      <button className={styles.botao} onClick={onReload}>
        Recarregar página
      </button>
    </div>
  );
}
