import NavLogo from "../../../components/layout/navLogo/NavLogo";
import style from "./VendedorCadastro.module.css";
import Imagem from "../../../assets/image/Mobile Marketing-pana.svg";
import SignupVendedor from "../../../features/signup/SignupVendedor";

export default function UserCadastro() {
  return (
    <div className={style.usercadastro}>
      <SignupVendedor txtBtn="Criar conta" />
      <NavLogo />
      <div className={style.userform}>
        <div className={style.img_box}>
          <img src={Imagem} alt="Ilustração de cadastro" />
        </div>
      </div>
    </div>
  );
}
