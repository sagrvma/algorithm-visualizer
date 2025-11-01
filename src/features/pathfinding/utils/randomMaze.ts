import type { GridType } from "../types";

const generateRandomMaze = (
  grid: GridType,
  density: number = 0.3
): GridType => {
  const newGrid: GridType = grid.map((row) =>
    row.map((tile) => ({
      ...tile,
    }))
  );

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      const tile = newGrid[row][col];

      //Don't place walls on start/end
      if (tile.isStart || tile.isEnd) {
        tile.isWall = false;
        continue;
      }

      //Place wall randomly based on density
      tile.isWall = Math.random() < density;

      //Reset Weights
      tile.weight = 1;
    }
  }

  return newGrid;
};

export default generateRandomMaze;
