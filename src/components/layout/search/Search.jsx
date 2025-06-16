import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import styles from './Search.module.css';

export default function Search() {
  const [consulta, setConsulta] = useState('');
  const [resulto, setResulto] = useState([]);

  const fetchResults = async (q) => {
    if (!q) {
      setResulto([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResulto(data);
    } catch (err) {
      console.error('Erro na busca', err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchResults(consulta), 500);
    return () => clearTimeout(timeout);
  }, [consulta]);

  return (
    <div className={styles.searchContainer}>
      <span className={styles.spanSearch}>
        <InputText
          placeholder="Buscar"
          className={styles.searchInput}
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
        />
        <i className={`pi pi-search ${styles.inputIcon}`}></i>
      </span>
      {consulta && resulto.length > 0 && (
        <div className={styles.searchResults}>
          {resulto.map((item, index) => (
            <div key={index} className={styles.resultItem}>
              {item.name || item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
