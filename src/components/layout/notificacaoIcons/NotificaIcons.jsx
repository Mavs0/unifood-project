import { useNavigate } from "react-router-dom";
import styles from "./NotificaIcons.module.css";
import { PiBell, PiChatCircleText, PiGift, PiGear } from "react-icons/pi";
import { Tooltip } from "primereact/tooltip";

export default function NotificationIcons() {
  const navigate = useNavigate();

  return (
    <div className={styles.iconGroup}>
      {/* Notificações */}
      <div
        className={`${styles.iconBox} ${styles.lightBlue}`}
        onClick={() => navigate("/notificacoes")}
        data-pr-tooltip="Notificações"
        data-pr-position="bottom"
      >
        <PiBell className={styles.icon} />
        <span className={styles.badge}>3</span>
      </div>

      {/* Recompensas */}
      <div
        className={`${styles.iconBox} ${styles.gray}`}
        onClick={() => navigate("/recompensas")}
        data-pr-tooltip="Recompensas"
        data-pr-position="bottom"
      >
        <PiGift className={styles.iconPresent} />
      </div>

      {/* Configurações */}
      <div
        className={`${styles.iconBox} ${styles.pink}`}
        onClick={() => navigate("/configuracoes")}
        data-pr-tooltip="Configurações"
        data-pr-position="bottom"
      >
        <PiGear className={styles.iconSetting} />
      </div>

      {/* Tooltip global */}
      <Tooltip target={`.${styles.iconBox}`} />
    </div>
  );
}
