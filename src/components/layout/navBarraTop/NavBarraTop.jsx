import styles from "./NavBarraTop.module.css";
import NotificationIcons from "../notificacaoIcons/NotificaIcons";
import UserSection from "../avatarUser/AvatarUser";

export default function NavBarraTop() {
  return (
    <div className={styles.topbarra}>
      <div className={styles.rightIcons}>
        <NotificationIcons />
        <UserSection />
      </div>
    </div>
  );
}
