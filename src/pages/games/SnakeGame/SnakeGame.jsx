import React, { useEffect, useRef, useState } from "react";
import styles from "./SnakeGame.module.css";

const gridSize = 10;

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([3, 3]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);

  const move = (dir, pos) => {
    switch (dir) {
      case "LEFT":
        return [pos[0] - 1, pos[1]];
      case "RIGHT":
        return [pos[0] + 1, pos[1]];
      case "UP":
        return [pos[0], pos[1] - 1];
      case "DOWN":
        return [pos[0], pos[1] + 1];
      default:
        return pos;
    }
  };

  const gameLoop = () => {
    setSnake((prevSnake) => {
      const newHead = move(direction, prevSnake[0]);
      const newSnake = [newHead, ...prevSnake.slice(0, -1)];
      if (JSON.stringify(newHead) === JSON.stringify(food)) {
        newSnake.push(prevSnake[prevSnake.length - 1]);
        setFood([
          Math.floor(Math.random() * gridSize),
          Math.floor(Math.random() * gridSize),
        ]);
      }
      if (
        newHead[0] < 0 ||
        newHead[1] < 0 ||
        newHead[0] >= gridSize ||
        newHead[1] >= gridSize ||
        newSnake
          .slice(1)
          .some((s) => JSON.stringify(s) === JSON.stringify(newHead))
      ) {
        setGameOver(true);
        return prevSnake;
      }
      return newSnake;
    });
  };

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(gameLoop, 500);
      return () => clearInterval(interval);
    }
  }, [direction, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const dirMap = {
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        ArrowUp: "UP",
        ArrowDown: "DOWN",
      };
      if (dirMap[e.key]) setDirection(dirMap[e.key]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={styles.snakeBoard}>
      {Array.from({ length: gridSize }).map((_, y) => (
        <div key={y} className={styles.row}>
          {Array.from({ length: gridSize }).map((_, x) => {
            const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
            const isFood = food[0] === x && food[1] === y;
            return (
              <div
                key={x}
                className={`${styles.cell} ${isSnake ? styles.snake : ""} ${
                  isFood ? styles.food : ""
                }`}
              />
            );
          })}
        </div>
      ))}
      {gameOver && <p className={styles.gameOver}>Game Over</p>}
    </div>
  );
}
