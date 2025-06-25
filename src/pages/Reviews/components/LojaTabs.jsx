import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./LojaTabs.module.css";

export default function LojaTabs() {
  const navigate = useNavigate();
  const { lojaId } = useParams();
  const location = useLocation();

  const abas = [
    { label: "Avaliação Geral", path: `/reviews/${lojaId}/geral` },
    { label: "Produtos", path: `/reviews/${lojaId}/produtos` },
  ];

  return (
    <div className={styles.tabsWrapper}>
      {abas.map((aba) => {
        const ativo = location.pathname === aba.path;
        return (
          <button
            key={aba.path}
            onClick={() => navigate(aba.path)}
            className={`${styles.tab} ${ativo ? styles.ativo : ""}`}
          >
            {aba.label}
          </button>
        );
      })}
    </div>
  );
}
