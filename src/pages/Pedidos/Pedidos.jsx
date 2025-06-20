import React, { useEffect, useState, useRef } from "react";
import { EyeIcon } from "@heroicons/react/outline";
import { Tooltip } from "@mui/material";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import ModalAcompanhamentoPedido from "../../components/form/acompanharPedido/AcompanharPedido";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import styles from "./Pedidos.module.css";
import { buscarPedidos } from "../../utils/api";

export default function PaginaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [buscaCliente, setBuscaCliente] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState(null);

  const toast = useRef(null);

  useEffect(() => {
    buscarPedidosData();
  }, []);

  async function buscarPedidosData() {
    setLoading(true);
    try {
      const lista = await buscarPedidos();
      setPedidos(lista);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar os pedidos.",
      });
    } finally {
      setLoading(false);
    }
  }

  const abrirModal = (pedido) => {
    setPedidoSelecionado(pedido);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setPedidoSelecionado(null);
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const clienteMatch = pedido.userId
      ?.toLowerCase()
      .includes(buscaCliente.toLowerCase());
    const statusMatch =
      !statusSelecionado || pedido.status === statusSelecionado;
    return clienteMatch && statusMatch;
  });

  const opcoesStatus = [
    { label: "Todos", value: null },
    { label: "Pendente", value: "pendente" },
    { label: "Entregue", value: "entregue" },
    { label: "Cancelado", value: "cancelado" },
  ];

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <main className={styles.content}>
          <h2 className={styles.title}>Histórico de pedidos</h2>

          <div className={styles.filtrosWrapper}>
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                placeholder="Buscar por cliente..."
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
                className={styles.inputBusca}
              />
            </span>

            <Dropdown
              value={statusSelecionado}
              options={opcoesStatus}
              onChange={(e) => setStatusSelecionado(e.value)}
              placeholder="Filtrar por status"
              className={styles.selectStatus}
              showClear
            />
          </div>

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
                  {pedidosFiltrados.map((pedido) => (
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
