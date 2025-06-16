import style from "./UserOptions.module.css"

import { useNavigate } from "react-router-dom"

export default function UserOptions({img, label, to}){
    const navigation = useNavigate();
    //responsavel por direcionar usuaria de acordo com a escolha do seu perfil
    const handlerClick = () => {
        navigation(to);
    }
    return( //card de usuario e vendedor
        <div className={style.option} onClick={handlerClick}>
            <img src={img} alt={label} className={style.avatar} />
            <span className={style.avaterNome}>{label}</span>
        </div>
    )
}