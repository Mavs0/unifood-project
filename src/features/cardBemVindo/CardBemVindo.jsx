import style from "./CardBemVindo.module.css";
import Icone from "../../assets/image/Icone.svg";
import UserOptions from "../userOptions/UserOptions";
//função para usuario fazer escolha de cliente e vendedor
export default function BemVindo() {
  return (
    //card de escolha de perfil na pag bem vindo(cliente ou vendedor)
    <div className={style.formbox}>
      <h2 className={style.bemvindoh2}>Olá,</h2>
      <h2 className={style.bemvindoh2}>Bem-vindo ao UniFood</h2>
      <p className={style.continuarcomo}>Continuar como</p>

      <div className={style.buttonGroup}>
        <UserOptions img={Icone} label={"Cliente"} to={"/clienteCadastro"} />
        <UserOptions img={Icone} label={"Vendedor"} to={"/meusProdutos"} />
      </div>
    </div>
  );
}
