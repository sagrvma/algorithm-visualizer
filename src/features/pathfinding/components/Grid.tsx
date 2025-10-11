import type { GridType } from "../types";
import Tile from "./Tile";

interface gridProps {
  grid: GridType; //The 2D array containing all the tile data (20x40)
  onMouseDown: (row: number, col: number) => void; //Function to call when clicking a tile
  onMouseEnter: (row: number, col: number) => void; //Function to call when dragging over a tile
}

const Grid = ({ grid, onMouseDown, onMouseEnter }: gridProps) => {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div className="grid-row" key={rowIndex}>
          {row.map((tile, tileIndex) => (
            <Tile
              key={tileIndex}
              tile={tile}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
