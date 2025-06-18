import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { GoogleLogin } from "@react-oauth/google";

import estilos from "./SignupCliente.module.css";

export default function SignUpCliente() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [dados, setDados] = useState({
    nome: "",
    sobrenome: "",
    telefone: "",
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
      !dados.telefone ||
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
      const res = await fetch(
        "http://127.0.0.1:5001/unifood-aaa0f/us-central1/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: dados.nome.trim(),
            lastName: dados.sobrenome.trim(),
            telefone: dados.telefone.trim(),
            email: dados.email.trim().toLowerCase(),
            password: dados.senha,
            role: "cliente",
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao registrar");

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
          <h2>Cadastre-se</h2>
          <p>
            Vamos preparar tudo para que você possa acessar sua conta pessoal.
          </p>

          <div className={estilos.row}>
            <InputText
              placeholder="Nome"
              name="nome"
              value={dados.nome}
              onChange={handleChange}
              className={estilos.input}
            />
            <InputText
              placeholder="Sobrenome"
              name="sobrenome"
              value={dados.sobrenome}
              onChange={handleChange}
              className={estilos.input}
            />
          </div>

          <InputText
            placeholder="Email"
            name="email"
            value={dados.email}
            onChange={handleChange}
            className={estilos.input}
          />

          <InputText
            placeholder="Telefone"
            name="telefone"
            value={dados.telefone}
            onChange={handleChange}
            className={estilos.input}
          />

          <div className={estilos.row}>
            <Password
              placeholder="Senha"
              name="senha"
              value={dados.senha}
              onChange={handleChange}
              feedback={false}
              toggleMask
              className={estilos.input}
            />

            <Password
              placeholder="Confirme sua senha"
              name="confirmarSenha"
              value={dados.confirmarSenha}
              onChange={handleChange}
              feedback={false}
              toggleMask
              className={estilos.input}
            />
          </div>

          <div className={estilos.termos}>
            <input type="checkbox" required /> Eu concordo com todos os{" "}
            <a href="#">Termos</a> e <a href="#">Políticas de Privacidade</a>
          </div>

          <Button type="submit" className={estilos.botao}>
            Criar conta
          </Button>

          <p className={estilos.login}>
            Já possui uma conta? <a href="/login">Login</a>
          </p>

          <div className={estilos.orDivider}>
            <span>Ou faça login com</span>
          </div>

          <div className={estilos.googleBtn}>
            <GoogleLogin onSuccess={responseGoogle} onError={responseGoogle} />
          </div>
        </form>
      </div>
    </div>
  );
}
