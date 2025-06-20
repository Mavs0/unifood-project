import React, { useState, useRef } from "react";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import styles from "./Recompensas.module.css";

export default function Gamificacao() {
  const toast = useRef(null);
  const [recompensas, setRecompensas] = useState([
    { id: 1, descricao: "Cupom de 10% off no próximo pedido" },
    { id: 2, descricao: "Frete grátis para pedidos acima de R$30" },
  ]);

  const premiosRoleta = [
    "Cupom 10% OFF",
    "Cupom Frete Grátis",
    "Cupom R$5 OFF",
    "Nenhum prêmio 😢",
    "Cupom 15% OFF",
  ];

  const girarRoleta = () => {
    const premio =
      premiosRoleta[Math.floor(Math.random() * premiosRoleta.length)];

    toast.current.show({
      severity: premio.includes("Nenhum") ? "warn" : "success",
      summary: "Resultado da Roleta",
      detail: premio,
      life: 3000,
    });

    if (!premio.includes("Nenhum")) {
      setRecompensas((prev) => [
        ...prev,
        { id: Date.now(), descricao: premio },
      ]);
    }
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <h2 className={styles.titulo}>Sistema de Gamificação 🎮</h2>

        <section className={styles.roletaSection}>
          <h3>Gire a Roleta da Sorte!</h3>
          <Button
            label="Girar a Roleta"
            icon="pi pi-refresh"
            className={styles.botaoRoleta}
            onClick={girarRoleta}
          />
        </section>

        <section className={styles.recompensasSection}>
          <h3>Minhas Recompensas</h3>
          {recompensas.length > 0 ? (
            <ul>
              {recompensas.map((r) => (
                <li key={r.id} className={styles.recompensaItem}>
                  🎁 {r.descricao}
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não ganhou nenhuma recompensa.</p>
          )}
        </section>
      </div>
    </div>
  );
}
