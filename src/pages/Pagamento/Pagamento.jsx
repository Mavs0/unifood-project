import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import QRCode from "react-qr-code";
import NavBarraSide from "../../components/layout/navBarraSide/NavBarraSide";
import styles from "./Pagamento.module.css";

export default function Pagamento() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [carrinho, setCarrinho] = useState([]);
  const [tipoPagamento, setTipoPagamento] = useState("cartao");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [cupomSelecionado, setCupomSelecionado] = useState(null);

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinhoUsuario"));
    if (carrinhoSalvo && carrinhoSalvo.length > 0) {
      setCarrinho(carrinhoSalvo);
    } else {
      const mock = [
        {
          id: 1,
          nome: "Pizza Calabresa",
          preco: 39,
          loja: "Cantina Campus",
          imagemUrl: "https://via.placeholder.com/100",
          quantidade: 1,
        },
        {
          id: 2,
          nome: "Suco Natural",
          preco: 9,
          loja: "Cantina Campus",
          imagemUrl: "https://via.placeholder.com/100",
          quantidade: 1,
        },
        {
          id: 3,
          nome: "Brownie",
          preco: 12,
          loja: "Doce Uni",
          imagemUrl: "https://via.placeholder.com/100",
          quantidade: 1,
        },
      ];
      setCarrinho(mock);
      localStorage.setItem("carrinhoUsuario", JSON.stringify(mock));
    }
  }, []);

  const cuponsUsuario = JSON.parse(localStorage.getItem("cuponsUsuario")) || [];
  const cuponsDisponiveis = [...cuponsUsuario];

  const aumentarQuantidade = (id) => {
    const atualizado = carrinho.map((item) =>
      item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
    );
    setCarrinho(atualizado);
    localStorage.setItem("carrinhoUsuario", JSON.stringify(atualizado));
  };

  const diminuirQuantidade = (id) => {
    const atualizado = carrinho.map((item) =>
      item.id === id && item.quantidade > 1
        ? { ...item, quantidade: item.quantidade - 1 }
        : item
    );
    setCarrinho(atualizado);
    localStorage.setItem("carrinhoUsuario", JSON.stringify(atualizado));
  };

  const removerProduto = (id) => {
    const atualizado = carrinho.filter((item) => item.id !== id);
    setCarrinho(atualizado);
    localStorage.setItem("carrinhoUsuario", JSON.stringify(atualizado));
  };

  const aplicarCupom = (cupom) => {
    setCupomSelecionado(cupom);
    toast.current.show({
      severity: "info",
      summary: "Cupom aplicado",
      detail: `${cupom.descricao}`,
      life: 3000,
    });
  };

  const calcularTotal = () => {
    let total = carrinho.reduce(
      (sum, item) => sum + item.preco * item.quantidade,
      0
    );

    if (cupomSelecionado) {
      if (cupomSelecionado.tipo === "percentual") {
        total -= (total * cupomSelecionado.valor) / 100;
      } else if (cupomSelecionado.tipo === "fixo") {
        total -= cupomSelecionado.valor;
      }
    }

    return total > 0 ? total : 0;
  };

  const finalizarCompra = () => {
    toast.current.show({
      severity: "success",
      summary: "Compra concluída!",
      detail: "Obrigado por comprar com a UniFood.",
      life: 3000,
    });

    localStorage.removeItem("carrinhoUsuario");

    setTimeout(() => {
      navigate("/comidas");
    }, 3200);
  };

  const valorTotal = calcularTotal();

  return (
    <div className="flex">
      <NavBarraSide />
      <div className={styles.gridContainer}>
        <Toast ref={toast} />

        {/* Coluna Resumo */}
        <div className={styles.colResumo}>
          <h2>Resumo do Pedido</h2>
          {carrinho.length > 0 ? (
            carrinho.map((produto) => (
              <div key={produto.id} className={styles.cardResumo}>
                <img src={produto.imagemUrl} alt={produto.nome} />
                <div>
                  <p>
                    <strong>{produto.nome}</strong>
                  </p>
                  <p>Loja: {produto.loja}</p>
                  <p>Preço: R${produto.preco.toFixed(2)}</p>
                  <div className={styles.quantidadeControls}>
                    <Button
                      label="-"
                      onClick={() => diminuirQuantidade(produto.id)}
                      className="p-button-outlined p-button-danger"
                    />
                    <span>{produto.quantidade}</span>
                    <Button
                      label="+"
                      onClick={() => aumentarQuantidade(produto.id)}
                      className="p-button-outlined p-button-success"
                    />
                  </div>
                </div>
                <Button
                  icon="pi pi-times"
                  className={styles.btnRemove}
                  onClick={() => removerProduto(produto.id)}
                />
              </div>
            ))
          ) : (
            <p>Seu carrinho está vazio.</p>
          )}
          <p>
            <strong>Total:</strong> R${valorTotal.toFixed(2)}
          </p>
        </div>

        {/* Coluna Pagamento */}
        <div className={styles.colPagamento}>
          <h2>Tipo de Pagamento</h2>

          <div className={styles.radioGroup}>
            {["cartao", "pix", "dinheiro"].map((tipo) => (
              <div key={tipo}>
                <RadioButton
                  inputId={tipo}
                  name="pagamento"
                  value={tipo}
                  onChange={(e) => setTipoPagamento(e.value)}
                  checked={tipoPagamento === tipo}
                />
                <label htmlFor={tipo}>
                  {tipo === "cartao"
                    ? "Cartão de Crédito/Débito"
                    : tipo.toUpperCase()}
                </label>
              </div>
            ))}
          </div>

          {/* Cupons dentro da área de pagamento */}
          {cuponsDisponiveis.length > 0 && (
            <div className={styles.cuponsWrapper}>
              <h3>Meus Cupons Disponíveis 🎁</h3>
              <ul className={styles.listaCupons}>
                {cuponsDisponiveis.map((cupom) => (
                  <li
                    key={cupom.id}
                    className={`${styles.cupomItem} ${
                      cupomSelecionado?.id === cupom.id
                        ? styles.selecionado
                        : ""
                    }`}
                    onClick={() => aplicarCupom(cupom)}
                  >
                    {cupom.descricao}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tipoPagamento === "cartao" && (
            <div>
              <div className={styles.inputGroup}>
                <label>Número do Cartão</label>
                <InputText
                  value={numeroCartao}
                  onChange={(e) => setNumeroCartao(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Nome no Cartão</label>
                <InputText
                  value={nomeCartao}
                  onChange={(e) => setNomeCartao(e.target.value)}
                />
              </div>
              <div className={styles.flex}>
                <div className={styles.inputGroup}>
                  <label>Validade</label>
                  <InputText
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>CVV</label>
                  <InputText
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {tipoPagamento === "pix" && (
            <div className={styles.qrCodeContainer}>
              <p>Escaneie o QR Code para pagar via PIX:</p>
              <QRCode
                value={`Pagamento UniFood - Total: R$${valorTotal.toFixed(2)}`}
                size={180}
              />
            </div>
          )}

          {tipoPagamento === "dinheiro" && (
            <p>O pagamento será feito na entrega.</p>
          )}

          <Button
            label="Finalizar Compra"
            icon="pi pi-check"
            className={styles.btnFinalizar}
            onClick={finalizarCompra}
          />
        </div>
      </div>
    </div>
  );
}
