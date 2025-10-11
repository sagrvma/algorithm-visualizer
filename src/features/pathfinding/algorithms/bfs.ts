import type { GridType, TileType } from "../types";

const bfs = (
  grid: GridType,
  startTile: TileType,
  endTile: TileType
): TileType[] => {
  const visitedTilesInOrder: TileType[] = [];

  const queue: TileType[] = [];

  queue.push(startTile);
  startTile.isVisited = true;
  startTile.distance = 0;

  while (queue.length > 0) {
    const currentTile: TileType = queue.shift()!; //Shift removed first element, like queue.pop()

    if (currentTile.isWall) {
      continue;
    }

    visitedTilesInOrder.push(currentTile); //Push to list of visited tiles in order for animation

    if (currentTile === endTile) {
      return visitedTilesInOrder; //Success
    }

    const neighbours = getNeighbours(currentTile, grid);

    for (let neighbour of neighbours) {
      if (neighbour.isVisited) {
        continue;
      }
      if (neighbour.isWall) {
        continue;
      }

      neighbour.isVisited = true;
      neighbour.distance = currentTile.distance + 1;
      neighbour.parent = currentTile;

      queue.push(neighbour);
    }
  }

  return visitedTilesInOrder;
};

const getNeighbours = (tile: TileType, grid: GridType): TileType[] => {
  const neighbours: TileType[] = [];
  const { row, col } = tile;

  const rows = grid.length;
  const columns = grid[0].length;

  if (row > 0) {
    //UP
    neighbours.push(grid[row - 1][col]);
  }

  if (row < rows - 1) {
    //DOWN
    neighbours.push(grid[row + 1][col]);
  }
  if (col > 0) {
    //LEFT
    neighbours.push(grid[row][col - 1]);
  }
  if (col < columns - 1) {
    //RIGHT
    neighbours.push(grid[row][col + 1]);
  }

  return neighbours;
};

const getShortestPath = (endTile: TileType): TileType[] => {
  const shortestPath: TileType[] = [];

  let currentTile: TileType | null = endTile;

  while (currentTile != null) {
    shortestPath.unshift(currentTile);
    currentTile = currentTile.parent;
  }

  return shortestPath;
};
