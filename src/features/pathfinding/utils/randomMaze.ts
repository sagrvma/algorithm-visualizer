import type { GridType, TileType } from "../types";

// import type { GridType } from "../types";

// /**
//  * Recursive Backtracker Maze Generator
//  *
//  * Uses Depth-First Search (DFS) to carve passages through walls.
//  * Creates mazes with long, winding corridors and minimal branching.
//  *
//  * Visual Example:
//  * Before:              After:
//  * █ █ █ █ █            █ █ █ █ █
//  * █ █ █ █ █            █ · · · █
//  * █ █ █ █ █    →       █ █ █ · █
//  * █ █ █ █ █            █ · · · █
//  * █ █ █ █ █            █ █ █ █ █
//  *
//  * Algorithm Steps:
//  * 1. Fill entire grid with walls
//  * 2. Choose random starting cell
//  * 3. Mark cell as passage (remove wall)
//  * 4. Get unvisited neighbors (2 cells away in 4 directions)
//  * 5. Randomly pick one neighbor
//  * 6. Remove wall BETWEEN current and neighbor
//  * 7. Recursively visit that neighbor (DFS)
//  * 8. When stuck (no unvisited neighbors), backtrack
//  * 9. Continue from previous cell until all reachable
//  *
//  * Time Complexity: O(rows × cols) - visits each cell once
//  * Space Complexity: O(rows × cols) - recursion stack in worst case
//  */

const generateRecBacktrackMaze = (grid: GridType): GridType => {
  const newGrid: GridType = grid.map((row) =>
    row.map((tile) => ({
      ...tile,
    }))
  );

  const rows = grid.length;
  const columns = grid[0].length;

  //Fill the whole grid with walls
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const tile: TileType = newGrid[row][col];

      //Not if start/end
      if (tile.isStart || tile.isEnd) {
        tile.isWall = false;
      } else {
        tile.isWall = true;
      }

      //Mark as unvisited, to track throughout this process
      tile.isVisited = false;
    }
  }

  //Choose starting position for carving the maze path
  //We need to make sure its an odd value so our algorithms works out right and avoids edges. Also made sure that grid dimensions are odd so the outer edges are always walls.

  const startRow = 1;
  const startCol = 1;

  //Actually start carving the path
  carvePath(newGrid, startRow, startCol, rows, columns);

  //Clear visited tags so it doesn't mess up pathfinding
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      newGrid[row][col].isVisited = false;
    }
  }

  //Ensure start/end nodes are accessible always
  const startNode = grid.flat().find((tile) => tile.isStart)!;
  const endNode = grid.flat().find((tile) => tile.isEnd)!;

  clearAroundNode(newGrid, startNode.row, startNode.col);
  clearAroundNode(newGrid, endNode.row, endNode.col);

  return newGrid;
};

const carvePath = (
  grid: GridType,
  row: number,
  col: number,
  rows: number,
  columns: number
): void => {
  const tile: TileType = grid[row][col];

  //Mark current cell as passage (remove the wall)
  tile.isWall = false;

  tile.isVisited = true; //Only for this recursion generation, will be cleared once maze is generated so as to not mess with path finding

  //Define neighbour directions, move by 2 to mantain maze structure so that there are walls between all passages. Shuffle to randomize order so as to generate a different maze everytime, otherwise all mazes with be idenical. Eliminate any direction bias.
  const directions = shuffleArray([
    { dr: -2, dc: 0, name: "UP" },
    { dr: 2, dc: 0, name: "DOWN" },
    { dr: 0, dc: -2, name: "LEFT" },
    { dr: 0, dc: 2, name: "RIGHT" },
  ]);

  //Try each direction in a random order
  for (const { dr, dc } of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    //Check bounds
    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= columns) {
      continue;
    }

    //If neighbours is not yet visited, carve through and recurse
    if (!grid[newRow][newCol].isVisited) {
      //Calculate the cell between the current tile and neighbour and remove its wall to mark it as passage
      const passageRow = row + dr / 2;
      const passageCol = col + dc / 2;

      grid[passageRow][passageCol].isWall = false;

      //Recursion : Visit the neighbour's neighbour : DFS
      carvePath(grid, newRow, newCol, rows, columns);
    }

    //When loop ends, backtracking will be automatic
  }
};

const clearAroundNode = (grid: GridType, row: number, col: number): void => {
  //Clear a 3x3 area around the start/end nodes to ensure they're always accessible

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      //Check bounds
      if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) {
        continue;
      }

      const tile: TileType = grid[r][c];

      if (!tile.isStart && !tile.isEnd) {
        //Remove wall to make it accessible
        tile.isWall = false;
      }
    }
  }
};

// /**
//  * Fisher-Yates Shuffle Algorithm
//  * Randomly shuffles array in-place with uniform distribution
//  *
//  * How it works:
//  * 1. Start from last element
//  * 2. Pick random element from 0 to current position
//  * 3. Swap them
//  * 4. Move to previous element
//  * 5. Repeat until start
//  *
//  * Time Complexity: O(n)
//  * Space Complexity: O(n) for copy
//  */

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]; //Copy to avoid mutation

  for (let i = shuffled.length - 1; i > 0; i--) {
    //Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    //Swap
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export default generateRecBacktrackMaze;
