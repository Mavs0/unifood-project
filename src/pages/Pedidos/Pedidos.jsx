import React, { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/outline";
import { Tooltip } from "@mui/material";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import ModalAcompanhamentoPedido from "../../components/form/acompanharPedido/AcompanharPedido";
import { getAuthHeaders } from "../../utils/auth";
import styles from "./Pedidos.module.css";

export default function PaginaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  useEffect(() => {
    buscarPedidos();
  }, []);

  async function buscarPedidos() {
    setLoading(true);
    try {
      const res = await fetch(
        "http://127.0.0.1:5001/unifood-aaa0f/us-central1/api/order",
        {
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error("Erro ao buscar pedidos");

      const listaPedidos = await res.json();
      setPedidos(listaPedidos);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  }

  const abrirModal = (pedido) => {
    setPedidoSelecionado(pedido);
    setModalOpen(true);
  };

  const fecharModal = () => setModalOpen(false);

  return (
    <div className={styles.container}>
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <main className={styles.content}>
          <h2 className={styles.title}>Histórico de pedidos</h2>

          {loading ? (
            <p>Carregando pedidos...</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>N° Pedido</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>{pedido.id}</td>
                      <td>{pedido.userId}</td>
                      <td>{pedido.total || "R$ - "}</td>
                      <td>{pedido.status}</td>
                      <td>
                        <Tooltip title="Acompanhar pedido">
                          <button
                            onClick={() => abrirModal(pedido)}
                            className={styles.viewBtn}
                          >
                            <EyeIcon style={{ width: 20, height: 20 }} />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {modalOpen && pedidoSelecionado && (
            <ModalAcompanhamentoPedido
              pedido={pedidoSelecionado}
              onClose={fecharModal}
              recarregar={buscarPedidos}
            />
          )}
        </main>
      </div>
    </div>
  );
}
