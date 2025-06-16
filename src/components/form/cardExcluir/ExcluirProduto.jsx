import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import style from "./ExcluirProduto.module.css";

// Firebase
import { db } from "/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default function ExcluirProduto({ visible, onHide, produto, onDelete }) {
  const handleDelete = async () => {
    try {
      if (!produto?.id) {
        console.warn("Produto inválido.");
        return;
      }

      // Tenta excluir no Firebase
      try {
        await deleteDoc(doc(db, "produtos", produto.id));
        console.log("Produto deletado do Firebase com sucesso");
      } catch (firebaseError) {
        console.warn("Produto não encontrado no Firebase, usando simulação.");
      }

      // Remove da lista local via callback
      onDelete(produto.id);
      onHide();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  return (
    <Dialog
      header={`Apagar o produto "${produto?.nome}"?`}
      visible={visible}
      onHide={onHide}
      style={{ width: "35rem" }}
      modal
      closable
    >
      <div className={style.content}>
        <p className={style.apagando}>
          Você está apagando o produto <strong>{produto?.nome}</strong>.
        </p>
        <p className={style.apagar}>Tem certeza que deseja apagar?</p>
      </div>

      <div className={style.footer}>
        <Button
          label="Cancelar"
          className="p-button-text"
          onClick={onHide}
          style={{ marginTop: "10px", height: "30px" }}
        />
        <Button
          label="Sim, deletar"
          className="p-button-danger"
          onClick={handleDelete}
          style={{ marginTop: "10px", height: "30px" }}
        />
      </div>
    </Dialog>
  );
}
