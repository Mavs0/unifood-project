import React, { useState } from "react";
import styles from "./Reviews.module.css";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import "primeicons/primeicons.css";

const lojasMock = [
  {
    id: "loja1",
    nome: "Brigadeiros da Raquel",
    nota: 5.0,
    imagem:
      "https://firebasestorage.googleapis.com/v0/b/seu-projeto-id.appspot.com/o/lojas%2Fbrigadeiros.jpg?alt=media",
  },
  {
    id: "loja2",
    nome: "Brownies da Amanda",
    nota: 4.9,
    imagem:
      "https://firebasestorage.googleapis.com/v0/b/seu-projeto-id.appspot.com/o/lojas%2Fbrownies.jpg?alt=media",
  },
];

export default function ReviewsLojas() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroNota, setFiltroNota] = useState(null);

  const opcoesNotas = [
    { label: "Todas as notas", value: null },
    { label: "Acima de 4.5", value: 4.5 },
    { label: "Acima de 4.0", value: 4.0 },
    { label: "Acima de 3.5", value: 3.5 },
  ];

  const lojasFiltradas = lojasMock.filter((loja) => {
    const nomeMatch = loja.nome.toLowerCase().includes(busca.toLowerCase());
    const notaMatch = !filtroNota || loja.nota >= filtroNota;
    return nomeMatch && notaMatch;
  });

  return (
    <div className={styles.container}>
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <h2>Reviews das Lojas</h2>

        <div className={styles.filtros}>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              placeholder="Buscar loja..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.inputBusca}
            />
          </span>

          <Dropdown
            value={filtroNota}
            options={opcoesNotas}
            onChange={(e) => setFiltroNota(e.value)}
            placeholder="Filtrar por nota"
            className={styles.dropdownFiltro}
          />
        </div>

        <div className={styles.grid}>
          {lojasFiltradas.length > 0 ? (
            lojasFiltradas.map((loja) => (
              <div
                key={loja.id}
                className={styles.card}
                onClick={() => navigate(`/reviews/${loja.id}/produtos`)}
              >
                <img src={loja.imagem} alt={loja.nome} />
                <h3>{loja.nome}</h3>
                <p>⭐ {loja.nota.toFixed(1)}</p>
              </div>
            ))
          ) : (
            <p>Nenhuma loja encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}
