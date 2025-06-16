import style from "./CardEditDelete.module.css";
import { useState, useEffect, useRef } from "react";

import EditProduto from "../../components/form/formEditProduto/EditProduto";
import ExcluirProduto from "../../components/form/cardExcluir/ExcluirProduto";

import { Button } from "primereact/button";

export default function CardEditDelete({ visible, onHide, produto, position}){
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const cardRef = useRef(null); // Referência ao elemento do card para verificar cliques fora dele

    useEffect(()=>{

        // Função para detectar cliques fora do componente (fechar o card)
        function handleClickOutside(event){

            if(visible){
                setShowEditForm(false);
                setShowDeleteForm(false);
            }
            // Se o clique for fora do card, chama a função `onHide`
            if (cardRef.current && !cardRef.current.contains(event.target)){
                onHide?.();
            }
        }

        if(visible){
            document.addEventListener("mousedown", handleClickOutside);// Adiciona o listener apenas quando o card está visível
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside); // Limpa o listener ao desmontar ou quando o card fica invisível
        };
    },[visible, onHide]);

    if(!visible){
        return null;
    }

    return (
        <div className={style.card_container} ref={cardRef} 
            style={{position: 'absolute', 
                top: position?.top || 0, // Usa a posição calculada p cima, ou 0 como fallback
                left: position?.left || 0, //esquerda posição
            }}>
            <div className={style.btn}>
                <Button
                    label="Editar Produto"
                    className={style.botaoCustomizado}
                    onClick={() => setShowEditForm(true)}
                />
            </div>
            <div className={style.btn}>
                <Button
                    label="Excluir Produto"
                    className={style.botaoCustomizadoDelete}
                    onClick={() => setShowDeleteForm(true)}
                />
            </div>

            <EditProduto
                visible={showEditForm}
                onHide={() => setShowEditForm(false)}
                produto={produto}
            />
            <ExcluirProduto
                visible={showDeleteForm}
                onHide={() => setShowDeleteForm(false)}
                produto={produto}
            />
        </div>
    );
}
