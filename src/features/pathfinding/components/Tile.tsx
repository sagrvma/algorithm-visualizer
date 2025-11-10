import type { TileType } from "../types";
import "./Tile.css";

interface TileProps {
  tile: TileType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
}

const Tile = ({ tile, onMouseDown, onMouseEnter }: TileProps) => {
  //Destructuring the tile for ease of use
  const { row, col, isStart, isEnd, isWall, isPath, isVisited, weight } = tile;

  //Deciding which conditional class the tile will get to display relevant css colour
  const getTileClass = () => {
    let classes = "tile";
    //In decreasing order of priority as that is important
    if (isStart) return (classes += " tile-start");
    if (isEnd) return (classes += " tile-end");
    if (isWall) return (classes += " tile-wall");
    else {
      if (weight === 5) classes += " tile-weight-5";
      if (weight === 15) classes += " tile-weight-15";

      //Then add visited/path (overlay layers)
      if (isVisited) classes += " tile-visited";
      if (isPath) classes += " tile-path";
    }

    return classes;
  };

  return (
    <div
      className={getTileClass()}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
    ></div>
    //Visual appearance will be handled by CSS
  );
};

export default Tile;
