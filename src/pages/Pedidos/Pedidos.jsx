import { useState } from "react";
import { EyeIcon } from "@heroicons/react/outline";
import { Tooltip } from "@mui/material";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import ModalAcompanhamentoPedido from "../../components/form/acompanharPedido/AcompanharPedido";

import styles from "./Pedidos.module.css";

export default function PaginaPedidos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  const pedidos = [
    {
      id: "001",
      cliente: "Harry Potter",
      produtos: "1 brownie, 2 tortas",
      total: "R$ 19,90",
      dataHora: "Terça-feira, 15 de maio de 2020 às 12h40min51s",
      status: "Pendente",
      etapasConcluidas: [true, false, false],
    },
    {
      id: "002",
      cliente: "Steve Jobs",
      produtos: "2 tortilhas, 1 salgadinho",
      total: "R$ 59,90",
      dataHora: "Terça-feira, 15 de maio de 2020 às 12h40min51s",
      status: "Entregue",
      etapasConcluidas: [true, true, true],
    },
  ];

  const abrirModal = (pedido) => {
    setPedidoSelecionado(pedido);
    setModalOpen(true);
  };
  const fecharModal = () => setModalOpen(false);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const buscaMatch =
      pedido.cliente.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      pedido.produtos.toLowerCase().includes(filtroBusca.toLowerCase());
    const statusMatch =
      filtroStatus === "Todos" || pedido.status === filtroStatus;
    return buscaMatch && statusMatch;
  });

  return (
    <div className={styles.container}>
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <main className={styles.content}>
          <h2 className={styles.title}>Histórico de pedidos</h2>

          <div className={styles.filtrosWrapper}>
            <input
              type="text"
              placeholder="Buscar por cliente ou produto..."
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
              className={styles.inputBusca}
            />

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className={styles.selectStatus}
            >
              <option value="Todos">Todos</option>
              <option value="Pendente">Pendentes</option>
              <option value="Entregue">Entregues</option>
              <option value="Cancelado">Cancelados</option>
            </select>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>N° do pedido</th>
                  <th>Cliente</th>
                  <th>Produtos</th>
                  <th>Total</th>
                  <th>Data/Hora</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td>
                    <td>{pedido.cliente}</td>
                    <td>{pedido.produtos}</td>
                    <td>{pedido.total}</td>
                    <td>{pedido.dataHora}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          pedido.status === "Pendente"
                            ? styles.pendente
                            : pedido.status === "Entregue"
                            ? styles.entregue
                            : styles.cancelado
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
        </main>
        {modalOpen && pedidoSelecionado && (
          <ModalAcompanhamentoPedido
            onClose={fecharModal}
            etapas={pedidoSelecionado.etapasConcluidas}
          />
        )}
      </div>
    </div>
  );
}
