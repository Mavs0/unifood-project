import style from "./Submit.module.css"


export default function Submit({ text, customClass }) {
  return (
    <div className={style.cont_submit}>
      <button
        type="submit"
        className={`${style.button} ${customClass ? style[customClass] : ''}`}
      >
        {text}
      </button>
    </div>
  );
}