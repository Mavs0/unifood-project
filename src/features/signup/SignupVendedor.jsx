import { useState } from "react";
//import { useNavigate } from 'react-router-dom';

import style from "./SignupVendedor.module.css";

import Input from "../../components/form/input/Input";
import Submit from "../../components/form/submit/Submit";

/* componente para selecionar forma de pagamento*/
import { Dropdown } from "primereact/dropdown";

/*icone de mostrar senha*/
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup({ txtBtn }) {
  const [dados, setDados] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmacaoSenha: "",
    nomeEstabelecimento: "",
    contato: "",
    aceitarTermos: "",
    formaPagamento: "",
  });
  //const navigate = useNavigate();

  /* manipulador genérico de mudanças de inputo*/
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setDados({
      ...dados,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  const [senha, setSenha] = useState(false);
  const [confirmSenha, setConfirmSenha] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setDados((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const validarFormulario = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      Object.entries(dados).some(
        ([key, val]) =>
          key !== "aceitarTermos" && key !== "formaPagamento" && !val
      )
    )
      return "Preencha todos os campos obrigatórios.";

    if (!emailRegex.test(dados.email)) return "Email inválido.";
    if (dados.senha !== dados.confirmacaoSenha)
      return "As senhas não coincidem.";
    if (!dados.aceitarTermos) return "Aceite os termos para continuar.";
    return null;
  };

  async function submit(e) {
    e.preventDefault();

    const erro = validarFormulario();
    if (erro) {
      toast.error(erro);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        dados.email,
        dados.senha
      );
      const user = userCredential.user;

      await setDoc(doc(db, "vendedores", user.uid), {
        nome: dados.nome,
        sobrenome: dados.sobrenome,
        email: dados.email,
        telefone: dados.telefone,
        nomeEstabelecimento: dados.nomeEstabelecimento,
        contato: dados.contato,
        formaPagamento: dados.formaPagamento,
      });

      toast.success("Cadastro realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Erro ao cadastrar: " + error.message);
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "vendedores", user.uid), {
        nome: user.displayName,
        email: user.email,
        telefone: "",
        nomeEstabelecimento: "",
        contato: "",
        formaPagamento: "",
      });

      toast.success("Login com Google realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Erro no login com Google: " + error.message);
    }
  };

  const items = [
    { label: "Pix", value: "pix" },
    { label: "Cartão", value: "cartao" },
    { label: "Dinheiro", value: "dinheiro" },
    { label: "Todos", value: "todos" },
  ];

  return (
    <form className={style.formCadastro} onSubmit={submit}>
      <h2 className={style.titulo}>Cadastre-se</h2>
      <p className={style.subtitulo}>
        Vamos preparar tudo para que você possa acessar sua conta pessoal.
      </p>
      <h4 className={style.subtituloAcesso}>Acesso do vendedor</h4>

      <div className={style.formRow}>
        <Input
          type="text"
          text="Nome"
          name="nome"
          handleOnChange={handleChange}
          value={dados.nome}
          customClass="inputInfoBasicas"
        />
        <Input
          type="text"
          text="Sobrenome"
          name="sobrenome"
          handleOnChange={handleChange}
          value={dados.sobrenome}
          customClass="inputInfoBasicas"
        />
      </div>

      <div className={style.formRow}>
        <Input
          type="email"
          text="Email"
          name="email"
          handleOnChange={handleChange}
          value={dados.email}
          customClass="inputInfoBasicas"
        />
        <Input
          type="tel"
          text="Telefone"
          name="telefone"
          placeholder="(99) 99999-9999"
          handleOnChange={handleChange}
          value={dados.telefone}
          customClass="inputInfoBasicas"
          mask="(99) 99999-9999"
        />
      </div>

      <div className={style.formGroupPassword}>
        <div className={style.passwordWrapper}>
          <Input
            type={senha ? "text" : "password"}
            text="Senha"
            name="senha"
            handleOnChange={handleChange}
            value={dados.senha}
            customClass="inputSenha"
          />
          <span onClick={() => setSenha(!senha)} className={style.vizuSenha}>
            {senha ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className={style.formGroupPassword}>
        <div className={style.passwordWrapper}>
          <Input
            type={confirmSenha ? "text" : "password"}
            text="Confirme sua senha"
            name="confirmacaoSenha"
            handleOnChange={handleChange}
            value={dados.confirmacaoSenha}
            customClass="inputSenha"
          />
          <span
            onClick={() => setConfirmSenha(!confirmSenha)}
            className={style.vizuSenha}
          >
            {confirmSenha ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <h4 className={style.subtituloAcesso}> Dados do estabelecimento</h4>
      <div className={style.formRow}>
        <Input
          type="text"
          text="Nome do Estabelecimento"
          name="nomeEstabelecimento"
          handleOnChange={handleChange}
          value={dados.nomeEstabelecimento}
          customClass="inputInfoBasicas"
        />
        <Input
          type="tel"
          text="Telefone para contato"
          name="contato"
          placeholder="(99) 99999-9999"
          handleOnChange={handleChange}
          value={dados.contato}
          customClass="inputInfoBasicas"
          mask="(99) 99999-9999"
        />
      </div>

      <div className={style.selectItem}>
        <label htmlFor="pag" className={style.labelPagamento}>
          Preferência de pagamento
        </label>
        <Dropdown
          value={dados.formaPagamento}
          onChange={(e) => setDados({ ...dados, formaPagamento: e.value })}
          options={items}
          virtualScrollerOptions={{ itemSize: 38 }}
          className={style.dropdown}
        />
      </div>

      {/* Dados complementares*/}
      <div className={style.checkboxContainer}>
        <Input
          type="checkbox"
          name="aceitarTermos"
          checked={dados.aceitarTermos}
          handleOnChange={handleChange}
          customClass={style.checkedinput}
        />
        <label>
          Eu concordo com todos os{" "}
          <a href="#" className={style.termo}>
            Termos
          </a>{" "}
          e{" "}
          <a href="#" className={style.termo}>
            Políticas de Privacidade
          </a>
        </label>
      </div>

      <Submit text={txtBtn} customClass="btnCriaConta" />

      <p className={style.loginLink}>
        Já possui uma conta? <a href="#">Login</a>
      </p>

      <div className={style.divider}>Ou faça login com</div>

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
    </form>
  );
}
