import style from "./Container.module.css"

// Ele combina uma classe base ('container') com uma classe personalizada opcional passada via props.
// Também renderiza qualquer conteúdo filho passado entre as tags <Container>...</Container>.


export default function Container({ customClass, children }) {
    return (
        <div className={`${style.container} ${style[customClass]}`}>
            {children}
        </div>
    );
}
