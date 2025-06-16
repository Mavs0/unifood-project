import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import style from "./Signin.module.css";

// Componentes
import Input from "../../components/form/input/Input";
import Submit from "../../components/form/submit/Submit";

// Firebase (somente para Google login e estrutura)
import { auth, db } from "../../../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useToast } from "../../components/toast/ToastContext";

export default function Signin({ txtBtn }) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [dados, setDados] = useState({
    email: "",
    senha: "",
    lembreDeMim: false,
  });

  const [senhaVisivel, setSenhaVisivel] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setDados((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validarFormulario({ email, senha }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !senha)
      return "Por favor, preencha todos os campos obrigatórios.";
    if (!emailRegex.test(email)) return "Por favor, insira um email válido.";
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";

    return null;
  }

  async function loginComGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      await setPersistence(
        auth,
        dados.lembreDeMim ? browserLocalPersistence : browserSessionPersistence
      );

      const result = await signInWithPopup(auth, provider);
      await salvarUsuarioNoFirestore(result.user);

      navigate("/meusprodutos");
    } catch (error) {
      console.error("Erro no login com Google:", error);
      addToast({ tipo: "erro", mensagem: "Erro ao autenticar com o Google." });
    }
  }

  // FAKE DATABASE SIMULADA
  const fakeUsers = [
    {
      uid: "uid-simulada-123",
      email: "manuelavieira732@gmail.com",
      senha: "Badu1234",
      nome: "Usuário Simulado",
      criadoEm: new Date(),
    },
  ];

  const submit = async (e) => {
    e.preventDefault();

    const erro = validarFormulario(dados);
    if (erro) {
      addToast({ tipo: "erro", mensagem: erro });
      return;
    }

    // Simular verificação de credenciais
    const usuarioEncontrado = fakeUsers.find(
      (user) =>
        user.email === dados.email.trim().toLowerCase() &&
        user.senha === dados.senha
    );

    if (usuarioEncontrado) {
      // Simular persistência (como browserLocalPersistence)
      if (dados.lembreDeMim) {
        localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
      } else {
        sessionStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
      }

      addToast({ tipo: "sucesso", mensagem: "Login realizado com sucesso!" });

      setTimeout(() => {
        navigate("/meusprodutos");
      }, 1000);
    } else {
      addToast({ tipo: "erro", mensagem: "Email ou senha inválidos." });
    }
  };

  const irParaBemvindo = () => {
    navigate("/bemvindo");
  };

  return (
    <form className={style.formCadastro} onSubmit={submit}>
      <h2 className={style.titulo}>Login</h2>

      {/* Login com Google */}
      <button
        type="button"
        onClick={loginComGoogle}
        className={style.googleBtn}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className={style.googleIcon}
        />
        <span className={style.googleText}>Entrar com Google</span>
      </button>

      <div className={style.divider}>Ou</div>

      {/* Campo de email */}
      <div className={style.emailContainer}>
        <label className={style.labelSenhaEmail}>Email</label>
        <Input
          type="email"
          name="email"
          placeholder="Digite seu email"
          value={dados.email}
          handleOnChange={handleChange}
          customClass="loginEmail"
        />
      </div>

      {/* Campo de senha */}
      <div className={style.passwordWrapper}>
        <label className={style.labelSenhaEmail}>Senha</label>
        <Input
          type={senhaVisivel ? "text" : "password"}
          name="senha"
          placeholder="Digite sua senha"
          value={dados.senha}
          handleOnChange={handleChange}
          customClass="loginSenha"
        />

        <span
          className={style.vizuSenha}
          onClick={() => setSenhaVisivel(!senhaVisivel)}
          style={{ cursor: "pointer" }}
        >
          {senhaVisivel ? (
            <FaEyeSlash className={style.iconVizu} />
          ) : (
            <FaEye className={style.iconVizu} />
          )}
        </span>
      </div>

      <div className={style.senhaMain}>
        <div className={style.checkboxContainer}>
          <Input
            type="checkbox"
            name="lembreDeMim"
            id="lembreDeMim"
            checked={dados.lembreDeMim}
            handleOnChange={handleChange}
            customClass="checkboxLogin"
          />
          <label className={style.lembrar}>Lembrar de mim</label>
        </div>

        <p className={style.esqueceuSenha}>
          <a href="#">Esqueceu a senha?</a>
        </p>
      </div>

      <Submit text={txtBtn} customClass="btnLogin" />

      <p className={style.cadastrarLogin}>
        Sem conta?
        <span onClick={irParaBemvindo} className={style.cadastroConta}>
          {" "}
          Criar uma conta
        </span>
      </p>
    </form>
  );
}
