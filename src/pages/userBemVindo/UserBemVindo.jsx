import style from "./UserBemVindo.module.css";


import CardBemVindo from "../../features/cardBemVindo/CardBemVindo"
import ilustracao from "../../assets/image/cadastro.svg";
import NavLogo from "../../components/layout/navLogo/NavLogo";
   







export default function UserBemVindo(){
    return(

        <div className={style.wrapper}>
            <NavLogo />
            <section className={style.cadastrocontainer}>
                <CardBemVindo />
                <div className={style.img_box}>
                    <img src={ilustracao} alt="Ilustração de cadastro" />
                </div>
                
            </section>
        </div>

        
    )
}
