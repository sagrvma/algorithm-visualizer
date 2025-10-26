import type { GridType, TileType } from "../types";

/*
    DFS is not suitable for pathfinding as it does not gurantee the shortest path.

    Ignores weight.
*/

const dfs = (
  grid: GridType,
  startTile: TileType,
  endTile: TileType
): TileType[] => {
  const visitedTileInOrder: TileType[] = [];

  //Using an array as a stack since it already has push() and pop()

  const stack: TileType[] = [];

  //Initiate Start Tile
  startTile.distance = 0;

  stack.push(startTile);

  while (stack.length > 0) {
    const currentTile: TileType = stack.pop()!;

    if (currentTile.isWall || currentTile.isVisited) {
      continue;
    }

    //Mark as visited and add to animation list
    currentTile.isVisited = true;

    visitedTileInOrder.push(currentTile);

    //Success
    if (currentTile === endTile) {
      return visitedTileInOrder;
    }

    //Neighbours
    const neighbours: TileType[] = getNeighbours(currentTile, grid);

    for (let neighbour of neighbours) {
      if (neighbour.isVisited || neighbour.isWall) {
        continue;
      }

      neighbour.distance = currentTile.distance + 1;
      neighbour.parent = currentTile;

      stack.push(neighbour);
    }
  }
  //If no path found
  return visitedTileInOrder;
};

const getNeighbours = (tile: TileType, grid: GridType): TileType[] => {
  const neighbours: TileType[] = [];

  const { row, col } = tile;

  const rows = grid.length;
  const columns = grid[0].length;

  //UP
  if (row > 0) {
    neighbours.push(grid[row - 1][col]);
  }
  //DOWN
  if (row < rows - 1) {
    neighbours.push(grid[row + 1][col]);
  }
  //LEFT
  if (col > 0) {
    neighbours.push(grid[row][col - 1]);
  }
  //RIGHT
  if (col < columns - 1) {
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

export { dfs, getShortestPath };
