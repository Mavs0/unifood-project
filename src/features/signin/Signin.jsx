import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { loginUsuario } from "../../utils/api";
import estilos from "./SignIn.module.css";

export default function SignIn() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [dados, setDados] = useState({
    email: "",
    senha: "",
  });

  const handleChange = (field, value) => {
    setDados((prev) => ({ ...prev, [field]: value }));
  };

  async function submit(e) {
    e.preventDefault();
    try {
      await loginUsuario(dados.email, dados.senha);
      toast.current.show({ severity: "success", summary: "Login feito!" });
      navigate("/comidas");
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Erro no Login",
        detail: error.message,
      });
    }
  }

  return (
    <div className={estilos.formCadastro}>
      <Toast ref={toast} />
      <h1 className={estilos.titulo}>Login</h1>
      <form onSubmit={submit}>
        <InputText
          value={dados.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="E-mail"
        />
        <Password
          value={dados.senha}
          onChange={(e) => handleChange("senha", e.target.value)}
          toggleMask
          placeholder="Senha"
          feedback={false}
        />
        <Button
          type="submit"
          label="Entrar"
          className={estilos.botaoCadastrar}
        />
      </form>
    </div>
  );
}
