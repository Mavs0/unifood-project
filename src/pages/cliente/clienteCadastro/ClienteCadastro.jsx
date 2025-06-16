import NavLogo from "../../../components/layout/navLogo/NavLogo";
import style from "./ClienteCadastro.module.css";
import Imagem from "../../../assets/image/cadastro.svg";
import SignupCliente from "../../../features/signup/SignupCliente";

export default function UserCadastro() {
  return (
    <div className={style.usercadastro}>
      <NavLogo />
      <div className={style.userform}>
        <div className={style.img_box}>
          <img src={Imagem} alt="Ilustração de cadastro" />
        </div>
        <SignupCliente txtBtn="Criar conta" />
      </div>
    </div>
  );
}
//
