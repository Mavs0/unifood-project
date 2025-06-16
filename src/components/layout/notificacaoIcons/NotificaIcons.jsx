import { useNavigate } from "react-router-dom";
import styles from "./NotificaIcons.module.css";

import { PiBell, PiChatCircleText, PiGift, PiGear } from "react-icons/pi";

export default function NotificationIcons() {
  const navigate = useNavigate();

  return (
    <div className={styles.iconGroup}>
      <div
        className={`${styles.iconBox} ${styles.lightBlue}`}
        onClick={() => navigate("/notificacoes")}
      >
        <PiBell className={styles.icon} />
        <span className={styles.badge}>3</span>
      </div>

      <div
        className={`${styles.iconBox} ${styles.lightBlue}`}
        onClick={() => navigate("/mensagens")}
      >
        <PiChatCircleText className={styles.icon} />
      </div>

      <div
        className={`${styles.iconBox} ${styles.gray}`}
        onClick={() => navigate("/recompensas")}
      >
        <PiGift className={styles.iconPresent} />
      </div>

      <div
        className={`${styles.iconBox} ${styles.pink}`}
        onClick={() => navigate("/configuracoes")}
      >
        <PiGear className={styles.iconSetting} />
      </div>
    </div>
  );
}
