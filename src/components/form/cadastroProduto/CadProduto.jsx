import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useDropzone } from "react-dropzone";

import { useState, useEffect, useRef } from "react";
import style from "./CadProduto.module.css";
import { getAuthHeaders } from "../../../utils/auth";

export default function FormCadProduto({ visible, onHide, onSave }) {
  const PRODUTO_INICIAL = {
    nome: "",
    preco: null,
    categoria: null,
    descricao: "",
    imagemUrl: "",
    estoque: 1,
  };

  const [produto, setProduto] = useState(PRODUTO_INICIAL);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const nomeInputRef = useRef(null);

  const categorias = [
    { label: "Refeições", value: "refeições" },
    { label: "Lanches", value: "lanches" },
    { label: "Doces e Sobremesas", value: "Doces e Sobremesas" },
    { label: "Bebidas", value: "bebidas" },
    { label: "Alimentos Saudáveis", value: "Alimentos Saudáveis" },
    { label: "Combos e Kits", value: "Combos e Kits" },
    { label: "Outros", value: "outros" },
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          handleChange("imagemUrl", reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
  });

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        nomeInputRef.current?.focus();
      }, 200);
    } else {
      setProduto(PRODUTO_INICIAL);
      setTouched({});
    }
  }, [visible]);

  const handleChange = (field, value) => {
    setProduto((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validaCampo = (field) => {
    switch (field) {
      case "nome":
      case "descricao":
        return produto[field].trim() !== "";
      case "preco":
      case "categoria":
        return produto[field] !== null && produto[field] !== "";
      default:
        return true;
    }
  };

  const formularioValido =
    validaCampo("nome") &&
    validaCampo("preco") &&
    validaCampo("categoria") &&
    validaCampo("descricao");

  const submit = async () => {
    if (!formularioValido) return;

    setLoading(true);
    try {
      const userStorage =
        localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
      const usuario = userStorage ? JSON.parse(userStorage) : null;

      if (!usuario?.uid) {
        alert("Usuário não autenticado.");
        return;
      }

      const body = {
        nome: produto.nome.trim(),
        preco: produto.preco,
        descricao: produto.descricao.trim(),
        sellerId: usuario.uid,
        imagemUrl: produto.imagemUrl || "",
        categorias: [produto.categoria],
        estoque: produto.estoque || 1,
      };

      const res = await fetch(
        "http://127.0.0.1:5001/unifood-aaa0f/us-central1/api/product",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(body),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        console.error(json);
        alert("Erro ao cadastrar produto.");
        return;
      }

      onSave(); // Chama o refresh da listagem de produtos
      onHide();
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar o produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleHide = () => {
    setProduto(PRODUTO_INICIAL);
    setTouched({});
    onHide();
  };

  const classErro = (field) =>
    touched[field] && !validaCampo(field) ? style.inputErro : "";

  return (
    <Dialog
      header="Cadastrar produto"
      visible={visible}
      onHide={handleHide}
      modal
      style={{ width: "450px" }}
      footer={
        <div className={style.botoes}>
          <Button
            type="button"
            label="Cancelar"
            onClick={handleHide}
            className={style.botaoCancelar}
            disabled={loading}
          />
          <Button
            type="button"
            label={loading ? "Salvando..." : "Cadastrar"}
            onClick={submit}
            className={style.botaoCadastrar}
            disabled={!formularioValido || loading}
          />
        </div>
      }
    >
      <div className={style.containerForm}>
        <div className={`${style.nome} ${classErro("nome")}`}>
          <label>Nome *</label>
          <InputText
            value={produto.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            ref={nomeInputRef}
          />
        </div>

        <div className={style.precoEcategorias}>
          <div className={`${style.preco} ${classErro("preco")}`}>
            <label>Preço *</label>
            <InputNumber
              value={produto.preco}
              onValueChange={(e) => handleChange("preco", e.value)}
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              placeholder="Preço"
            />
          </div>

          <div className={`${style.categorias} ${classErro("categoria")}`}>
            <label>Categoria *</label>
            <Dropdown
              value={produto.categoria}
              options={categorias}
              onChange={(e) => handleChange("categoria", e.value)}
              placeholder="Selecione"
              className={style.dropdown}
            />
          </div>
        </div>

        <div className={`${style.descricao} ${classErro("descricao")}`}>
          <label>Descrição *</label>
          <InputTextarea
            value={produto.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            rows={4}
            placeholder="Descrição do produto"
          />
        </div>

        <div className={style.imagem}>
          <label>Imagem</label>
          <div
            {...getRootProps()}
            className={`${style.dropzone} ${isDragActive ? style.ativo : ""}`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Solte a imagem aqui...</p>
            ) : (
              <p>Arraste e solte uma imagem ou clique para escolher.</p>
            )}
          </div>
          {produto.imagemUrl && (
            <div className={style.previewImagem}>
              <img src={produto.imagemUrl} alt="Preview" />
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
