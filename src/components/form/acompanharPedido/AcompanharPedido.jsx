import React from "react";
import styles from "./AcompanharPedido.module.css";
import { FaCheckSquare } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

export default function ModalAcompanhamentoPedido({ status = 0, onClose }) {
  // status: 0 = aguardando, 1 = a caminho, 2 = entregue
  const etapas = [
    "Aguardando confirmação do vendedor",
    "A caminho",
    "Entregue ;)",
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Acompanhe seu pedido</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <IoClose size={20} />
          </button>
        </div>

        <a href="/detalhesPedido" className={styles.viewDetails}>
          Ver detalhes
        </a>

        <div className={styles.steps}>
          {etapas.map((etapa, index) => (
            <div key={index} className={styles.step}>
              {status >= index ? (
                <FaCheckSquare className={styles.checkIcon} />
              ) : (
                <BiLoaderCircle className={styles.loadingIcon} />
              )}
              <span>{etapa}</span>
            </div>
          ))}
        </div>

        <div className={styles.modalFooter}>
          {status < 2 ? (
            <button className={styles.cancelButton}>Cancelar Pedido</button>
          ) : (
            <button className={styles.reportButton}>
              Não recebi meu pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
