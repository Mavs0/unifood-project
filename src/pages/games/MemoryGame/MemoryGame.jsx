import React, { useState } from "react";
import styles from "./MemoryGame.module.css";

const cardsList = ["🍕", "🍔", "🍟", "🍩", "🍰", "🍕", "🍔", "🍟", "🍩", "🍰"];

export default function MemoryGame() {
  const [cards, setCards] = useState(shuffle(cardsList));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  function shuffle(array) {
    return [...array].sort(() => 0.5 - Math.random());
  }

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [i, j] = newFlipped;
      if (cards[i] === cards[j]) {
        setMatched([...matched, i, j]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  return (
    <div className={styles.memoryGrid}>
      {cards.map((card, i) => (
        <div
          key={i}
          className={`${styles.card} ${
            flipped.includes(i) || matched.includes(i) ? styles.flipped : ""
          }`}
          onClick={() => handleFlip(i)}
        >
          {flipped.includes(i) || matched.includes(i) ? card : "❓"}
        </div>
      ))}
    </div>
  );
}
