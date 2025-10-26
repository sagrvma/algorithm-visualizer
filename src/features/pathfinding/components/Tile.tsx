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
    //In decreasing order of priority as that is important
    if (isStart) return "tile tile-start";
    if (isEnd) return "tile tile-end";
    if (isWall) return "tile tile-wall";
    if (isPath) return "tile tile-path";
    if (isVisited) return "tile tile-visited";

    //Added weight classes
    if (weight === 5) return "tile tile-weight-medium";
    if (weight === 15) return "tile tile-weight-heavy";

    return "tile";
  };

  return (
    <div
      className={getTileClass()}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
    >
      {weight > 1 && !isStart && !isEnd && !isWall && !isPath && (
        <span className="tile-weight-label">{weight}</span>
      )}
    </div>
    //Visual appearance will be handled by CSS
  );
};

export default Tile;
