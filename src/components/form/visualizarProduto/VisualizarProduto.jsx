import React from "react";
import styles from "./VisualizarProduto.module.css";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { ShoppingCart, CreditCard } from "lucide-react";

const VisualizarProduto = ({ produto, onClose }) => {
  const navigate = useNavigate();

  if (!produto) return null;

  const adicionarAoCarrinho = () => {
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho")) || [];
    const novoCarrinho = [...carrinhoAtual, produto];
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    toast.success("Produto adicionado ao carrinho!");
  };

  const comprarAgora = () => {
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho")) || [];
    const novoCarrinho = [...carrinhoAtual, produto];
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    navigate("/pagamento");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.fechar} onClick={onClose}>
          ✕
        </button>
        <h2 className={styles.titulo}>{produto.nome}</h2>
        <img
          src={produto.imagem}
          alt={produto.nome}
          className={styles.imagem}
        />

        <div className={styles.detalhes}>
          <div className={styles.coluna}>
            <p>
              <strong>Loja:</strong> {produto.loja}
            </p>
            <p>
              <strong>Categoria:</strong>{" "}
              <span className={styles.categoria}>{produto.categoria}</span>
            </p>
          </div>
          <div className={styles.coluna}>
            <p className={styles.descricao}>{produto.descricao}</p>
            <p className={styles.preco}>
              <strong>Preço:</strong> R${produto.preco}
            </p>
          </div>
        </div>

        <div className={styles.botoes}>
          <Button
            className={styles.botaoCarrinho}
            onClick={adicionarAoCarrinho}
          >
            <ShoppingCart size={16} className={styles.icone} />
            Adicionar ao Carrinho
          </Button>
          <Button className={styles.botaoComprar} onClick={comprarAgora}>
            <CreditCard size={16} className={styles.icone} />
            Comprar agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisualizarProduto;
