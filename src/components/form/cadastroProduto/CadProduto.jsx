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
import { criarProduto } from "../../../utils/api";

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
  const [uploadProgress, setUploadProgress] = useState(null);

  // const categorias = [
  //   { label: "Refeições", value: "refeições" },
  //   { label: "Lanches", value: "lanches" },
  //   { label: "Doces e Sobremesas", value: "Doces e Sobremesas" },
  //   { label: "Bebidas", value: "bebidas" },
  //   { label: "Alimentos Saudáveis", value: "Alimentos Saudáveis" },
  //   { label: "Combos e Kits", value: "Combos e Kits" },
  //   { label: "Outros", value: "outros" },
  // ];

  const nomeInputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => nomeInputRef.current?.focus(), 200);
    } else {
      resetarForm();
    }
  }, [visible]);

  const resetarForm = () => {
    setProduto(PRODUTO_INICIAL);
    setTouched({});
    setUploadProgress(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadProgress(0);

        const reader = new FileReader();
        reader.onload = () => {
          setProduto((prev) => ({ ...prev, imagemUrl: reader.result }));
          setUploadProgress(100);
        };

        const fakeProgress = () => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            if (progress >= 90) clearInterval(interval);
            setUploadProgress(progress);
          }, 100);
        };

        fakeProgress();
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
    // validaCampo("categoria") &&
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

    const payload = {
      nome: produto.nome,
      preco: produto.preco,
      descricao: produto.descricao,
      sellerId: usuario.uid,
      imagemUrl: produto.imagemUrl || "https://via.placeholder.com/150",
      // categorias: [produto.categoria],
      estoque: 10,
    };

    try {
      const data = await criarProduto(payload);
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
        detail: "Ocorreu um problema ao salvar.",
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

  const classErro = (field) =>
    touched[field] && !validaCampo(field) ? styles.inputErro : "";

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Cadastrar produto"
        visible={visible}
        onHide={onHide}
        modal
        style={{ width: "450px" }}
        footer={
          <div className={styles.botoes}>
            <Button
              type="button"
              className={`p-button-secondary ${styles.botaoCancelar}`}
              label="Cancelar"
              onClick={onHide}
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
            <label>
              Nome <span className={styles.astec}>*</span>
            </label>
            <InputText
              value={produto.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              ref={nomeInputRef}
            />
          </div>

          <div className={styles.precoEcategorias}>
            <div className={`${styles.preco} ${classErro("preco")}`}>
              <label>
                Preço <span className={styles.astec}>*</span>
              </label>
              <InputNumber
                value={produto.preco}
                onValueChange={(e) => handleChange("preco", e.value)}
                mode="currency"
                currency="BRL"
                locale="pt-BR"
                min={0}
              />
            </div>

            {/* <div className={`${styles.categorias} ${classErro("categoria")}`}>
              <label>
                Categoria <span className={styles.astec}>*</span>
              </label>
              <Dropdown
                value={produto.categoria}
                options={categorias}
                onChange={(e) => handleChange("categoria", e.value)}
                placeholder="Selecione"
              />
            </div> */}
          </div>

          <div className={`${styles.descricao} ${classErro("descricao")}`}>
            <label>
              Descrição <span className={styles.astec}>*</span>
            </label>
            <InputTextarea
              value={produto.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              rows={3}
              placeholder="Breve descrição..."
            />
          </div>

          <div className={styles.imagem}>
            <label>
              Imagem do produto <span className={styles.astec}>*</span>
            </label>

            {!produto.imagemUrl && (
              <div
                {...getRootProps()}
                className={`${styles.dropzone} ${
                  isDragActive ? styles.ativo : ""
                }`}
              >
                <input {...getInputProps()} />
                <p className={styles.uploadTexto}>
                  <span className={styles.uploadIcone}>📤</span>
                  Arraste ou clique para fazer upload
                </p>
                <p className={styles.detalhesUpload}>
                  Tipos aceitos: JPG, PNG | Máx: 5MB
                </p>
              </div>
            )}

            {uploadProgress !== null && (
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {produto.imagemUrl && (
              <div className={styles.uploadComImagem}>
                <span className={styles.iconeOk}>✅</span>
                <span className={styles.nomeImagem}>Imagem carregada</span>
                <button
                  type="button"
                  className={styles.botaoRemover}
                  onClick={() => {
                    handleChange("imagemUrl", "");
                    setUploadProgress(null);
                  }}
                  title="Remover imagem"
                >
                  ✖
                </button>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
