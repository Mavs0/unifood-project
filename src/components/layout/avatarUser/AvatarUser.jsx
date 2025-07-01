import { useEffect, useState } from "react";
import { Avatar } from "primereact/avatar";
import styles from "./AvatarUser.module.css";
import { buscarPerfil } from "../../../utils/api";

export default function AvatarUser() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await buscarPerfil();
        setUserName(data.firstName || "Usuário");
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setUserName("Usuário");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={styles.userSection}>
      <span className={styles.greeting}>Olá, {userName}</span>
      <Avatar icon="pi pi-user" shape="circle" size="large" />
    </div>
  );
}
