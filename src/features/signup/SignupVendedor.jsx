import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import estilos from "./SignupVendedor.module.css";

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
  });

  const formas = [
    { label: "Pix", value: "pix" },
    { label: "Cartão", value: "cartao" },
    { label: "Dinheiro", value: "dinheiro" },
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
        {/* Campos de nome, email, etc */}
        <Dropdown
          value={dados.formaPagamento}
          options={formas}
          onChange={(e) => setDados({ ...dados, formaPagamento: e.value })}
          placeholder="Escolha a forma de pagamento"
        />
        <Button type="submit" label="Cadastrar" />
      </form>
    </div>
  );
}
