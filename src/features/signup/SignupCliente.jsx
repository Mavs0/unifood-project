import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { GoogleLogin } from "@react-oauth/google";

import { registrarUsuario } from "../../utils/api";
import estilos from "./SignupCliente.module.css";

export default function SignUpCliente() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [dados, setDados] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  }

  function validar() {
    if (
      !dados.nome ||
      !dados.sobrenome ||
      !dados.email ||
      !dados.senha ||
      !dados.confirmarSenha
    ) {
      return "Preencha todos os campos.";
    }
    if (dados.senha !== dados.confirmarSenha) {
      return "As senhas não coincidem.";
    }
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    const erro = validar();
    if (erro) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: erro,
      });
      return;
    }

    try {
      await registrarUsuario({
        firstName: dados.nome.trim(),
        lastName: dados.sobrenome.trim(),
        email: dados.email.trim().toLowerCase(),
        password: dados.senha,
        role: "cliente",
      });

      toast.current.show({
        severity: "success",
        summary: "Cadastro feito!",
        detail: "Você será redirecionado...",
      });

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Falha no cadastro",
        detail: err.message,
      });
    }
  }

  const responseGoogle = (response) => {
    console.log(response);
  };

  return (
    <div className={estilos.container}>
      <Toast ref={toast} />
      <div className={estilos.formWrapper}>
        <h2 className={estilos.titulo}>Cadastro de Cliente</h2>
        <form onSubmit={submit} className={estilos.form}>
          <div className={estilos.formRow}>
            <div className={estilos.inputGroup}>
              <label>Nome</label>
              <InputText
                name="nome"
                value={dados.nome}
                onChange={handleChange}
                placeholder="Digite seu nome"
                className="p-inputtext-lg"
              />
            </div>
            <div className={estilos.inputGroup}>
              <label>Sobrenome</label>
              <InputText
                name="sobrenome"
                value={dados.sobrenome}
                onChange={handleChange}
                placeholder="Digite seu sobrenome"
                className="p-inputtext-lg"
              />
            </div>
          </div>
          <div className={estilos.formRow}>
            <div className={estilos.inputGroup}>
              <label>Email</label>
              <InputText
                name="email"
                value={dados.email}
                onChange={handleChange}
                placeholder="Digite seu email"
                className="p-inputtext-lg"
              />
            </div>
          </div>

          <div className={estilos.passwordGroup}>
            <label>Senha</label>
            <Password
              name="senha"
              value={dados.senha}
              onChange={handleChange}
              feedback={false}
              toggleMask
              placeholder="Digite sua senha"
              className={`p-inputtext-lg ${estilos.inputFull}`}
            />
          </div>

          <div className={estilos.passwordGroup}>
            <label>Confirmar Senha</label>
            <Password
              name="confirmarSenha"
              value={dados.confirmarSenha}
              onChange={handleChange}
              feedback={false}
              toggleMask
              placeholder="Confirme sua senha"
              className="p-inputtext-lg"
            />
          </div>

          <Button
            type="submit"
            className={`${estilos.botaoCadastrar} p-button-lg`}
          >
            Cadastrar
          </Button>

          <div className={estilos.divider}>Ou</div>

          <GoogleLogin
            onSuccess={responseGoogle}
            onError={responseGoogle}
            useOneTap
            theme="outline"
            className={`${estilos.googleBtn}`}
          />
        </form>
      </div>
    </div>
  );
}
