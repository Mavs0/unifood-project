import styles from "./Comidas.module.css";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import { Dropdown } from "primereact/dropdown";
import { FaFilter } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import VisualizarProduto from "../../components/form/visualizarProduto/VisualizarProduto";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

//
export default function Comidas() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleComprarAgora = (produto) => {
    navigate("/pagamento", { state: { produto } });
  };

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
    setProdutos([
      //   {
      //     id: 2,
      //     nome: "Hambúrguer Artesanal",
      //     preco: 25,
      //     categoria: "Lanches",
      //     loja: "Burger House",
      //     descricao: "Hambúrguer artesanal com pão brioche e cheddar.",
      //     imagemUrl:
      //       "https://img.freepik.com/fotos-premium/hamburguer-artesanal-em-pao-brioche-com-batatas_1048944-271947.jpg",
      //   },
      //   {
      //     id: 3,
      //     nome: "Suco Detox",
      //     preco: 10,
      //     categoria: "Bebidas",
      //     loja: "Natureba Drinks",
      //     descricao: "Suco verde detox natural sem açúcar.",
      //     imagemUrl:
      //       "https://img.freepik.com/fotos-premium/suco-verde-detox-em-copo-de-vidro-com-ingredientes-frescos_127032-2037.jpg",
      //   },
      //   {
      //     id: 4,
      //     nome: "Salada Tropical",
      //     preco: 18,
      //     categoria: "Alimentos Saudáveis",
      //     loja: "FitFood",
      //     descricao: "Salada fresca com frutas tropicais e molho leve.",
      //     imagemUrl:
      //       "https://img.freepik.com/fotos-premium/salada-fresca-com-frutas-e-folhas-verdes_488220-29752.jpg",
      //   },
      //   {
      //     id: 5,
      //     nome: "Combo Família",
      //     preco: 89,
      //     categoria: "Combos e Kits",
      //     loja: "Delícias Express",
      //     descricao: "Combo com 4 hambúrgueres, batatas e refrigerante.",
      //     imagemUrl:
      //       "https://img.freepik.com/fotos-premium/hamburguer-completo-com-fritas-e-refrigerante_488220-104.jpg",
      //   },
      {
        id: 1,
        nome: "Tortilha Doce",
        preco: 39,
        categoria: "Doces e Sobremesas",
        loja: "Loja da Dona Florinda",
        descricao: "Deliciosa tortilha de batata doce com mel.",
        imagemUrl:
          "https://img.freepik.com/fotos-gratis/fatia-de-torta-de-batata-doce-com-cobertura-crocante_2829-16929.jpg",
      },
    ]);
  }, []);

  const produtosFiltrados = produtos.filter((produto) => {
    const nomeMatch = produto.nome.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch =
      !categoriaSelecionada || produto.categoria === categoriaSelecionada;
    return nomeMatch && categoriaMatch;
  });

  const adicionarAoCarrinho = (produto) => {
    toast.current.show({
      severity: "success",
      summary: "Adicionado!",
      detail: `${produto.nome} foi adicionado ao carrinho.`,
      life: 3000,
    });
  };

  const comprarAgora = () => {
    navigate("/pagamento");
  };

  return (
    <div className={styles.layout}>
      <Toast ref={toast} />
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />

        <div className={styles.container}>
          {/* <div className={styles.topo}>
            <h2 className={styles.titulo}>Comidas</h2>
            <InputText
              placeholder="Buscar produto..."
              className={styles.inputBusca}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div> */}

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

          <VisualizarProduto
            produto={produtoSelecionado}
            aberto={!!produtoSelecionado}
            aoFechar={() => setProdutoSelecionado(null)}
            adicionarAoCarrinho={adicionarAoCarrinho}
            comprarAgora={handleComprarAgora}
          />
        </div>
      </div>
    </div>
  );
}
