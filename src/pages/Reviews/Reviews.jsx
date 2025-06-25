import React, { useState, useEffect, useRef } from "react";
import styles from "./Reviews.module.css";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Rating } from "primereact/rating";
import "primeicons/primeicons.css";

export default function ReviewsLojas() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [lojas, setLojas] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroNota, setFiltroNota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const lojasPorPagina = 15;

  const opcoesNotas = [
    { label: "Todas as notas", value: null },
    { label: "Abaixo de 4.5", value: 4.5 },
    { label: "Abaixo de 4.0", value: 4.0 },
    { label: "Abaixo de 3.5", value: 3.5 },
  ];

  useEffect(() => {
    carregarLojas();
  }, []);

  const carregarLojas = () => {
    setLoading(true);
    try {
      const lojasSalvas = JSON.parse(localStorage.getItem("lojasUsuario"));
      if (lojasSalvas && lojasSalvas.length > 0) {
        setLojas(lojasSalvas);
      } else {
        const mock = [];
        for (let i = 1; i <= 50; i++) {
          mock.push({
            id: i,
            nome: `Loja ${i}`,
            nota: (Math.random() * 2 + 3).toFixed(1),
            imagem: "https://via.placeholder.com/150",
          });
        }
        setLojas(mock);
        localStorage.setItem("lojasUsuario", JSON.stringify(mock));
      }
    } catch (error) {
      console.error("Erro ao carregar lojas:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao carregar lojas.",
      });
    } finally {
      setLoading(false);
    }
  };

  const lojasFiltradas = lojas.filter((loja) => {
    const nomeMatch = loja.nome.toLowerCase().includes(busca.toLowerCase());
    const notaMatch = !filtroNota || parseFloat(loja.nota) <= filtroNota;
    return nomeMatch && notaMatch;
  });

  const totalPaginas = Math.ceil(lojasFiltradas.length / lojasPorPagina);
  const inicio = (paginaAtual - 1) * lojasPorPagina;
  const lojasPaginadas = lojasFiltradas.slice(inicio, inicio + lojasPorPagina);

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <NavBarraSide />

      <div className={styles.mainContent}>
        <NavBarraTop />
        <h2>Reviews das Lojas</h2>

        <div className={styles.filtros}>
          <InputText
            placeholder="Buscar loja..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={styles.inputBusca}
          />

          <Dropdown
            value={filtroNota}
            options={opcoesNotas}
            onChange={(e) => setFiltroNota(e.value)}
            placeholder="Filtrar por nota"
            className={styles.inputPadraoDropdown}
            showClear
          />
        </div>

        {loading ? (
          <p>Carregando lojas...</p>
        ) : (
          <>
            <div className={styles.grid}>
              {lojasPaginadas.length > 0 ? (
                lojasPaginadas.map((loja) => (
                  <div
                    key={loja.id}
                    className={styles.card}
                    onClick={() => navigate(`/reviews/${loja.id}/geral`)}
                  >
                    <img src={loja.imagem} alt={loja.nome} />
                    <h3>{loja.nome}</h3>
                    <Rating
                      value={parseFloat(loja.nota)}
                      readOnly
                      stars={5}
                      cancel={false}
                      className={styles.rating}
                    />
                  </div>
                ))
              ) : (
                <p>Nenhuma loja encontrada.</p>
              )}
            </div>

            {totalPaginas > 1 && (
              <div className={styles.paginacao}>
                <button
                  onClick={() => mudarPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {paginaAtual} de {totalPaginas}
                </span>
                <button
                  onClick={() => mudarPagina(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
