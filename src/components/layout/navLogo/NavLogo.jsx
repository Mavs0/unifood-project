import Container from "../container/Container"
import style from "./NavLogo.module.css"

export default function NavLogo(){
    return(
        <nav className={style.nav_logo}>
            <Container customClass="header">
                <div className={style.LogoUnifood}>
                    Uni<span className={style.food} >food</span>
                </div>
            </Container>
        </nav>
    )
}