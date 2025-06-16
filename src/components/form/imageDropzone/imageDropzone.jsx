import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./imageDropzone.module.css";

export default function ImageDropzone({ onImageSelected }) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        onImageSelected(file); // dispara callback pro componente pai
      }
    },
    [onImageSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={styles.dropzone + (isDragActive ? " " + styles.active : "")}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Pré-visualização" className={styles.preview} />
      ) : (
        <p>Arraste uma imagem aqui ou clique para selecionar</p>
      )}
    </div>
  );
}
