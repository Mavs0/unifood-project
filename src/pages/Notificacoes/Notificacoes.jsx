import React from "react";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import styles from "./Notificacoes.module.css";

const notificacoesMock = [
  {
    id: 1,
    titulo: "Pedido enviado!",
    mensagem: "Seu pedido #12345 foi enviado para entrega.",
    hora: "há 2h",
    nova: true,
  },
  {
    id: 2,
    titulo: "Pagamento confirmado",
    mensagem: "Recebemos o pagamento do pedido #12345.",
    hora: "há 5h",
    nova: false,
  },
  {
    id: 3,
    titulo: "Nova mensagem do vendedor",
    mensagem: "O vendedor respondeu à sua dúvida.",
    hora: "ontem",
    nova: true,
  },
];

export default function Notificacoes() {
  return (
    <div className={styles.container}>
      <NavBarraSide />
      <div className={styles.content}>
        <NavBarraTop />
        <h1 className={styles.title}>Notificações</h1>

        <div className={styles.lista}>
          {notificacoesMock.map((n) => (
            <div
              key={n.id}
              className={`${styles.card} ${n.nova ? styles.nova : ""}`}
            >
              <div className={styles.header}>
                <span className={styles.icon}>🔔</span>
                <span className={styles.titulo}>{n.titulo}</span>
                {n.nova && <span className={styles.badge}>Novo</span>}
              </div>
              <p className={styles.mensagem}>{n.mensagem}</p>
              <span className={styles.hora}>{n.hora}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
