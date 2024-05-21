import React, { use, useEffect, useState } from "react";
import { Tile as TileProps } from "@/models/Tile";
import styles from "@/styles/Tile.module.css";
import {
  containerWidthDesktop,
  containerWidthMobile,
  mergeAnimationDuration,
  tileCountPerDimension,
} from "@/constants";
import usePreviousProps from "@/hooks/usePreviousPropsHook";
import { useMediaQuery } from "react-responsive";

export default function Tile({ position, value }: TileProps) {
  const isWideScreen = useMediaQuery({ minWidth: 512 });
  const containerWidth = isWideScreen
    ? containerWidthDesktop
    : containerWidthMobile;
  const [scale, setScale] = useState(1);
  const previousValue = usePreviousProps(value);
  const hasChange = previousValue !== value;

  const positionsToPixels = (position: number) => {
    return (position / tileCountPerDimension) * containerWidth;
  };

  useEffect(() => {
    if (hasChange) {
      setScale(1.1);
      setTimeout(() => {
        setScale(1);
      }, mergeAnimationDuration);
    }
  }, [hasChange]);

  const style = {
    left: positionsToPixels(position[0]),
    top: positionsToPixels(position[1]),
    transform: `scale(${scale})`,
    zIndex: value,
  };
  return (
    <div className={`${styles.tile} ${styles[`tile${value}`]}`} style={style}>
      {" "}
      {value}{" "}
    </div>
  );
}
