import type { TileType, GridType } from "../types";

const ROWS = 20;
const COLUMNS = 40;

export const START_NODE = { row: 10, col: 10 };
export const END_NODE = { row: 10, col: 30 };

const createInitialGrid = (): GridType => {
  const grid: GridType = [];

  for (let row = 0; row < ROWS; row++) {
    const currentRow: TileType[] = [];

    for (let col = 0; col < COLUMNS; col++) {
      const cell: TileType = {
        row,
        col,
        isStart: row === START_NODE.row && col === START_NODE.col,
        isEnd: row === END_NODE.row && col === END_NODE.col,
        isWall: false,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        parent: null,
        weight: 1, //Default weight is 1
      };

      currentRow.push(cell);
    }

    grid.push(currentRow);
  }

  return grid;
};

export default createInitialGrid;
