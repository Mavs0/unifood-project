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
import { getAuthHeaders } from "../../../utils/auth";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export default function MeusProdutos() {
  const [showForm, setShowForm] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    buscarProdutos();
  }, []);

  useEffect(() => {
    filtrarProdutos();
  }, [busca, categoriaSelecionada, produtos]);

  async function buscarProdutos() {
    setLoading(true);
    try {
      const res = await fetch(
        "http://127.0.0.1:5001/unifood-aaa0f/us-central1/api/product",
        {
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error("Erro ao buscar produtos");

      const lista = await res.json();
      setProdutos(lista);
      setProdutosFiltrados(lista);

      const categoriasUnicas = [
        ...new Set(lista.map((p) => p.categorias?.[0]).filter(Boolean)),
      ];
      setCategoriasDisponiveis(
        categoriasUnicas.map((c) => ({ label: c, value: c }))
      );
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtrarProdutos = () => {
    let filtrados = produtos;

    if (busca) {
      filtrados = filtrados.filter((p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }

    if (categoriaSelecionada) {
      filtrados = filtrados.filter(
        (p) => p.categorias && p.categorias.includes(categoriaSelecionada)
      );
    }

    setProdutosFiltrados(filtrados);
  };

  const excluirProduto = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5001/unifood-aaa0f/us-central1/api/product/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error("Erro ao excluir produto");

      setProdutos((prev) => prev.filter((p) => p.id !== id));
      toast.current.show({
        severity: "success",
        summary: "Produto excluído",
        detail: "Produto removido com sucesso!",
        life: 3000,
      });
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível excluir o produto.",
        life: 3000,
      });
    }
  };

  return (
    <div className={styles.layout}>
      <Toast ref={toast} />
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

          {loading ? (
            <div className={styles.loading}>
              <ProgressSpinner />
            </div>
          ) : (
            <CardViewProduct
              produtos={produtosFiltrados}
              onDelete={excluirProduto}
            />
          )}
        </div>
      </div>

      <CadastroProduto
        visible={showForm}
        onHide={() => setShowForm(false)}
        onSave={buscarProdutos}
      />
    </div>
  );
}
