import styles from "./MeusProdutos.module.css";
import NavBarraSide from "../../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../../components/layout/navBarraTop/NavBarraTop";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { useState, useEffect, useRef } from "react";
import CadastroProduto from "../../../components/form/cadastroProduto/CadProduto";
import { buscarProdutos, deletarProduto } from "../../../utils/api";

export default function MeusProdutos() {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const toast = useRef(null);

  const categorias = [
    { label: "Refeições", value: "Refeições" },
    { label: "Lanches", value: "Lanches" },
    { label: "Doces", value: "Doces" },
    { label: "Bebidas", value: "Bebidas" },
    { label: "Alimentos Saudáveis", value: "Alimentos Saudáveis" },
    { label: "Combos e Kits", value: "Combos e Kits" },
    { label: "Outros", value: "Outros" },
  ];

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    filtrarProdutos();
  }, [busca, categoriaSelecionada, produtos]);

  async function carregarProdutos() {
    try {
      const lista = await buscarProdutos();
      setProdutos(lista);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao carregar produtos.",
      });
    }
  }

  function filtrarProdutos() {
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
  }

  const excluirProduto = async () => {
    if (!produtoParaExcluir) return;

    try {
      await deletarProduto(produtoParaExcluir.id);
      toast.current.show({
        severity: "success",
        summary: "Produto excluído",
        detail: "Produto removido com sucesso!",
        life: 3000,
      });
      carregarProdutos();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao excluir produto.",
        life: 3000,
      });
    } finally {
      setConfirmDeleteOpen(false);
      setProdutoParaExcluir(null);
    }
  };

  const salvarEdicaoProduto = () => {
    if (!produtoSelecionado) return;

    const atualizados = produtos.map((p) =>
      p.id === produtoSelecionado.id ? produtoSelecionado : p
    );

    setProdutos(atualizados);
    setProdutosFiltrados(atualizados);
    toast.current.show({
      severity: "success",
      summary: "Produto atualizado com sucesso!",
      life: 3000,
    });

    setShowEditForm(false);
    setProdutoSelecionado(null);
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <main className={styles.content}>
          <h2 className={styles.title}>Meus Produtos</h2>

          <div className={styles.filtrosWrapper}>
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
            <div className={styles.botaoWrapper}>
              <Button
                label="Criar Produto"
                icon="pi pi-plus-circle"
                className={styles.botaoCustomizado}
                onClick={() => setShowForm(true)}
              />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id}>
                    <td>
                      <img
                        src={produto.imagemUrl}
                        alt={produto.nome}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    </td>
                    <td>{produto.nome}</td>
                    <td>{produto.categorias?.join(", ") || "-"}</td>
                    <td>R$ {produto.preco?.toFixed(2) || "-"}</td>
                    <td>
                      <Button
                        icon="pi pi-pencil"
                        className={styles.editBtn}
                        onClick={() => {
                          setProdutoSelecionado(produto);
                          setShowEditForm(true);
                        }}
                      />
                      <Button
                        icon="pi pi-trash"
                        className={styles.deleteBtn}
                        onClick={() => {
                          setProdutoParaExcluir(produto);
                          setConfirmDeleteOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <CadastroProduto
        visible={showForm}
        onHide={() => setShowForm(false)}
        onSave={carregarProdutos}
      />

      {/* Diálogo de edição simulado */}
      <Dialog
        header="Editar Produto"
        visible={showEditForm}
        style={{ width: "500px" }}
        modal
        onHide={() => setShowEditForm(false)}
        footer={
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowEditForm(false)}
            />
            <Button
              label="Salvar"
              icon="pi pi-check"
              onClick={salvarEdicaoProduto}
            />
          </div>
        }
      >
        {produtoSelecionado && (
          <div className={styles.editForm}>
            <label>Nome</label>
            <InputText
              value={produtoSelecionado.nome}
              onChange={(e) =>
                setProdutoSelecionado((prev) => ({
                  ...prev,
                  nome: e.target.value,
                }))
              }
              className={styles.inputPadrao}
            />

            <label>Preço</label>
            <InputText
              value={produtoSelecionado.preco}
              onChange={(e) =>
                setProdutoSelecionado((prev) => ({
                  ...prev,
                  preco: parseFloat(e.target.value),
                }))
              }
              className={styles.inputPadrao}
            />

            <label>Imagem (URL)</label>
            <InputText
              value={produtoSelecionado.imagemUrl}
              onChange={(e) =>
                setProdutoSelecionado((prev) => ({
                  ...prev,
                  imagemUrl: e.target.value,
                }))
              }
              className={styles.inputPadrao}
            />

            <label>Categorias (separadas por vírgula)</label>
            <InputText
              value={produtoSelecionado.categorias?.join(", ") || ""}
              onChange={(e) =>
                setProdutoSelecionado((prev) => ({
                  ...prev,
                  categorias: e.target.value
                    .split(",")
                    .map((c) => c.trim())
                    .filter((c) => c),
                }))
              }
              className={styles.inputPadrao}
            />
          </div>
        )}
      </Dialog>

      <Dialog
        header="Confirmar Exclusão"
        visible={confirmDeleteOpen}
        style={{ width: "350px" }}
        modal
        footer={
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setConfirmDeleteOpen(false)}
              className="p-button-text"
            />
            <Button
              label="Confirmar"
              icon="pi pi-check"
              severity="danger"
              onClick={excluirProduto}
            />
          </div>
        }
        onHide={() => setConfirmDeleteOpen(false)}
      >
        <p>
          Tem certeza que deseja excluir o produto{" "}
          <strong>{produtoParaExcluir?.nome}</strong>?
        </p>
      </Dialog>
    </div>
  );
}
