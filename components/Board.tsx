import React, { useCallback, useContext, useEffect, useRef } from "react";
import styles from "@/styles/Board.module.css";
import Tile from "./Tile";
import { Tile as TileModel } from "@/models/Tile";
import { GameContext } from "@/context/GameContext";
import MobileSwiper, { SwipeInput } from "./MobileSwiper";
import { start } from "repl";

export default function Board() {
  const { getTiles, moveTiles, startGame } = useContext(GameContext);
  const initialized = useRef(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      switch (event.code) {
        case "ArrowUp": {
          moveTiles("move_up");
          break;
        }
        case "ArrowDown": {
          moveTiles("move_down");
          break;
        }
        case "ArrowLeft": {
          moveTiles("move_left");
          break;
        }
        case "ArrowRight": {
          moveTiles("move_right");
          break;
        }
      }
    },
    [moveTiles],
  );

  useEffect(() => {
    if (!initialized.current) {
      startGame();
      initialized.current = true;
    }
  }, [startGame]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const renderTiles = () => {
    return getTiles().map((tile: TileModel) => {
      return <Tile key={`${tile.id}`} {...tile} />;
    });
  };

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }: SwipeInput) => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          moveTiles("move_right");
        } else {
          moveTiles("move_left");
        }
      }

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 0) {
          moveTiles("move_down");
        } else {
          moveTiles("move_up");
        }
      }
    },
    [moveTiles],
  );

  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCells = 16;

    for (let i = 0; i < totalCells; i++) {
      cells.push(<div className={styles.cell} key={i}></div>);
    }

    return cells;
  };

  return (
    <MobileSwiper onSwipe={handleSwipe}>
      <div className={styles.board}>
        <div className={styles.tiles}>{renderTiles()}</div>
        <div className={styles.grid}> {renderGrid()} </div>
      </div>
    </MobileSwiper>
  );
}
