import React, { useContext } from "react";
import Styles from "@/styles/Score.module.css";
import { GameContext } from "@/context/GameContext";

export default function Score() {
  const { score } = useContext(GameContext);
  return (
    <div className={Styles.score}>
      Score
      <div> {score} </div>
    </div>
  );
}
