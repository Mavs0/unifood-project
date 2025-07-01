import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { GoogleLogin } from "@react-oauth/google";
import { loginUsuario } from "../../utils/api";
import estilos from "./Signin.module.css";

export default function SignIn() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [dados, setDados] = useState({ email: "", senha: "" });
  const [erros, setErros] = useState({ email: "", senha: "" });

  const handleChange = (field, value) => {
    setDados((prev) => ({ ...prev, [field]: value }));
    setErros((prev) => ({ ...prev, [field]: "" }));
  };

  const validar = () => {
    let valido = true;
    const novosErros = { email: "", senha: "" };

    if (!dados.email) {
      novosErros.email = "O campo e-mail é obrigatório.";
      valido = false;
    }

    if (!dados.senha) {
      novosErros.senha = "O campo senha é obrigatório.";
      valido = false;
    }

    setErros(novosErros);
    return valido;
  };

  async function submit(e) {
    e.preventDefault();
    if (!validar()) return;

    try {
      await loginUsuario(dados.email, dados.senha);
      toast.current.show({ severity: "success", summary: "Login feito!" });
      navigate("/comidas");
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Erro no Login",
        detail: error.message || "E-mail ou senha inválidos.",
      });
    }
  }

  const responseGoogle = (response) => {
    toast.current.show({
      severity: "info",
      summary: "Google Login",
      detail: "Funcionalidade em desenvolvimento.",
    });
    console.log(response);
  };

  return (
    <div className={estilos.container}>
      <Toast ref={toast} />
      <div className={estilos.card}>
        <h1 className={estilos.titulo}>Login</h1>
        <form onSubmit={submit} className={estilos.form}>
          <label htmlFor="email">E-mail</label>
          <InputText
            id="email"
            value={dados.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Digite seu e-mail"
            className={`${estilos.input} ${erros.email && estilos.inputErro}`}
          />
          {erros.email && (
            <small className={estilos.mensagemErro}>{erros.email}</small>
          )}

          <label htmlFor="senha">Senha</label>
          <Password
            id="senha"
            value={dados.senha}
            onChange={(e) => handleChange("senha", e.target.value)}
            placeholder="Digite sua senha"
            toggleMask
            feedback={false}
            className={`${estilos.input} ${erros.senha && estilos.inputErro}`}
          />
          {erros.senha && (
            <small className={estilos.mensagemErro}>{erros.senha}</small>
          )}

          <Button
            type="submit"
            label="Entrar"
            className={estilos.botaoCadastrar}
          />

          <div className={estilos.divider}>Ou</div>

          <GoogleLogin
            onSuccess={responseGoogle}
            onError={responseGoogle}
            useOneTap
            theme="outline"
            className={estilos.googleBtn}
          />
        </form>
      </div>
    </div>
  );
}
