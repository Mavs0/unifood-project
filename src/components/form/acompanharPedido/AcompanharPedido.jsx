import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import styles from "./AcompanharPedido.module.css";

export default function ModalAcompanhamentoPedido({
  pedido,
  onClose,
  recarregar,
}) {
  const toast = useRef(null);

  const atualizarStatus = (novoStatus) => {
    const pedidosSalvos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const atualizados = pedidosSalvos.map((p) =>
      p.id === pedido.id ? { ...p, status: novoStatus } : p
    );
    localStorage.setItem("pedidos", JSON.stringify(atualizados));
    toast.current.show({
      severity: "success",
      summary: "Status atualizado!",
      detail: `Pedido marcado como ${novoStatus}`,
      life: 3000,
    });
    onClose();
    recarregar();
  };

  return (
    <Dialog
      header={`Pedido #${pedido.id}`}
      visible={true}
      onHide={onClose}
      style={{ width: "50vw" }}
      modal
    >
      <Toast ref={toast} />
      <div className={styles.modalContent}>
        <p>
          <strong>Cliente:</strong> {pedido.user?.firstName}
        </p>
        <p>
          <strong>Status:</strong> {pedido.status}
        </p>

        <h4>Produtos:</h4>
        <table className={styles.produtosTable}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Preço</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.items?.map((item, index) => (
              <tr key={index}>
                <td>{item.nome}</td>
                <td>{item.quantidade}</td>
                <td>R$ {item.preco.toFixed(2)}</td>
                <td>R$ {(item.quantidade * item.preco).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.totalValor}>
          <strong>Total: R$ {pedido.total?.toFixed(2)}</strong>
        </div>

        <div className={styles.botoesModal}>
          {pedido.status !== "entregue" && (
            <Button
              label="Marcar como Entregue"
              icon="pi pi-check"
              className="p-button-success"
              onClick={() => atualizarStatus("entregue")}
            />
          )}
          {pedido.status !== "cancelado" && (
            <Button
              label="Cancelar Pedido"
              icon="pi pi-times"
              className="p-button-danger"
              onClick={() => atualizarStatus("cancelado")}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
}
