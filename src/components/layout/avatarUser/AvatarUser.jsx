import { useEffect, useState } from "react";
import { Avatar } from "primereact/avatar";
import styles from "./AvatarUser.module.css";

export default function AvatarUser() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user");
        if (!res.ok) throw new Error("Erro ao buscar usuário");
        const data = await res.json();
        setUserName(data.name || "Usuário");
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setUserName("Usuário");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={styles.userSection}>
      <span className={styles.greeting}>Olá, Manuela</span>
      <Avatar icon="pi pi-user" shape="circle" size="large" />
    </div>
  );
}
