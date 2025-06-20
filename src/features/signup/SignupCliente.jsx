import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import estilos from "./SignupCliente.module.css";
import { registrarUsuario } from "../../utils/api";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  async function submit(e) {
    e.preventDefault();
    if (dados.senha !== dados.confirmarSenha) {
      toast.current.show({
        severity: "warn",
        summary: "Senhas diferentes!",
      });
      return;
    }

    try {
      await registrarUsuario({
        firstName: dados.nome,
        lastName: dados.sobrenome,
        telefone: dados.telefone,
        email: dados.email,
        password: dados.senha,
        role: "cliente",
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
    <div className={estilos.container}>
      <Toast ref={toast} />
      <form onSubmit={submit}>
        {/* Campos de nome, email, etc... */}
        <Button type="submit" label="Cadastrar" />
      </form>
    </div>
  );
}
