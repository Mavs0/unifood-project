// ChatMensagens.jsx
import { useEffect, useRef, useState } from "react";
import NavBarraTop from "../../components/layout/navBarraTop/NavBarraTop";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import styles from "./Mensagens.module.css";

const mockConversations = [
  { id: 1, name: "João Cliente", online: true },
  { id: 2, name: "Maria Cliente", online: false },
  { id: 3, name: "Carlos Cliente", online: true },
];

export default function ChatMensagens() {
  const [selectedConv, setSelectedConv] = useState(mockConversations[0]);
  const [mensagens, setMensagens] = useState([
    { autor: "cliente", texto: "Olá, tem bolo ainda?" },
    { autor: "vendedor", texto: "Oi! Tenho sim, quer reservar?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const mensagensRef = useRef(null);

  useEffect(() => {
    mensagensRef.current?.scrollTo({
      top: mensagensRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensagens]);

  const handleSend = () => {
    if (!input.trim()) return;
    const novaMsg = { autor: "vendedor", texto: input };
    setMensagens([...mensagens, novaMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        { autor: "cliente", texto: "Perfeito, quero 2!" },
      ]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className={styles.containerGeral}>
      <NavBarraSide />
      <div className={styles.containerChatPrincipal}>
        <NavBarraTop />
        <div className={styles.chatWrapper}>
          <aside className={styles.sidebarConversas}>
            <h3>Conversas</h3>
            <ul>
              {mockConversations.map((conv) => (
                <li
                  key={conv.id}
                  className={
                    selectedConv.id === conv.id
                      ? styles.conversaAtiva
                      : styles.conversa
                  }
                  onClick={() => setSelectedConv(conv)}
                >
                  <span>{conv.name}</span>
                  <span
                    className={
                      conv.online ? styles.statusOnline : styles.statusOffline
                    }
                  ></span>
                </li>
              ))}
            </ul>
          </aside>

          <section className={styles.areaMensagens}>
            <div className={styles.topoConversa}>
              <strong>{selectedConv.name}</strong>
            </div>
            <div className={styles.historicoMensagens} ref={mensagensRef}>
              {mensagens.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.autor === "vendedor"
                      ? styles.mensagemEnviada
                      : styles.mensagemRecebida
                  }
                >
                  <p>{msg.texto}</p>
                </div>
              ))}
              {typing && (
                <div className={styles.mensagemRecebida}>
                  <p>Digitando...</p>
                </div>
              )}
            </div>

            <div className={styles.areaInput}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>Enviar</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
