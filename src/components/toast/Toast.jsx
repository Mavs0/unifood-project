import styles from "./Toast.module.css";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";

export default function Toast({ tipo, mensagem, onClose }) {
  return (
    <div className={`${styles.toast} ${styles[tipo]}`}>
      <span className={styles.icon}>
        {tipo === "erro" ? <MdErrorOutline /> : <MdCheckCircleOutline />}
      </span>
      <span className={styles.message}>{mensagem}</span>
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Fechar toast"
      >
        <IoClose />
      </button>
    </div>
  );
}
