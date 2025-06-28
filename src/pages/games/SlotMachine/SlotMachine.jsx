import React, { useState } from "react";
import styles from "./SlotMachine.module.css";

const symbols = ["🍒", "🍋", "🍊", "🍇", "🔔"];

export default function SlotMachine() {
  const [slots, setSlots] = useState(["🍒", "🍒", "🍒"]);
  const [result, setResult] = useState("");

  const spin = () => {
    const newSlots = Array.from(
      { length: 3 },
      () => symbols[Math.floor(Math.random() * symbols.length)]
    );
    setSlots(newSlots);
    setResult(
      newSlots.every((s) => s === newSlots[0])
        ? "🎉 Jackpot!"
        : "Tente novamente!"
    );
  };

  return (
    <div className={styles.slotContainer}>
      <div className={styles.slots}>
        {slots.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
      <button onClick={spin} className={styles.spinButton}>
        Girar
      </button>
      <p>{result}</p>
    </div>
  );
}
