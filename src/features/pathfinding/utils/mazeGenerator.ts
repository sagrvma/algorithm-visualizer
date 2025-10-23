import type { GridType } from "../types";

/*
The objective is to keep dividing the grid into divisions but leaving one gap open in each new row we add to all subregions remain connected to each other. 
*/

const generateMaze = (grid: GridType): GridType => {
  //Create a deep copy to avoid mutating the original grid
  const newGrid = grid.map((r) =>
    r.map((tile) => ({ ...tile, isWall: false }))
  );

  const rows = newGrid.length;
  const columns = newGrid[0].length;

  const orientation = rows > columns ? "VERTICAL" : "HORIZONTAL";

  divide(0, rows - 1, 0, columns - 1, orientation, newGrid);

  return newGrid;
};

//Helper function to calculate random number between a range, inclusive.
const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const divide = (
  rowStart: number,
  rowEnd: number,
  colStart: number,
  colEnd: number,
  orientation: "HORIZONTAL" | "VERTICAL",
  grid: GridType
): void => {
  const width = colEnd - colStart;
  const height = rowEnd - rowStart;

  //Dont proceed if the area becomes less than 4 tiles squared
  if (width < 2 || height < 2) {
    return;
  }

  if (orientation === "HORIZONTAL") {
    //HORIZONTAL Division

    //Choose a random row for the horizontal wall
    const wallRow = randomInt(rowStart + 1, rowEnd - 1);

    //Choose a random column for the gap
    const gapCol = randomInt(colStart, colEnd);

    //For the wall row, generate a wall for all tiles in the row except for the gapCol
    for (let col = colStart; col <= colEnd; col++) {
      if (col !== gapCol) {
        const tile = grid[wallRow][col];
        if (!tile.isStart && !tile.isEnd) {
          //Leave the start and end untouched so the maze is always solvable
          tile.isWall = true;
        }
      }
    }

    //Recursive divide the halves above and below the wall row but in the opposite orientation
    divide(rowStart, wallRow - 1, colStart, colEnd, "VERTICAL", grid);
    divide(wallRow + 1, rowEnd, colStart, colEnd, "VERTICAL", grid);
  } else {
    //VERTICAL Division

    //Choose a random column for the vertical wall
    const wallCol = randomInt(colStart + 1, colEnd - 1);

    //Chose a random row for the gap
    const gapRow = randomInt(rowStart, rowEnd);

    //For the wall column, add a wall for all the tiles in the column except for the gapRow
    for (let row = rowStart; row <= rowEnd; row++) {
      if (row !== gapRow) {
        const tile = grid[row][wallCol];
        if (!tile.isStart && !tile.isEnd) {
          //Leave the start and end untouched so the maze is always solvable
          tile.isWall = true;
        }
      }
    }

    //Divide both halves on either side of the wallCol but in the opposite orientation
    divide(rowStart, rowEnd, colStart, wallCol - 1, "HORIZONTAL", grid);
    divide(rowStart, rowEnd, wallCol + 1, colEnd, "HORIZONTAL", grid);
  }
};

export { generateMaze };
