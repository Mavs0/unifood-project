import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

import { useState, useEffect, useRef } from "react";
import style from "./CadProduto.module.css";

// Firebase
import { db } from "/firebase"; // ajuste o caminho se necessário
import { collection, addDoc } from "firebase/firestore";
import { useDropzone } from "react-dropzone";

export default function FormCadProduto({ visible, onHide, onSave }) {
  const PRODUTO_INICIAL = {
    nome: "",
    preco: null,
    categoria: null,
    descricao: "",
    imagemUrl: "",
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

      const produtoComMeta = {
        nome: produto.nome.trim(),
        preco: produto.preco,
        categoria: produto.categoria,
        descricao: produto.descricao.trim(),
        uid: usuario.uid,
        ultimaAtualizacao: new Date().toLocaleString("pt-BR"),
      };

      // Simula ou salva no Firebase:
      try {
        const docRef = await addDoc(collection(db, "produtos"), produtoComMeta);
        onSave({ id: docRef.id, ...produtoComMeta });
      } catch {
        // Simulação com ID falso
        onSave({
          id: Math.random().toString(36).substring(2, 10),
          ...produtoComMeta,
        });
      }

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
            className={`${style.botaoCancelar} p-button p-button-secondary`}
            label="Cancelar"
            onClick={handleHide}
            disabled={loading}
          />
          <Button
            type="button"
            label={loading ? "Salvando..." : "Cadastrar"}
            onClick={submit}
            className={`${style.botaoCadastrar} p-button`}
            disabled={!formularioValido || loading}
          />
        </div>
      }
    >
      <div className={style.containerForm}>
        <div className={`${style.nome} ${classErro("nome")}`}>
          <label htmlFor="nome">
            Nome <span className={style.astec}>*</span>
          </label>
          <InputText
            id="nome"
            value={produto.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            placeholder="Insira o nome do produto"
            aria-invalid={touched.nome && !validaCampo("nome")}
            aria-describedby="nome-error"
            ref={nomeInputRef}
          />
          {touched.nome && !validaCampo("nome") && (
            <small id="nome-error" className={style.erroMsg}>
              Por favor, insira o nome do produto.
            </small>
          )}
        </div>

        <div className={style.precoEcategorias}>
          <div className={`${style.preco} ${classErro("preco")}`}>
            <label htmlFor="preco">
              Preço <span className={style.astec}>*</span>
            </label>
            <InputNumber
              id="preco"
              value={produto.preco}
              onValueChange={(e) => handleChange("preco", e.value)}
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              placeholder="Insira o preço"
              min={0}
            />
          </div>

          <div className={`${style.categorias} ${classErro("categoria")}`}>
            <label htmlFor="categoria">
              Categoria <span className={style.astec}>*</span>
            </label>
            <Dropdown
              id="categoria"
              value={produto.categoria}
              options={categorias}
              onChange={(e) => handleChange("categoria", e.value)}
              placeholder="Selecione"
              className={style.dropdown}
            />
          </div>
        </div>

        <div className={`${style.descricao} ${classErro("descricao")}`}>
          <label htmlFor="descricao">
            Descrição do produto <span className={style.astec}>*</span>
          </label>
          <InputTextarea
            id="descricao"
            value={produto.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            rows={4}
            placeholder="Insira uma breve descrição"
          />
        </div>
        <div className={style.imagem}>
          <label>Imagem do produto</label>

          <div
            {...getRootProps()}
            className={`${style.dropzone} ${isDragActive ? style.ativo : ""}`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Solte a imagem aqui...</p>
            ) : (
              <p>Arraste e solte uma imagem aqui, ou clique para selecionar.</p>
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
