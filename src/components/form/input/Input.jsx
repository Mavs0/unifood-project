import { InputMask } from "primereact/inputmask";
import style from "./Input.module.css";

export default function Input({
  type,
  text,
  name,
  placeholder,
  handleOnChange,
  value,
  customClass,
  checked,
  mask,
}) {
  const inputProps = {
    type,
    name,
    id: name,
    placeholder,
    onChange: handleOnChange,
    className: `${style.input} ${customClass ? style[customClass] : ""}`,
  };

  // Campo com máscara
  if (mask) {
    return (
      <div className={style.input_container}>
        {text && <label htmlFor={name}>{text}</label>}
        <InputMask mask={mask} value={value} {...inputProps} />
      </div>
    );
  }

  // Campo normal (input ou checkbox)
  return (
    <div className={style.input_container}>
      {text && <label htmlFor={name}>{text}</label>}
      <input
        {...inputProps}
        value={type !== "checkbox" ? value : undefined}
        checked={type === "checkbox" ? checked : undefined}
      />
    </div>
  );
}
