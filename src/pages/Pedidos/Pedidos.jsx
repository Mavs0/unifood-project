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

export default function PaginaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [buscaCliente, setBuscaCliente] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState(null);
  const toast = useRef(null);

  // ✅ useEffect temporário para mock inicial
  useEffect(() => {
    const pedidosExistentes = localStorage.getItem("pedidos");
    if (!pedidosExistentes) {
      // cria pedidos iniciais simulados
      localStorage.setItem("pedidos", JSON.stringify([...pedidosMock]));
    }
    carregarPedidosMock();
  }, []);

  const carregarPedidosMock = () => {
    setLoading(true);

    setTimeout(() => {
      const pedidosSalvos = JSON.parse(localStorage.getItem("pedidos")) || [];
      setPedidos(pedidosSalvos);
      setLoading(false);
    }, 500); // delay simulado
  };

  const abrirModal = (pedido) => {
    setPedidoSelecionado(pedido);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setPedidoSelecionado(null);
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const clienteMatch = pedido.user?.firstName
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
            <InputText
              placeholder="Buscar por cliente..."
              value={buscaCliente}
              onChange={(e) => setBuscaCliente(e.target.value)}
              className={styles.inputBusca}
            />

            <Dropdown
              value={statusSelecionado}
              options={opcoesStatus}
              onChange={(e) => setStatusSelecionado(e.value)}
              placeholder="Filtrar por status"
              className={styles.inputPadraoDropdown}
              showClear
            />
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Carregando pedidos...</p>
            </div>
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
                      <td>{pedido.user?.firstName || "-"}</td>
                      <td>R$ {pedido.total?.toFixed(2) || "-"}</td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            styles[pedido.status]
                          }`}
                        >
                          {pedido.status}
                        </span>
                      </td>
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
              recarregar={carregarPedidosMock}
            />
          )}
        </main>
      </div>
    </div>
  );
}
