import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import styles from "./SignupVendedor.module.css";

import { registrarVendedor } from "../../utils/api";

export default function SignupVendedor() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [dados, setDados] = useState({
    nome: "",
    sobrenome: "",
    telefone: "",
    email: "",
    senha: "",
    confirmacaoSenha: "",
    nomeEstabelecimento: "",
    contato: "",
    formaPagamento: "",
    categoria: "",
  });

  const formas = [
    { label: "Pix", value: "pix" },
    { label: "Cartão", value: "cartao" },
    { label: "Dinheiro", value: "dinheiro" },
  ];

  const categorias = [
    { label: "Refeições", value: "refeições" },
    { label: "Lanches", value: "lanches" },
    { label: "Doces e Sobremesas", value: "doces" },
    { label: "Bebidas", value: "bebidas" },
    { label: "Alimentos Saudáveis", value: "saudaveis" },
    { label: "Outros", value: "outros" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  async function submit(e) {
    e.preventDefault();
    if (dados.senha !== dados.confirmacaoSenha) {
      toast.current.show({
        severity: "warn",
        summary: "Senhas diferentes!",
      });
      return;
    }

    try {
      await registrarVendedor({
        firstName: dados.nome,
        lastName: dados.sobrenome,
        telefone: dados.telefone,
        email: dados.email,
        password: dados.senha,
        nomeEstabelecimento: dados.nomeEstabelecimento,
        contato: dados.contato,
        formaPagamento: dados.formaPagamento,
        categorias: [dados.categoria],
      });
      toast.current.show({ severity: "success", summary: "Cadastro feito!" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Erro ao cadastrar",
        detail: err.message,
      });
    }
  }

  return (
    <div className={`${styles.container} darkmode`}>
      <Toast ref={toast} />
      <div className={styles.left}>
        <h2 className={styles.titulo}>Cadastre-se como Vendedor</h2>
        <p className={styles.subtitulo}>
          Preencha seus dados pessoais e do estabelecimento
        </p>

        <h3 className={styles.subtituloSecao}>Informações Pessoais</h3>

        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Nome</label>
              <InputText
                name="nome"
                value={dados.nome}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Sobrenome</label>
              <InputText
                name="sobrenome"
                value={dados.sobrenome}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Telefone</label>
              <InputText
                name="telefone"
                value={dados.telefone}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <InputText
                name="email"
                value={dados.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Senha</label>
              <Password
                name="senha"
                value={dados.senha}
                onChange={handleChange}
                toggleMask
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirmar Senha</label>
              <Password
                name="confirmacaoSenha"
                value={dados.confirmacaoSenha}
                onChange={handleChange}
                toggleMask
              />
            </div>
          </div>

          <h3 className={styles.subtituloSecao}>
            Informações do Estabelecimento
          </h3>

          <div className={`${styles.inputGroup} ${styles.spacing}`}>
            <label>Nome do Estabelecimento</label>
            <InputText
              name="nomeEstabelecimento"
              value={dados.nomeEstabelecimento}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.spacing}`}>
            <label>Contato para Pedidos</label>
            <InputText
              name="contato"
              value={dados.contato}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <div className={`${styles.inputGroup} ${styles.spacing}`}>
              <label>Categoria de Produtos</label>
              <Dropdown
                value={dados.categoria}
                options={categorias}
                onChange={(e) => setDados({ ...dados, categoria: e.value })}
                placeholder="Selecione"
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.spacing}`}>
              <label>Forma de Pagamento</label>
              <Dropdown
                value={dados.formaPagamento}
                options={formas}
                onChange={(e) =>
                  setDados({ ...dados, formaPagamento: e.value })
                }
                placeholder="Selecione"
              />
            </div>
          </div>

          <Button
            type="submit"
            label="Cadastrar"
            className={styles.botaoCadastrar}
          />
        </form>
      </div>

      {/* <div className={styles.right}>
        <img src={ilustracao} alt="Imagem de Vendedor" />
      </div> */}
    </div>
  );
}
