import styles from "./MeusProdutos.module.css";
import NavBarraSide from "../../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../../components/layout/navBarraTop/NavBarraTop";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState, useEffect, useRef } from "react";
import CadastroProduto from "../../../components/form/cadastroProduto/CadProduto";
import { Toast } from "primereact/toast";

const produtosMock = [
  {
    id: "1",
    nome: "Brigadeiro Clássico",
    preco: 3.5,
    imagemUrl:
      "https://firebasestorage.googleapis.com/v0/b/seu-projeto-id.appspot.com/o/produtos%2Fbrigadeiro.jpg?alt=media",
    categorias: ["Doces e Sobremesas"],
  },
  {
    id: "2",
    nome: "Brownie de Chocolate",
    preco: 8.0,
    imagemUrl:
      "https://firebasestorage.googleapis.com/v0/b/seu-projeto-id.appspot.com/o/produtos%2Fbrownie.jpg?alt=media",
    categorias: ["Lanches", "Doces e Sobremesas"],
  },
  {
    id: "3",
    nome: "Suco Natural",
    preco: 6.0,
    imagemUrl:
      "https://firebasestorage.googleapis.com/v0/b/seu-projeto-id.appspot.com/o/produtos%2Fsuco.jpg?alt=media",
    categorias: ["Bebidas"],
  },
];

export default function MeusProdutos() {
  const [showForm, setShowForm] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const toast = useRef(null);

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
    setProdutos(produtosMock);
    setProdutosFiltrados(produtosMock);
  }, []);

  useEffect(() => {
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
  }, [busca, categoriaSelecionada, produtos]);

  const excluirProduto = (id) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
    toast.current.show({
      severity: "success",
      summary: "Produto excluído",
      detail: "Produto removido com sucesso!",
      life: 3000,
    });
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
              placeholder="Buscar por nome..."
              className={styles.inputBusca}
            />
            <Dropdown
              value={categoriaSelecionada}
              options={categorias}
              onChange={(e) => setCategoriaSelecionada(e.value)}
              placeholder="Filtrar por categoria"
              showClear
              className={styles.inputBusca}
            />
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
                    <td>{produto.categorias.join(", ")}</td>
                    <td>R$ {produto.preco.toFixed(2)}</td>
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
                        onClick={() => excluirProduto(produto.id)}
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
        onSave={() => {}}
      />
    </div>
  );
}
