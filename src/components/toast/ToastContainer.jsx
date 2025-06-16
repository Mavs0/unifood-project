// components/toast/ToastContainer.jsx
import { useToast } from "./ToastContext";
import Toast from "./Toast";
import styles from "./Toast.module.css";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          tipo={toast.tipo}
          mensagem={toast.mensagem}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
