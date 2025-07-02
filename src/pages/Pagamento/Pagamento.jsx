import React, { useState, useEffect } from "react";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import styles from "./Pagamento.module.css";
import QRCode from "react-qr-code";

export default function Pagamento() {
  const [metodo, setMetodo] = useState("cartao");
  const [cartao, setCartao] = useState({ numero: "", validade: "", nome: "" });
  const [pedido, setPedido] = useState({ items: [], total: 0 });
  const [cupons, setCupons] = useState([]);
  const [cupomSelecionado, setCupomSelecionado] = useState(null);
  const [mensagemErro, setMensagemErro] = useState("");
  const [qrCodePix] = useState("https://pix.qr.code.exemplo");

  useEffect(() => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const total = carrinho.reduce(
      (sum, item) => sum + item.preco * item.quantidade,
      0
    );
    setPedido({ items: carrinho, total });

    const meusCupons = JSON.parse(localStorage.getItem("cupons")) || [];
    setCupons(meusCupons);
  }, []);

  const aplicarCupom = (cupom) => {
    setCupomSelecionado(cupom);
  };

  const finalizar = () => {
    try {
      const pedidosSalvos = JSON.parse(localStorage.getItem("pedidos")) || [];

      const novoPedido = {
        id: Date.now(),
        data: new Date().toLocaleString(),
        items: pedido.items,
        total: cupomSelecionado
          ? (pedido.total * (1 - cupomSelecionado.discount)).toFixed(2)
          : pedido.total.toFixed(2),
        metodoPagamento: metodo,
        cupom: cupomSelecionado,
        status: "Pendente",
      };

      localStorage.setItem(
        "pedidos",
        JSON.stringify([...pedidosSalvos, novoPedido])
      );
      localStorage.removeItem("carrinho");
      alert("Compra finalizada com sucesso!");
      window.location.href = "/pedidos";
    } catch (err) {
      setMensagemErro("Erro ao simular pedido");
    }
  };

  const renderPagamento = () => {
    switch (metodo) {
      case "cartao":
        return (
          <>
            <div className={styles.cartaoVisual}>
              <p>**** **** **** {cartao.numero.slice(-4)}</p>
              <p>Válido até {cartao.validade}</p>
              <p>{cartao.nome}</p>
            </div>
            <input
              type="text"
              placeholder="Número do cartão"
              value={cartao.numero}
              onChange={(e) => setCartao({ ...cartao, numero: e.target.value })}
            />
            <input
              type="text"
              placeholder="Validade"
              value={cartao.validade}
              onChange={(e) =>
                setCartao({ ...cartao, validade: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Nome do Titular"
              value={cartao.nome}
              onChange={(e) => setCartao({ ...cartao, nome: e.target.value })}
            />
          </>
        );
      case "pix":
        return (
          <div className={styles.qrcodeWrapper}>
            <QRCode value={qrCodePix} className={styles.qrcodeImg} />
          </div>
        );
      case "dinheiro":
        return (
          <p style={{ marginTop: "1rem" }}>
            O pagamento será feito em dinheiro na entrega. Prepare o valor
            exato, se possível.
          </p>
        );
    }
  };

  return (
    <div className={styles.container}>
      <NavBarraSide />
      <main className={styles.mainContent}>
        <section className={styles.colunaResumo}>
          <h2 className={styles.titulo}>Resumo do Pedido</h2>
          {pedido.items.map((item, idx) => (
            <div key={idx} className={styles.cardProduto}>
              <img
                src={item.imagemUrl}
                alt={item.nome}
                className={styles.imagemProduto}
              />
              <div className={styles.infoProduto}>
                <strong>{item.nome}</strong>
                <span>
                  {item.quantidade}x R$ {item.preco}
                </span>
              </div>
            </div>
          ))}
          <div className={styles.totalWrapper}>
            <span>Total:</span>
            <span>
              R${" "}
              {cupomSelecionado
                ? (pedido.total * (1 - cupomSelecionado.discount)).toFixed(2)
                : pedido.total.toFixed(2)}
            </span>
          </div>

          <h3 className={styles.subtitulo}>Cupons Disponíveis</h3>
          <div className={styles.cuponsWrapper}>
            {cupons.map((cupom) => (
              <button
                key={cupom.id}
                className={`${styles.cupomBtn} ${
                  cupomSelecionado?.id === cupom.id
                    ? styles.cupomSelecionado
                    : ""
                }`}
                onClick={() => aplicarCupom(cupom)}
              >
                {cupom.descricao || `${cupom.discount * 100}% de desconto`}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.colunaPagamento}>
          <h2 className={styles.titulo}>Pagamento</h2>
          <div className={styles.metodosWrapper}>
            <label>
              <input
                type="radio"
                checked={metodo === "cartao"}
                onChange={() => setMetodo("cartao")}
              />{" "}
              Cartão
            </label>
            <label>
              <input
                type="radio"
                checked={metodo === "pix"}
                onChange={() => setMetodo("pix")}
              />{" "}
              Pix
            </label>
            <label>
              <input
                type="radio"
                checked={metodo === "dinheiro"}
                onChange={() => setMetodo("dinheiro")}
              />{" "}
              Dinheiro
            </label>
          </div>
          {renderPagamento()}

          <h3 className={styles.subtitulo}>Cupons Disponíveis</h3>
          <div className={styles.cuponsWrapper}>
            {cupons.map((cupom) => (
              <button
                key={cupom.id}
                className={`${styles.cupomBtn} ${
                  cupomSelecionado?.id === cupom.id
                    ? styles.cupomSelecionado
                    : ""
                }`}
                onClick={() => aplicarCupom(cupom)}
              >
                {cupom.descricao || `${cupom.discount * 100}% de desconto`}
              </button>
            ))}
          </div>

          <button className={styles.btnFinalizar} onClick={finalizar}>
            Finalizar Compra
          </button>
          {mensagemErro && <p style={{ color: "red" }}>{mensagemErro}</p>}
        </section>
      </main>
    </div>
  );
}
