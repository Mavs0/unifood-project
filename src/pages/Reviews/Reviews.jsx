import React, { useState, useEffect, useRef } from "react";
import styles from "./Reviews.module.css";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Rating } from "primereact/rating";
import {
  listarAvaliacoesTodasLojas,
  listarAvaliacoesVendedor,
} from "../../utils/api";

import ErroGenerico from "../../components/ui/ErroGenerico";
import Imagem from "../../assets/image/Erro.svg";

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

  const carregarLojas = async () => {
    setLoading(true);
    try {
      // const user = JSON.parse(localStorage.getItem("usuario") || "{}");
      // const response = await listarAvaliacoesVendedor(user.uid); // já vem como array
      const response = await listarAvaliacoesTodasLojas(); // já vem como array

      const lojasComNota = response.sellers.map((item) => ({
        id: item.targetId,
        nome: item.sellerName || `Vendedor ${item.sellerId}`,
        nota: parseFloat(item.averageRating || 0).toFixed(1),
        imagem: item.imagem || "https://via.placeholder.com/150",
      }));

      setLojas(lojasComNota);
    } catch (error) {
      console.warn("Usando dados mockados por erro na API:", error.message);

      const lojasMock = [
        {
          id: "mock1",
          nome: "Doces da Ana",
          nota: "4.7",
          imagem:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: "mock2",
          nome: "Lanchonete do João",
          nota: "3.9",
          imagem:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: "mock3",
          nome: "Açaí da UFAM",
          nota: "4.2",
          imagem:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
        },
      ];

      setLojas(lojasMock);

      toast.current.show({
        severity: "warn",
        summary: "Aviso",
        detail: "Exibindo dados de exemplo por falha ao carregar dados reais.",
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
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Carregando avaliações...</p>
          </div>
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
                <ErroGenerico
                  codigo="404"
                  titulo="Nenhuma loja encontrada"
                  descricao="Não encontramos nenhuma loja com os critérios informados."
                  imagem={Imagem}
                  onReload={() => window.location.reload()}
                />
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
