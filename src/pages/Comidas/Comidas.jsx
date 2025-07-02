import styles from "./Comidas.module.css";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import VisualizarProduto from "../../components/form/visualizarProduto/VisualizarProduto";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarProdutos } from "../../utils/api";
import ErroGenerico from "../../components/ui/ErroGenerico";
import Imagem from "../../assets/image/Erro.svg";
import { Tooltip } from "primereact/tooltip";

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
    async function carregarProdutos() {
      setLoading(true);
      try {
        const lista = await buscarProdutos();
        setProdutos(lista);
      } catch (err) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao carregar produtos.",
        });
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((produto) => {
    const nomeMatch = produto.nome.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch =
      !categoriaSelecionada || produto.categoria === categoriaSelecionada;
    return nomeMatch && categoriaMatch;
  });

  const adicionarAoCarrinho = (produto) => {
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho")) || [];
    const existente = carrinhoAtual.find((p) => p.id === produto.id);

    let novoCarrinho;

    if (existente) {
      novoCarrinho = carrinhoAtual.map((p) =>
        p.id === produto.id ? { ...p, quantidade: p.quantidade + 1 } : p
      );
    } else {
      novoCarrinho = [...carrinhoAtual, { ...produto, quantidade: 1 }];
    }

    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));

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
      <Tooltip target="[data-pr-tooltip]" position="top" />
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />

        <div className={styles.container}>
          <div className={styles.headerBar}>
            <h2 className={styles.titulo}>Comidas</h2>
            <p className={styles.subtitulo}>
              Explore refeições saborosas preparadas por vendedores locais.
              Filtre por categoria ou busque pelo nome.
            </p>
          </div>

          <div className={styles.filtroContainerNovo}>
            <InputText
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome"
              className={styles.inputPadrao}
            />

            <div className={styles.filtrosCategorias}>
              {categorias.map((cat) => (
                <button
                  key={cat.value}
                  className={`${styles.botaoCategoria} ${
                    categoriaSelecionada === cat.value ? styles.ativo : ""
                  }`}
                  onClick={() =>
                    setCategoriaSelecionada(
                      categoriaSelecionada === cat.value ? null : cat.value
                    )
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Carregando produtos...</p>
            </div>
          ) : produtosFiltrados.length === 0 ? (
            <ErroGenerico
              codigo="404"
              titulo="Nenhum produto encontrado"
              descricao="Não encontramos nenhum produto com os critérios informados."
              imagem={Imagem}
              onReload={() => window.location.reload()}
            />
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
                    <h4 className={styles.nomeProduto}>{produto.nome}</h4>
                    <div className={styles.tagsWrapper}>
                      <span className={styles.tagPreco}>
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      {/* <span className={styles.tagCategoria}>
                        {produto.categoria}
                      </span> */}
                      <div className={styles.botoesCard}>
                        <button
                          className={`${styles.botaoAcao} ${styles.botaoVisualizar}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProdutoSelecionado(produto);
                          }}
                          data-pr-tooltip="Visualizar Produto"
                          aria-label="Visualizar Produto"
                        >
                          <i className="pi pi-eye" />
                        </button>

                        <button
                          className={`${styles.botaoAcao} ${styles.botaoFavoritar}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.current.show({
                              severity: "info",
                              summary: "Favorito",
                              detail: `Produto ${produto.nome} favoritado!`,
                            });
                          }}
                          data-pr-tooltip="Favoritar Produto"
                          aria-label="Favoritar Produto"
                        >
                          <i className="pi pi-heart" />
                        </button>

                        <button
                          className={`${styles.botaoAcao} ${styles.botaoCarrinho}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            adicionarAoCarrinho(produto);
                          }}
                          data-pr-tooltip="Adicionar ao Carrinho"
                          aria-label="Adicionar ao Carrinho"
                        >
                          <i className="pi pi-shopping-cart" />
                        </button>

                        <button
                          className={`${styles.botaoAcao} ${styles.botaoComprar}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComprarAgora(produto);
                          }}
                          data-pr-tooltip="Comprar Agora"
                          aria-label="Comprar Agora"
                        >
                          <i className="pi pi-credit-card" />
                        </button>
                      </div>
                    </div>
                    <p className={styles.loja}>{produto.loja}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <VisualizarProduto
            produto={produtoSelecionado}
            onClose={() => setProdutoSelecionado(null)} // <- nome correto da prop
            adicionarAoCarrinho={adicionarAoCarrinho}
            comprarAgora={handleComprarAgora}
          />
        </div>
      </div>
    </div>
  );
}
