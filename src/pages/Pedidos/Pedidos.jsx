import React, { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/outline";
import { Tooltip } from "@mui/material";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import ModalAcompanhamentoPedido from "../../components/form/acompanharPedido/AcompanharPedido";
import { buscarPedidos } from "../../utils/api";
import styles from "./Pedidos.module.css";

export default function PaginaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  useEffect(() => {
    buscarPedidosData();
  }, []);

  async function buscarPedidosData() {
    setLoading(true);
    try {
      const listaPedidos = await buscarPedidos();
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
                      <td>R$ {pedido.total?.toFixed(2) || "-"}</td>
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
              recarregar={buscarPedidosData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
