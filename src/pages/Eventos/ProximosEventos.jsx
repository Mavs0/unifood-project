import { useState } from "react";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import styles from "./ProximosEventos.module.css";
import { GiftIcon } from "@heroicons/react/outline";

export default function ProximosEventos() {
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroMes, setFiltroMes] = useState("");

  const eventos = [
    {
      id: 1,
      titulo: "Feira de Comidas Artesanais",
      data: "2025-06-20",
      local: "Praça Central - UF",
      descricao:
        "Uma feira com pratos típicos e produtos artesanais feitos por estudantes.",
      principal: true,
    },
    {
      id: 2,
      titulo: "Dia do Brownie",
      data: "2025-07-05",
      local: "Cantina Bloco C",
      descricao: "Promoções especiais para quem ama brownie.",
      principal: false,
    },
    {
      id: 3,
      titulo: "Festival de Tapiocas",
      data: "2025-08-12",
      local: "Área de convivência",
      descricao: "Sabores variados, música ao vivo e sorteios!",
      principal: true,
    },
    {
      id: 4,
      titulo: "Semana do Aluno Empreendedor",
      data: "2025-09-10",
      local: "Auditório Central",
      descricao: "Palestras e exposições de projetos estudantis.",
      principal: true,
    },
    {
      id: 5,
      titulo: "Quarta do Pastel",
      data: "2025-06-26",
      local: "Bloco A - Pátio externo",
      descricao: "Pastel a R$3 durante o dia todo!",
      principal: false,
    },
  ];

  const eventosFiltrados = eventos.filter((evento) => {
    const nomeMatch = evento.titulo
      .toLowerCase()
      .includes(filtroNome.toLowerCase());
    const mesMatch = filtroMes
      ? new Date(evento.data).getMonth() + 1 === parseInt(filtroMes)
      : true;
    return nomeMatch && mesMatch;
  });

  const principais = eventosFiltrados.filter((evento) => evento.principal);
  const demais = eventosFiltrados.filter((evento) => !evento.principal);

  return (
    <div className={styles.container}>
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <main className={styles.content}>
          <h2 className={styles.title}>Próximos Eventos</h2>

          <div className={styles.cupomAlerta}>
            <GiftIcon style={{ width: "20px", height: "20px" }} />
            Cupons disponíveis para eventos especiais! Acesse o menu de
            gamificações.
          </div>

          <div className={styles.filtros}>
            <input
              type="text"
              placeholder="Filtrar por nome"
              className={styles.filtroInput}
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
            <select
              className={styles.filtroSelect}
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
            >
              <option value="">Todos os meses</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
            </select>
          </div>

          {principais.length > 0 && (
            <div className={styles.carousel}>
              {principais.slice(0, 4).map((evento) => (
                <div key={evento.id} className={styles.carouselCard}>
                  <h3 className={styles.eventoTitulo}>{evento.titulo}</h3>
                  <p className={styles.eventoData}>
                    📅 {new Date(evento.data).toLocaleDateString("pt-BR")}
                  </p>
                  <p className={styles.eventoLocal}>📍 {evento.local}</p>
                  <p className={styles.eventoDescricao}>{evento.descricao}</p>
                </div>
              ))}
            </div>
          )}

          <div className={styles.eventosGrid}>
            {demais.map((evento) => (
              <div key={evento.id} className={styles.eventoCard}>
                <h3 className={styles.eventoTitulo}>{evento.titulo}</h3>
                <p className={styles.eventoData}>
                  📅 {new Date(evento.data).toLocaleDateString("pt-BR")}
                </p>
                <p className={styles.eventoLocal}>📍 {evento.local}</p>
                <p className={styles.eventoDescricao}>{evento.descricao}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
