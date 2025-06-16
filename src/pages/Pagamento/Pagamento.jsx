import { useRef, useState } from "react";
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

  const produto = location.state?.produto || {
    nome: "Produto Exemplo",
    preco: 39,
    loja: "Loja Genérica",
    imagemUrl: "https://via.placeholder.com/100",
  };

  const [tipoPagamento, setTipoPagamento] = useState("cartao");
  const [quantidade, setQuantidade] = useState(1);
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");

  const aumentarQuantidade = () => setQuantidade((prev) => prev + 1);
  const diminuirQuantidade = () =>
    setQuantidade((prev) => (prev > 1 ? prev - 1 : 1));

  const finalizarCompra = () => {
    toast.current.show({
      severity: "success",
      summary: "Compra concluída!",
      detail: "Obrigado por comprar com a UniFood.",
      life: 3000,
    });

    setTimeout(() => {
      navigate("/comidas");
    }, 3200);
  };

  const valorTotal = produto.preco * quantidade;

  return (
    <div className="flex">
      <NavBarraSide />
      <div className={styles.container}>
        <Toast ref={toast} />

        <h2>Pagamento</h2>

        <div className={styles.contentWrapper}>
          <div className={styles.resumoPedido}>
            <h3>Resumo do Pedido</h3>
            <div className={styles.cardResumo}>
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
                    onClick={diminuirQuantidade}
                    className="p-button-outlined p-button-danger"
                  />
                  <span>{quantidade}</span>
                  <Button
                    label="+"
                    onClick={aumentarQuantidade}
                    className="p-button-outlined p-button-success"
                  />
                </div>
              </div>
            </div>
            <p>
              <strong>Frete:</strong> R$0,00
            </p>
            <p>
              <strong>Total:</strong>{" "}
              <span className={styles.total}>R${valorTotal.toFixed(2)}</span>
            </p>
          </div>

          <div className={styles.pagamento}>
            <h3>Tipo de Pagamento</h3>
            <div className={styles.radioGroup}>
              <div>
                <RadioButton
                  inputId="cartao"
                  name="pagamento"
                  value="cartao"
                  onChange={(e) => setTipoPagamento(e.value)}
                  checked={tipoPagamento === "cartao"}
                />
                <label htmlFor="cartao">Cartão de Crédito/Débito</label>
              </div>
              <div>
                <RadioButton
                  inputId="pix"
                  name="pagamento"
                  value="pix"
                  onChange={(e) => setTipoPagamento(e.value)}
                  checked={tipoPagamento === "pix"}
                />
                <label htmlFor="pix">PIX</label>
              </div>
              <div>
                <RadioButton
                  inputId="dinheiro"
                  name="pagamento"
                  value="dinheiro"
                  onChange={(e) => setTipoPagamento(e.value)}
                  checked={tipoPagamento === "dinheiro"}
                />
                <label htmlFor="dinheiro">Dinheiro</label>
              </div>
            </div>

            {tipoPagamento === "cartao" && (
              <div className={styles.formularioCartaoWrapper}>
                <div className={styles.visualCartao}>
                  <div className={styles.cartaoExibicao}>
                    <div className={styles.numero}>
                      {numeroCartao || "•••• •••• •••• ••••"}
                    </div>
                    <div className={styles.nome}>
                      {nomeCartao || "NOME NO CARTÃO"}
                    </div>
                    <div className={styles.footerCartao}>
                      <span>{validade || "MM/AA"}</span>
                      <span>{cvv || "CVV"}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.formulario}>
                  <div className={styles.inputGroup}>
                    <label>Número do Cartão</label>
                    <InputText
                      placeholder="1234 5678 9012 3456"
                      value={numeroCartao}
                      onChange={(e) => setNumeroCartao(e.target.value)}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Nome no Cartão</label>
                    <InputText
                      placeholder="FULANO DE TAL"
                      value={nomeCartao}
                      onChange={(e) => setNomeCartao(e.target.value)}
                    />
                  </div>
                  <div className={styles.flex}>
                    <div className={styles.inputGroup}>
                      <label>Validade</label>
                      <InputText
                        placeholder="MM/AA"
                        value={validade}
                        onChange={(e) => setValidade(e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>CVV</label>
                      <InputText
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tipoPagamento === "pix" && (
              <div className={styles.qrCodeContainer}>
                <p>Escaneie o QR Code abaixo para pagar via PIX:</p>
                <QRCode
                  value={`Pagamento UniFood - Produto: ${
                    produto.nome
                  } - R$${valorTotal.toFixed(2)}`}
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
    </div>
  );
}
