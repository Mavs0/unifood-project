import React, { useState, useRef, useEffect } from "react";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import MemoryGame from "../games/MemoryGame/MemoryGame";
import SlotMachine from "../games/SlotMachine/SlotMachine";
import SnakeGame from "../games/SnakeGame/SnakeGame";

import styles from "./Recompensas.module.css";

export default function Recompensas() {
  const toast = useRef(null);
  const [recompensas, setRecompensas] = useState([]);
  const [girosHoje, setGirosHoje] = useState(0);
  const [jogoAberto, setJogoAberto] = useState(null);

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

  const abrirJogo = (jogo) => {
    const hoje = new Date().toDateString();
    const usos = JSON.parse(localStorage.getItem("usosJogos")) || {};
    if (usos[jogo]?.data === hoje) {
      toast.current.show({
        severity: "warn",
        summary: "Limite alcançado",
        detail: `Você já jogou ${jogo} hoje.`,
        life: 3000,
      });
      return;
    }
    setJogoAberto(jogo);
    localStorage.setItem(
      "usosJogos",
      JSON.stringify({ ...usos, [jogo]: { data: hoje } })
    );
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <NavBarraSide />
      <div className={styles.mainContent}>
        <div className={styles.topbarWrapper}>
          <NavBarraTop />
        </div>
        <h2 className={styles.titulo}>Gamificação</h2>

        <section className={styles.sectionPadrao}>
          <h3 className={styles.subtitulo}>Jogos do Dia</h3>
          <div className={styles.botoesJogos}>
            <Button
              label="Jogo da Memória"
              className="p-button-sm p-button-outlined p-button-info"
              onClick={() => abrirJogo("memoria")}
            />
            <Button
              label="Caça-níquel"
              className="p-button-sm p-button-outlined p-button-info"
              onClick={() => abrirJogo("slot")}
            />
            <Button
              label="Snake"
              className="p-button-sm p-button-outlined p-button-info"
              onClick={() => abrirJogo("snake")}
            />
          </div>
        </section>

        <section className={styles.sectionPadrao}>
          <h3 className={styles.subtitulo}>Gire a Roleta da Sorte!</h3>
          <p className={styles.textoAux}>
            Giros restantes hoje: {2 - girosHoje}
          </p>
          <div className={styles.roletaVisual}>🎯</div>
          <Button
            label="Girar a Roleta"
            icon="pi pi-refresh"
            className={styles.botaoRoleta}
            onClick={girarRoleta}
            disabled={girosHoje >= 2}
          />
        </section>

        <section className={styles.sectionPadrao}>
          <h3 className={styles.subtitulo}>Meus Cupons </h3>
          {recompensas.length > 0 ? (
            <ul className={styles.listaCupons}>
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

      <Dialog
        header="Jogo da Memória"
        visible={jogoAberto === "memoria"}
        style={{ width: "50vw" }}
        onHide={() => setJogoAberto(null)}
      >
        <MemoryGame />
      </Dialog>
      <Dialog
        header="Caça-níquel"
        visible={jogoAberto === "slot"}
        style={{ width: "50vw" }}
        onHide={() => setJogoAberto(null)}
      >
        <SlotMachine />
      </Dialog>
      <Dialog
        header="Snake"
        visible={jogoAberto === "snake"}
        style={{ width: "50vw" }}
        onHide={() => setJogoAberto(null)}
      >
        <SnakeGame />
      </Dialog>
    </div>
  );
}
