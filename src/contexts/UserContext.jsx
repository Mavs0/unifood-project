import { createContext, useContext, useEffect, useState } from "react";
import { buscarPerfil } from "../utils/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await buscarPerfil();
        // console.log(data);
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setUserName("Usuário");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useContextUser() {
  return useContext(UserContext);
}
