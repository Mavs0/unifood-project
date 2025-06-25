import React, { useState, useRef, useEffect } from "react";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import styles from "./Recompensas.module.css";

export default function Recompensas() {
  const toast = useRef(null);
  const [recompensas, setRecompensas] = useState([]);
  const [girosHoje, setGirosHoje] = useState(0);

  const premiosRoleta = [
    { descricao: "10% de desconto", tipo: "percentual", valor: 10 },
    { descricao: "Frete grátis (R$5 OFF)", tipo: "fixo", valor: 5 },
    { descricao: "R$5,00 de desconto", tipo: "fixo", valor: 5 },
    { descricao: "15% de desconto", tipo: "percentual", valor: 15 },
    { descricao: "Nenhum prêmio 😢", tipo: null, valor: 0 },
  ];

  useEffect(() => {
    const hoje = new Date().toDateString();
    const girosSalvos = JSON.parse(localStorage.getItem("girosRoleta")) || {};

    if (girosSalvos.data === hoje) {
      setGirosHoje(girosSalvos.contagem);
    } else {
      localStorage.setItem(
        "girosRoleta",
        JSON.stringify({ data: hoje, contagem: 0 })
      );
    }

    const cuponsSalvos =
      JSON.parse(localStorage.getItem("cuponsUsuario")) || [];
    setRecompensas(cuponsSalvos);
  }, []);

  const girarRoleta = () => {
    if (girosHoje >= 2) {
      toast.current.show({
        severity: "warn",
        summary: "Limite diário",
        detail: "Você já girou 2x hoje. Volte amanhã!",
        life: 3000,
      });
      return;
    }

    const premio =
      premiosRoleta[Math.floor(Math.random() * premiosRoleta.length)];

    toast.current.show({
      severity: premio.tipo ? "success" : "info",
      summary: "Resultado da Roleta",
      detail: premio.descricao,
      life: 3000,
    });

    if (premio.tipo) {
      const novoCupom = {
        id: Date.now(),
        descricao: premio.descricao,
        tipo: premio.tipo,
        valor: premio.valor,
      };

      const novosCupons = [...recompensas, novoCupom];
      setRecompensas(novosCupons);
      localStorage.setItem("cuponsUsuario", JSON.stringify(novosCupons));
    }

    const hoje = new Date().toDateString();
    const novaContagem = girosHoje + 1;
    setGirosHoje(novaContagem);
    localStorage.setItem(
      "girosRoleta",
      JSON.stringify({ data: hoje, contagem: novaContagem })
    );
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <h2 className={styles.titulo}>Gamificação 🎮</h2>

        <section className={styles.roletaSection}>
          <h3>Gire a Roleta da Sorte!</h3>
          <p>Giros restantes hoje: {2 - girosHoje}</p>
          <Button
            label="Girar a Roleta"
            icon="pi pi-refresh"
            className={styles.botaoRoleta}
            onClick={girarRoleta}
            disabled={girosHoje >= 2}
          />
        </section>

        <section className={styles.recompensasSection}>
          <h3>Meus Cupons 🎁</h3>
          {recompensas.length > 0 ? (
            <ul>
              {recompensas.map((r) => (
                <li key={r.id} className={styles.recompensaItem}>
                  🎁 {r.descricao}
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não possui cupons.</p>
          )}
        </section>
      </div>
    </div>
  );
}
