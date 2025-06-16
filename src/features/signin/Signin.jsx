import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import estilos from "./SignIn.module.css";
// import useToasty from "../context/ToastyProvider";

export default function SignIn() {
  const navigate = useNavigate();
  const { addToast } = useToasty();

  const [dados, setDados] = useState({
    email: "",
    senha: "",
    lembreDeMim: false,
  });

  const handleChange = (field, value) => {
    setDados((prev) => ({ ...prev, [field]: value }));
  };

  async function submit(e) {
    e.preventDefault();

    if (!dados.email || !dados.senha) {
      addToast({ tipo: "erro", mensagem: "Preencha todos os campos." });
      return;
    }

    try {
      const res = await fetch(
        "http://127.0.0.1:5001/unifood-aaa0f/us-central1/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: dados.email.trim().toLowerCase(),
            password: dados.senha,
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao fazer login.");

      const storage = dados.lembreDeMim ? localStorage : sessionStorage;
      storage.setItem("token", json.token);
      storage.setItem("refreshToken", json.refreshToken);

      addToast({ tipo: "sucesso", mensagem: "Login realizado com sucesso!" });
      navigate("/meusprodutos");
    } catch (err) {
      addToast({ tipo: "erro", mensagem: err.message });
    }
  }

  return (
    <div className={estilos.formCadastro}>
      <h1 className={estilos.titulo}>Login</h1>
      <form onSubmit={submit}>
        <div className={estilos.emailContainer}>
          <label>Email</label>
          <InputText
            value={dados.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Digite seu e-mail"
            type="email"
          />
        </div>

        <div className={estilos.passwordWrapper}>
          <label>Senha</label>
          <Password
            value={dados.senha}
            onChange={(e) => handleChange("senha", e.target.value)}
            toggleMask
            placeholder="Digite sua senha"
            feedback={false}
          />
        </div>

        <label className={estilos.checkboxContainer}>
          <input
            type="checkbox"
            name="lembreDeMim"
            checked={dados.lembreDeMim}
            onChange={(e) =>
              setDados((prev) => ({
                ...prev,
                lembreDeMim: e.target.checked,
              }))
            }
          />
          Lembrar de mim
        </label>

        <Button
          type="submit"
          label="Entrar"
          className={estilos.botaoCadastrar}
        />
      </form>
    </div>
  );
}
