// Dashboard.jsx
import { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import styles from "./Dashboard.module.css";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [filtro, setFiltro] = useState("total");

  const meses = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const vendasPorMes = [20, 35, 25, 30, 15, 40, 28, 50, 65, 90, 25, 25];
  const valoresPorMes = [70, 80, 10, 90, 30, 50, 90, 20, 100, 95, 85, 0];

  const totalVendas = vendasPorMes.reduce((acc, val) => acc + val, 0);
  const valorTotal = valoresPorMes.reduce((acc, val) => acc + val, 0);
  const lucroEstimado = valorTotal * 0.35;
  const ticketMedio = valorTotal / totalVendas || 0;

  const produtosVendidos = {
    labels: ["Bolo", "Brownie", "Dindin", "Outros"],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: ["#f87171", "#facc15", "#4ade80", "#38bdf8"],
        borderWidth: 0,
      },
    ],
  };

  const configLinha = (label, data, color) => ({
    labels: meses,
    datasets: [
      {
        label,
        data,
        borderColor: color,
        borderWidth: 1.5,
        fill: false,
        tension: 0.3,
      },
    ],
  });

  return (
    <div className={styles.dashboardContainer}>
      <NavBarraSide />
      <div className={styles.mainContent}>
        <NavBarraTop />
        <main className={styles.pageBody}>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <h2 className={styles.title}>
                <span className={styles.titleIcon}>$</span> Relatório de vendas
              </h2>
              <div className={styles.filtroGroup}>
                {["Total", "Mês", "Ano"].map((label) => (
                  <button
                    key={label}
                    onClick={() => setFiltro(label.toLowerCase())}
                    className={`${styles.filtroButton} ${
                      filtro === label.toLowerCase()
                        ? styles.filtroButtonAtivo
                        : ""
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Lucro estimado</h3>
              <p className={styles.cardValue}>
                R${lucroEstimado.toFixed(2).replace(".", ",")}
              </p>
              <p className={styles.cardSubtext}>Considerando margem de 35%</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Ticket médio</h3>
              <p className={styles.cardValue}>
                R${ticketMedio.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>

          <div className={styles.graficoGrid}>
            <div className={styles.cardGrafico}>
              <h3 className={styles.graficoTitle}>Total de vendas</h3>
              <p className={styles.graficoValor}>{totalVendas}</p>
              <Line
                data={configLinha("Vendas realizadas", vendasPorMes, "#f472b6")}
              />
            </div>

            <div className={styles.cardGrafico}>
              <h3 className={styles.graficoTitle}>Produtos Vendidos</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div style={{ width: "100%" }}>
                  <Pie data={produtosVendidos} />
                </div>
                <div className={styles.pizzaLegenda}>
                  {produtosVendidos.labels.map((label, i) => (
                    <span key={i} className={styles.pizzaItem}>
                      <span
                        className={styles.pizzaCor}
                        style={{
                          backgroundColor:
                            produtosVendidos.datasets[0].backgroundColor[i],
                        }}
                      ></span>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${styles.cardGrafico} ${styles.cardGraficoFull}`}>
              <h3 className={styles.graficoTitle}>Valor total de vendas</h3>
              <p className={styles.graficoValor}>
                R${valorTotal.toFixed(2).replace(".", ",")}
              </p>
              <Line
                data={configLinha("Valor vendido", valoresPorMes, "#38bdf8")}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
