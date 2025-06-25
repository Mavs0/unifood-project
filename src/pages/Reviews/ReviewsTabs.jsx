import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import styles from "./ReviewsTabs.module.css";

export default function ReviewsTabs() {
  const { lojaId } = useParams();
  const navigate = useNavigate();

  const tabs = [
    { label: "Avaliação Geral", path: `/reviews/${lojaId}/geral` },
    { label: "Produtos", path: `/reviews/${lojaId}/produtos` },
  ];

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === `/reviews/${lojaId}`) {
      navigate(`/reviews/${lojaId}/geral`);
    }
  }, [lojaId, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.pageBody}>
          <div className={styles.tabsWrapper}>
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  isActive ? `${styles.tab} ${styles.activeTab}` : styles.tab
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>

          <div className={styles.tabContent}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
