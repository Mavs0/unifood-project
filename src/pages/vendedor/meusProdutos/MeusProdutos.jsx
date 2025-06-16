import styles from "./MeusProdutos.module.css";
import NavBarraSide from "../../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../../components/layout/navBarraTop/NavBarraTop";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";

import { useState, useEffect } from "react";
import CadastroProduto from "../../../components/form/cadastroProduto/CadProduto";
import CardViewProduct from "../../../features/cardViewProduct/CardViewProduct";

// Firebase
import { db } from "/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

export default function MeusProdutos() {
  const [showForm, setShowForm] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        setLoading(true);
        const userStorage =
          localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
        const usuario = userStorage ? JSON.parse(userStorage) : null;

        if (!usuario?.uid) {
          console.warn("Usuário não logado.");
          return;
        }

        const produtosRef = collection(db, "produtos");
        const produtosQuery = query(
          produtosRef,
          where("uid", "==", usuario.uid)
        );
        const snapshot = await getDocs(produtosQuery);

        let lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Produtos mockados
        const produtosMockados = [
          // {
          //   nome: "Tortilha Doce",
          //   preco: 39,
          //   categoria: "Sobremesa",
          //   descricao: "Tortilha crocante recheada com cerejas frescas.",
          //   imagemUrl:
          //     "https://images.unsplash.com/photo-1606788075761-5ec9d7c4e6b4",
          //   loja: "Loja da Dona Florinda",
          //   uid: usuario.uid,
          //   ultimaAtualizacao: "11/06/2025 14:30",
          // },
          {
            nome: "Hambúrguer Artesanal",
            preco: 25,
            categoria: "Lanches",
            descricao: "Hambúrguer suculento com ingredientes frescos.",
            imagemUrl:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            loja: "Burger House",
            uid: usuario.uid,
            ultimaAtualizacao: "11/06/2025 14:31",
          },
          {
            nome: "Suco Detox",
            preco: 10,
            categoria: "Bebidas",
            descricao: "Suco saudável com hortelã, limão e especiarias.",
            imagemUrl:
              "https://images.unsplash.com/photo-1617196038434-c43c9acb53b3",
            loja: "Natureba Drinks",
            uid: usuario.uid,
            ultimaAtualizacao: "11/06/2025 14:32",
          },
          {
            nome: "Salada Tropical",
            preco: 18,
            categoria: "Saladas",
            descricao: "Salada leve com frutas, folhas e molho especial.",
            imagemUrl:
              "https://images.unsplash.com/photo-1519337265831-281ec6cc8514",
            loja: "FitFood",
            uid: usuario.uid,
            ultimaAtualizacao: "11/06/2025 14:33",
          },
        ];

        // Adiciona os produtos mockados à lista
        lista = [...lista, ...produtosMockados];

        setProdutos(lista);
        setProdutosFiltrados(lista);

        const categoriasUnicas = [
          ...new Set(lista.map((p) => p.categoria).filter(Boolean)),
        ];
        setCategoriasDisponiveis(
          categoriasUnicas.map((c) => ({ label: c, value: c }))
        );
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarProdutos();
  }, []);

  useEffect(() => {
    filtrarProdutos();
  }, [busca, categoriaSelecionada, produtos]);

  const filtrarProdutos = () => {
    let filtrados = produtos;

    if (busca) {
      filtrados = filtrados.filter((p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }

    if (categoriaSelecionada) {
      filtrados = filtrados.filter((p) => p.categoria === categoriaSelecionada);
    }

    setProdutosFiltrados(filtrados);
  };

  const salvarProduto = async (novoProduto) => {
    const userStorage =
      localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    const usuario = userStorage ? JSON.parse(userStorage) : null;

    if (!usuario?.uid) {
      alert("Usuário não autenticado.");
      return;
    }

    if (novoProduto.id) {
      setProdutos((prev) => [...prev, novoProduto]);
      return;
    }

    const produtoComData = {
      ...novoProduto,
      uid: usuario.uid,
      ultimaAtualizacao: new Date().toLocaleString("pt-BR"),
    };

    try {
      const docRef = await addDoc(collection(db, "produtos"), produtoComData);
      setProdutos((prev) => [...prev, { id: docRef.id, ...produtoComData }]);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <div className={styles.layout}>
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />

        <div className={styles.contprodutos}>
          <div className={styles.submit}>
            <h2 className={styles.titulo}>Meus Produtos</h2>
            <Button
              label="Criar Produto"
              icon="pi pi-plus-circle"
              className={styles.botaoCustomizado}
              onClick={() => setShowForm(true)}
            />
          </div>

          {/* Filtros */}
          <div className={styles.filtros}>
            <InputText
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome..."
            />
            <Dropdown
              value={categoriaSelecionada}
              options={categoriasDisponiveis}
              onChange={(e) => setCategoriaSelecionada(e.value)}
              placeholder="Filtrar por categoria"
              showClear
            />
          </div>

          {/* Loading ou Listagem */}
          {loading ? (
            <div className={styles.loading}>
              <ProgressSpinner />
            </div>
          ) : (
            <CardViewProduct produtos={produtosFiltrados} />
          )}
        </div>
      </div>

      <CadastroProduto
        visible={showForm}
        onHide={() => setShowForm(false)}
        onSave={salvarProduto}
      />
    </div>
  );
}
