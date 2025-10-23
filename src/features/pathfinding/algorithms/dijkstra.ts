import type { GridType, TileType } from "../types";
import { PriorityQueue } from "../utils/priorityQueue";

const dijkstra = (
  grid: GridType,
  startTile: TileType,
  endTile: TileType
): TileType[] => {
  const visitedTilesInOrder: TileType[] = [];

  //Initialize starting tile's distance to 0
  startTile.distance = 0;

  const minHeap = new PriorityQueue<TileType>();

  minHeap.enqueue(startTile, 0);

  while (!minHeap.isEmpty()) {
    const currentTile: TileType = minHeap.dequeue()!;

    if (currentTile.isVisited || currentTile.isWall) {
      continue;
    }

    //If path distance is Infinity, that means no path exists and all remaining tiles are unreachable
    // if (currentTile.distance === Infinity) {
    //   return visitedTilesInOrder;
    // }

    currentTile.isVisited = true;

    visitedTilesInOrder.push(currentTile);

    //If found the endTile, success
    if (currentTile === endTile) {
      return visitedTilesInOrder;
    }

    //Update neighbours
    updateNeighbours(currentTile, grid, minHeap);
  }

  //If no path found
  return visitedTilesInOrder;
};

const updateNeighbours = (
  tile: TileType,
  grid: GridType,
  minHeap: PriorityQueue<TileType>
): void => {
  const neighbours: TileType[] = getNeighbours(grid, tile);

  for (const neighbour of neighbours) {
    //Skip if visited or wall
    if (neighbour.isVisited || neighbour.isWall) {
      continue;
    }

    const weight = 1; //Since unweighted right now
    const newDistance = tile.distance + weight;

    //Relax the edge, only if we found a shorter path to this current tile, update it's distance, update its shorter path parent, and add to minHeap with new shorter distance

    if (newDistance < neighbour.distance) {
      neighbour.distance = newDistance;

      neighbour.parent = tile;

      minHeap.enqueue(neighbour, newDistance);
    }
  }
};

const getNeighbours = (grid: GridType, tile: TileType): TileType[] => {
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

  while (currentTile !== null) {
    shortestPath.unshift(currentTile);
    currentTile = currentTile.parent;
  }

  return shortestPath;
};

export { dijkstra, updateNeighbours, getShortestPath };
