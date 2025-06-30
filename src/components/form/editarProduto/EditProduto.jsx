import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

import { useState, useEffect } from "react";
import style from "./EditProduto.module.css";

// estado inicial dos dados
const PRODUTO_INICIAL = {
  nome: "",
  preco: null,
  categoria: null,
  descricao: "",
};

export default function FormCadProduto({
  visible,
  onHide,
  onSave,
  produtoEdicao,
}) {
  const [produto, setProduto] = useState(PRODUTO_INICIAL);
  const [loading, setLoading] = useState(false);

  const categorias = [
    { label: "Refeições", value: "refeições" },
    { label: "Lanches", value: "lanches" },
    { label: "Doces e Sobremesas", value: "Doces e Sobremesas" },
    { label: "Bebidas", value: "bebidas" },
    { label: "Alimentos Saudáveis", value: "Alimentos Saudáveis" },
    { label: "Combos e Kits", value: "Combos e Kits" },
    { label: "Outros", value: "outros" },
  ];

  const handleInputChange = (field, value) => {
    setProduto((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (produtoEdicao) {
      setProduto({
        nome: produtoEdicao.nome || "",
        preco: produtoEdicao.preco || null,
        categoria: produtoEdicao.categoria || null,
        descricao: produtoEdicao.descricao || "",
      });
    } else {
      setProduto(PRODUTO_INICIAL);
    }
  }, [produtoEdicao, visible]);

  const submit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/produtos/${produtoEdicao.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(produto),
        }
      );

      if (!response.ok) throw new Error("Erro ao editar produto");

      const data = await response.json();
      setProduto(PRODUTO_INICIAL);
      onSave(data);
      onHide();
    } catch (error) {
      console.error(error);
      alert("Erro ao editar o produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const formularioValido =
    produto.nome && produto.preco && produto.categoria && produto.descricao;

  return (
    <Dialog
      header="Editar produto"
      visible={visible}
      onHide={onHide}
      modal
      footer={
        <div className={style.botoes}>
          <Button
            className={`${style.botaoCancelar} p-button`}
            label="Cancelar"
            onClick={() => {
              setProduto(PRODUTO_INICIAL);
              onHide();
            }}
          />
          <Button
            label={loading ? "Salvando..." : "Editar"}
            onClick={submit}
            className={`${style.botaoCadastrar} p-button`}
            disabled={!formularioValido || loading}
          />
        </div>
      }
    >
      <div className={style.containerForm}>
        <div className={style.nome}>
          <label htmlFor="nome">
            Nome <span className={style.astec}>*</span>
          </label>
          <InputText
            id="nome"
            name="nome"
            value={produto.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            placeholder="Insira o nome do produto"
          />
        </div>

        <div className={style.precoEcategorias}>
          <div className={style.preco}>
            <label>
              Preço <span className={style.astec}>*</span>
            </label>
            <InputNumber
              name="preco"
              value={produto.preco}
              onValueChange={(e) => handleInputChange("preco", e.value)}
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              placeholder="Inserir preço"
            />
          </div>

          <div className={style.categorias}>
            <label>
              Categoria <span className={style.astec}>*</span>
            </label>
            <Dropdown
              id="categoria"
              name="categoria"
              value={produto.categoria}
              options={categorias}
              onChange={(e) => handleInputChange("categoria", e.value)}
              placeholder="Selecionar"
              className={style.dropdown}
            />
          </div>
        </div>

        <div className={style.descricao}>
          <label htmlFor="descricao">
            Descrição do produto <span className={style.astec}>*</span>
          </label>
          <InputTextarea
            id="descricao"
            value={produto.descricao}
            onChange={(e) => handleInputChange("descricao", e.target.value)}
            rows={1}
            placeholder="Insira uma breve descrição do produto"
          />
        </div>
      </div>
    </Dialog>
  );
}
