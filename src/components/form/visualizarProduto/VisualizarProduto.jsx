import React from "react";
import styles from "./VisualizarProduto.module.css";
import { X } from "lucide-react";
import { Button } from "primereact/button";
import { ShoppingCart, CreditCard } from "lucide-react";

const VisualizarProduto = ({
  produto,
  onClose,
  adicionarAoCarrinho,
  comprarAgora,
}) => {
  if (!produto) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.fechar} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.headerProduto}>
          <img
            src={produto.imagemUrl}
            alt={produto.nome}
            className={styles.imagem}
            onError={
              (e) => (e.target.src = "/imagens/placeholder.png") // fallback opcional
            }
          />
          <div className={styles.infoTopo}>
            <h2 className={styles.titulo}>{produto.nome}</h2>
            <span className={styles.etiqueta}>
              R$ {produto.preco.toFixed(2)}
            </span>
            <p className={styles.loja}>
              <strong>Loja:</strong> {produto.loja || "UFAM RU"}
            </p>
            <p className={styles.categoria}>
              <strong>Categoria:</strong> {produto.categoria || "Doces"}
            </p>
          </div>
        </div>

        <div className={styles.descricaoBox}>
          <p className={styles.descricao}>{produto.descricao}</p>
        </div>

        <div className={styles.botoesAcao}>
          <Button
            className={styles.botaoCarrinho}
            onClick={() => adicionarAoCarrinho(produto)}
          >
            <ShoppingCart size={16} className={styles.icone} />
            Adicionar ao Carrinho
          </Button>
          <Button
            className={styles.botaoComprar}
            onClick={() => comprarAgora(produto)}
          >
            <CreditCard size={16} className={styles.icone} />
            Comprar Agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisualizarProduto;
