import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./CadProduto.module.css";

export default function FormCadProduto({ visible, onHide, onSave }) {
  const toast = useRef(null);

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

  const categorias = [
    { label: "Refeições", value: "refeições" },
    { label: "Lanches", value: "lanches" },
    { label: "Doces e Sobremesas", value: "Doces e Sobremesas" },
    { label: "Bebidas", value: "bebidas" },
    { label: "Alimentos Saudáveis", value: "Alimentos Saudáveis" },
    { label: "Combos e Kits", value: "Combos e Kits" },
    { label: "Outros", value: "outros" },
  ];

  const nomeInputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => nomeInputRef.current?.focus(), 200);
    } else {
      setProduto(PRODUTO_INICIAL);
      setTouched({});
    }
  }, [visible]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => handleChange("imagemUrl", reader.result);
        reader.readAsDataURL(file);
      }
    },
  });

  const handleChange = (field, value) => {
    setProduto((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validaCampo = (field) => {
    if (field === "nome" || field === "descricao")
      return produto[field].trim() !== "";
    if (field === "preco" || field === "categoria")
      return produto[field] !== null && produto[field] !== "";
    return true;
  };

  const formularioValido =
    validaCampo("nome") &&
    validaCampo("preco") &&
    validaCampo("categoria") &&
    validaCampo("descricao");

  const submit = async () => {
    if (!formularioValido) {
      toast.current.show({
        severity: "warn",
        summary: "Campos obrigatórios",
        detail: "Preencha todos os campos obrigatórios.",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    const userStorage =
      localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    const usuario = userStorage ? JSON.parse(userStorage) : null;

    if (!usuario?.uid) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Usuário não autenticado.",
        life: 3000,
      });
      setLoading(false);
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const payload = {
      nome: produto.nome,
      preco: produto.preco,
      descricao: produto.descricao,
      sellerId: usuario.uid,
      imagemUrl: produto.imagemUrl || "https://via.placeholder.com/150",
      categorias: [produto.categoria],
      estoque: 10,
    };

    try {
      const response = await fetch(
        "https://us-central1-unifood-aaa0f.cloudfunctions.net/api/product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar o produto.");
      }

      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Produto cadastrado!",
        life: 3000,
      });

      onSave({
        id: data.id || Math.random().toString(36).substring(2, 10),
        ...payload,
      });

      onHide();
    } catch (error) {
      console.error("Erro geral:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro ao salvar",
        detail:
          "Ocorreu um problema ao salvar. Verifique sua conexão ou fale com o suporte.",
        life: 4000,
      });

      onSave({
        id: Math.random().toString(36).substring(2, 10),
        ...payload,
      });

      onHide();
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
    touched[field] && !validaCampo(field) ? styles.inputErro : "";

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Cadastrar produto"
        visible={visible}
        onHide={handleHide}
        modal
        style={{ width: "450px" }}
        footer={
          <div className={styles.botoes}>
            <Button
              type="button"
              className={`p-button-secondary ${styles.botaoCancelar}`}
              label="Cancelar"
              onClick={handleHide}
              disabled={loading}
            />
            <Button
              type="button"
              label={loading ? "Salvando..." : "Cadastrar"}
              onClick={submit}
              className={styles.botaoCadastrar}
              disabled={!formularioValido || loading}
            />
          </div>
        }
      >
        <div className={styles.containerForm}>
          <div className={`${styles.nome} ${classErro("nome")}`}>
            <label htmlFor="nome">
              Nome <span className={styles.astec}>*</span>
            </label>
            <InputText
              id="nome"
              value={produto.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              ref={nomeInputRef}
            />
          </div>

          <div className={styles.precoEcategorias}>
            <div className={`${styles.preco} ${classErro("preco")}`}>
              <label htmlFor="preco">
                Preço <span className={styles.astec}>*</span>
              </label>{" "}
              <InputNumber
                id="preco"
                value={produto.preco}
                onValueChange={(e) => handleChange("preco", e.value)}
                mode="currency"
                currency="BRL"
                locale="pt-BR"
                min={0}
              />
            </div>

            <div className={`${styles.categorias} ${classErro("categoria")}`}>
              <label htmlFor="categoria">
                Categoria <span className={styles.astec}>*</span>
              </label>{" "}
              <Dropdown
                id="categoria"
                value={produto.categoria}
                options={categorias}
                onChange={(e) => handleChange("categoria", e.value)}
                placeholder="Selecione"
              />
            </div>
          </div>

          <div className={`${styles.descricao} ${classErro("descricao")}`}>
            <label htmlFor="descricao">
              Descrição <span className={styles.astec}>*</span>
            </label>{" "}
            <InputTextarea
              id="descricao"
              value={produto.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              rows={4}
              placeholder="Breve descrição..."
            />
          </div>

          <div className={styles.imagem}>
            <label>
              Imagem do produto <span className={styles.astec}>*</span>
            </label>
            <div
              {...getRootProps()}
              className={`${styles.dropzone} ${
                isDragActive ? styles.ativo : ""
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Solte a imagem aqui...</p>
              ) : (
                <p>Arraste e solte ou clique para selecionar uma imagem.</p>
              )}
            </div>
            {produto.imagemUrl && (
              <div className={styles.previewImagem}>
                <img src={produto.imagemUrl} alt="Preview" />
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
