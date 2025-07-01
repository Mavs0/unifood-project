import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { useState, useEffect, useRef } from "react";
import style from "./EditProduto.module.css";
import { atualizarProduto } from "../../../utils/api";

const PRODUTO_INICIAL = {
  nome: "",
  preco: null,
  categoria: null,
  descricao: "",
};

export default function FormEditProduto({
  visible,
  onHide,
  onSave,
  produtoEdicao,
}) {
  const [produto, setProduto] = useState(PRODUTO_INICIAL);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

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
        categoria: produtoEdicao.categorias?.[0] || null,
        descricao: produtoEdicao.descricao || "",
      });
    } else {
      setProduto(PRODUTO_INICIAL);
    }
  }, [produtoEdicao, visible]);

  const submit = async () => {
    if (!produtoEdicao?.id) return;

    setLoading(true);

    try {
      const payload = {
        nome: produto.nome,
        preco: produto.preco,
        descricao: produto.descricao,
        categorias: [produto.categoria],
      };

      const data = await atualizarProduto(produtoEdicao.id, payload);

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Produto atualizado com sucesso!",
        life: 3000,
      });

      onSave(data);
      onHide();
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao editar o produto. Tente novamente.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formularioValido =
    produto.nome && produto.preco && produto.categoria && produto.descricao;

  return (
    <>
      <Toast ref={toast} />
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
              disabled={loading}
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
    </>
  );
}
