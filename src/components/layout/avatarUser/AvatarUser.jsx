import { Avatar } from "primereact/avatar";
import styles from "./AvatarUser.module.css";
import { useContextUser } from "../../../contexts/UserContext";

export default function AvatarUser() {
  const { user, loading } = useContextUser();

  return (
    <div className={styles.userSection}>
      <span className={styles.greeting}>
        {loading ? "Carregando..." : `Olá, ${user?.firstName || "Usuário"}`}
      </span>
      <Avatar icon="pi pi-user" shape="circle" size="large" />
    </div>
  );
}
