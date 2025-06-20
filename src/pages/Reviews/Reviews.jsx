import React, { useState, useEffect, useRef } from "react";
import styles from "./Reviews.module.css";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { getAuthHeaders } from "../../utils/auth";
import "primeicons/primeicons.css";

export default function ReviewsLojas() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [lojas, setLojas] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroNota, setFiltroNota] = useState(null);
  const [loading, setLoading] = useState(true);

  const opcoesNotas = [
    { label: "Todas as notas", value: null },
    { label: "Abaixo de 4.5", value: 4.5 },
    { label: "Abaixo de 4.0", value: 4.0 },
    { label: "Abaixo de 3.5", value: 3.5 },
  ];

  useEffect(() => {
    buscarLojas();
  }, []);

  async function buscarLojas() {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users?role=vendedor`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error("Erro ao buscar lojas");

      const lista = await res.json();

      // Adapta a estrutura esperada para o frontend
      const adaptadas = lista.map((user) => ({
        id: user.id,
        nome: `${user.firstName} ${user.lastName}`,
        nota: user.notaMedia || 4.5, // Fallback para se o backend ainda não enviar nota
        imagem: user.imagemUrl || "https://via.placeholder.com/150",
      }));

      setLojas(adaptadas);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao carregar lojas.",
      });
    } finally {
      setLoading(false);
    }
  }

  const lojasFiltradas = lojas.filter((loja) => {
    const nomeMatch = loja.nome.toLowerCase().includes(busca.toLowerCase());
    const notaMatch = !filtroNota || loja.nota >= filtroNota;
    return nomeMatch && notaMatch;
  });

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
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

        {loading ? (
          <p>Carregando lojas...</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
