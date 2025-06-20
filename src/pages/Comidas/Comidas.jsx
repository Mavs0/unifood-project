import styles from "./Comidas.module.css";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import { Dropdown } from "primereact/dropdown";
import { FaFilter } from "react-icons/fa";
import { Toast } from "primereact/toast";
import VisualizarProduto from "../../components/form/visualizarProduto/VisualizarProduto";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarProdutos } from "../../utils/api";

export default function Comidas() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useRef(null);
  const navigate = useNavigate();

  const categorias = [
    { label: "Refeições", value: "Refeições" },
    { label: "Lanches", value: "Lanches" },
    { label: "Doces e Sobremesas", value: "Doces e Sobremesas" },
    { label: "Bebidas", value: "Bebidas" },
    { label: "Alimentos Saudáveis", value: "Alimentos Saudáveis" },
    { label: "Combos e Kits", value: "Combos e Kits" },
    { label: "Outros", value: "Outros" },
  ];

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    setLoading(true);
    try {
      const lista = await buscarProdutos();
      setProdutos(lista);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao carregar produtos.",
      });
    } finally {
      setLoading(false);
    }
  }

  const produtosFiltrados = produtos.filter((produto) => {
    const nomeMatch = produto.nome.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch =
      !categoriaSelecionada || produto.categoria === categoriaSelecionada;
    return nomeMatch && categoriaMatch;
  });

  const adicionarAoCarrinho = async (produto) => {
    toast.current.show({
      severity: "success",
      summary: "Carrinho",
      detail: `${produto.nome} adicionado ao carrinho.`,
    });
  };

  const handleComprarAgora = (produto) => {
    navigate("/pagamento", { state: { produto } });
  };

  return (
    <div className={styles.layout}>
      <Toast ref={toast} />
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />

        <div className={styles.container}>
          <div className={styles.topo}>
            <h2 className={styles.titulo}>Comidas</h2>
            <InputText
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.inputBusca}
            />
          </div>

          <div className={styles.filtro}>
            <span className={styles.labelFiltro}>
              <FaFilter className={styles.iconFiltro} />
              Filtrar por:
            </span>
            <Dropdown
              value={categoriaSelecionada}
              options={categorias}
              onChange={(e) => setCategoriaSelecionada(e.value)}
              placeholder="Selecione a categoria"
              className={styles.dropdownFiltro}
            />
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className={styles.gridProdutos}>
              {produtosFiltrados.map((produto) => (
                <div
                  key={produto.id}
                  className={styles.cardProduto}
                  onClick={() => setProdutoSelecionado(produto)}
                >
                  <img
                    src={produto.imagemUrl}
                    alt={produto.nome}
                    className={styles.imagemProduto}
                  />
                  <div className={styles.info}>
                    <h4>{produto.nome}</h4>
                    <span>R$ {produto.preco.toFixed(2)}</span>
                    <p>{produto.loja}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {produtoSelecionado && (
            <VisualizarProduto
              produto={produtoSelecionado}
              aberto={!!produtoSelecionado}
              aoFechar={() => setProdutoSelecionado(null)}
              adicionarAoCarrinho={adicionarAoCarrinho}
              comprarAgora={handleComprarAgora}
            />
          )}
        </div>
      </div>
    </div>
  );
}
