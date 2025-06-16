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
import { getAuthHeaders } from "../../utils/api"; // helper centralizado pra pegar token

export default function Comidas() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useRef(null);
  const navigate = useNavigate();

  const categorias = [
    { label: "Refeições", value: "refeições" },
    { label: "Lanches", value: "lanches" },
    { label: "Doces e Sobremesas", value: "Doces e Sobremesas" },
    { label: "Bebidas", value: "bebidas" },
    { label: "Alimentos Saudáveis", value: "Alimentos Saudáveis" },
    { label: "Combos e Kits", value: "Combos e Kits" },
    { label: "Outros", value: "outros" },
  ];

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    setLoading(true);
    try {
      const res = await fetch(
        "https://us-central1-unifood-aaa0f.cloudfunctions.net/api/product",
        {
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error("Erro ao carregar produtos");

      const lista = await res.json();
      setProdutos(lista);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao carregar produtos da API",
      });
    } finally {
      setLoading(false);
    }
  }

  const produtosFiltrados = produtos.filter((produto) => {
    const nomeMatch = produto.nome?.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch =
      !categoriaSelecionada || produto.categoria === categoriaSelecionada;
    return nomeMatch && categoriaMatch;
  });

  const adicionarAoCarrinho = async (produto) => {
    try {
      const res = await fetch(
        "https://us-central1-unifood-aaa0f.cloudfunctions.net/api/cart/add",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            productId: produto.id,
            quantidade: 1,
          }),
        }
      );
      if (!res.ok) throw new Error("Erro ao adicionar ao carrinho");

      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: `${produto.nome} adicionado ao carrinho!`,
      });
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao adicionar ao carrinho",
      });
    }
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
              className={styles.inputBusca}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
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
            <p>Carregando produtos...</p>
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
                    <div className={styles.nomePreco}>
                      <h4>{produto.nome}</h4>
                      <span>R${produto.preco}</span>
                    </div>
                    <p className={styles.loja}>{produto.loja}</p>
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
