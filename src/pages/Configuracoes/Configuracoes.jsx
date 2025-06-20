import React, { useState } from "react";
import styles from "./Configuracoes.module.css";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";

export default function ConfigPerfil() {
  const [dados, setDados] = useState({
    nome: "Raquel Silva",
    email: "raquel.silva@gmail.com",
    telefone: "(11) 91234-5678",
    cep: "04567-000",
    logradouro: "Rua das Flores",
    numero: "123",
    complemento: "",
    bairro: "Centro",
    cidade: "São Paulo",
    uf: "SP",
    notificacoes: true,
    tema: "Claro",
    cartaoTipo: "Mastercard",
    nomeCartao: "RAQUEL SILVA",
    formaPagamento: "Cartão",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const temas = [
    { label: "Claro", value: "Claro" },
    { label: "Escuro", value: "Escuro" },
  ];
  const bandeirasCartao = [
    { label: "Mastercard", value: "Mastercard" },
    { label: "Visa", value: "Visa" },
    { label: "Elo", value: "Elo" },
    { label: "Amex", value: "Amex" },
    { label: "Hipercard", value: "Hipercard" },
  ];
  const formasPagamento = [
    { label: "Cartão", value: "Cartão" },
    { label: "PIX", value: "PIX" },
    { label: "Dinheiro", value: "Dinheiro" },
  ];

  const emailValido = /\S+@\S+\.\S+/.test(dados.email);

  const handleChange = (field, value) => {
    setDados((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.layout}>
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <h2 className={styles.title}>Configurações de Perfil</h2>
        <div className={styles.formWrapper}>
          {/* Coluna Esquerda - Dados Pessoais */}
          <div className={styles.coluna}>
            <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
            <label>Nome</label>
            <InputText
              className={styles.input}
              value={dados.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />

            <label>Email</label>
            <InputText
              className={styles.input}
              value={dados.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {!emailValido && (
              <small className={styles.helperTextErro}>
                Digite um e-mail válido.
              </small>
            )}

            <div className={styles.checkboxWrapper}>
              <Checkbox
                checked={dados.notificacoes}
                onChange={(e) => handleChange("notificacoes", e.checked)}
              />
              <span>Quero receber notificações por e-mail</span>
            </div>

            <label>Telefone</label>
            <InputText
              className={styles.input}
              value={dados.telefone}
              onChange={(e) => handleChange("telefone", e.target.value)}
            />

            <label>CEP</label>
            <InputText
              className={styles.input}
              value={dados.cep}
              onChange={(e) => handleChange("cep", e.target.value)}
            />

            <label>Endereço</label>
            <InputText
              placeholder="Logradouro"
              className={styles.input}
              value={dados.logradouro}
              onChange={(e) => handleChange("logradouro", e.target.value)}
            />

            <div className={styles.row}>
              <InputText
                placeholder="Número"
                value={dados.numero}
                onChange={(e) => handleChange("numero", e.target.value)}
                className={styles.inputMetade}
              />
              <InputText
                placeholder="Complemento"
                value={dados.complemento}
                onChange={(e) => handleChange("complemento", e.target.value)}
                className={styles.inputMetade}
              />
            </div>

            <div className={styles.row}>
              <InputText
                placeholder="Bairro"
                value={dados.bairro}
                onChange={(e) => handleChange("bairro", e.target.value)}
                className={styles.inputMetade}
              />
              <InputText
                placeholder="Cidade"
                value={dados.cidade}
                onChange={(e) => handleChange("cidade", e.target.value)}
                className={styles.inputMetade}
              />
            </div>

            <label>Estado (UF)</label>
            <InputText
              className={styles.input}
              value={dados.uf}
              onChange={(e) => handleChange("uf", e.target.value)}
            />

            <label>Tema Preferido</label>
            <Dropdown
              value={dados.tema}
              options={temas}
              onChange={(e) => handleChange("tema", e.value)}
              className={styles.input}
            />

            <Button
              label="Salvar Perfil"
              className={styles.botaoPerfil}
              icon="pi pi-save"
            />
          </div>

          {/* Coluna Direita - Pagamento e Senha */}
          <div className={styles.coluna}>
            <h3 className={styles.sectionTitle}>Preferências de Pagamento</h3>

            <label>Forma de Pagamento Preferida</label>
            <Dropdown
              value={dados.formaPagamento}
              options={formasPagamento}
              onChange={(e) => handleChange("formaPagamento", e.value)}
              className={styles.input}
            />

            <div className={styles.row}>
              <Dropdown
                value={dados.cartaoTipo}
                options={bandeirasCartao}
                onChange={(e) => handleChange("cartaoTipo", e.value)}
                placeholder="Tipo de Cartão"
                className={styles.inputMetade}
              />
              <InputText
                placeholder="Nome no cartão"
                value={dados.nomeCartao}
                onChange={(e) => handleChange("nomeCartao", e.target.value)}
                className={styles.inputMetade}
              />
            </div>

            <Button
              label="Salvar Dados de Pagamento"
              className={styles.botaoPagamento}
              icon="pi pi-credit-card"
            />

            <h3 className={styles.sectionTitle}>Alterar Senha</h3>
            <InputText
              placeholder="Senha Atual"
              type="password"
              value={dados.senhaAtual}
              onChange={(e) => handleChange("senhaAtual", e.target.value)}
              className={styles.input}
            />

            <div className={styles.row}>
              <Password
                placeholder="Nova Senha"
                value={dados.novaSenha}
                onChange={(e) => handleChange("novaSenha", e.target.value)}
                toggleMask
                className={styles.inputMetade}
              />
              <Password
                placeholder="Confirmar Nova Senha"
                value={dados.confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                toggleMask
                className={styles.inputMetade}
              />
            </div>

            <Button
              label="Alterar Senha"
              className={styles.botaoSenha}
              icon="pi pi-key"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
