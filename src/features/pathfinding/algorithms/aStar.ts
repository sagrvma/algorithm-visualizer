import type { GridType, TileType } from "../types";
import { PriorityQueue } from "../utils/priorityQueue";

/*
A Star Algorithm

Much faster and also gurantees the shortest path

Just like Dijkstra's but uses a heuristic to guide the search towards the goal

Priority: f(n) = g(n) + h(n)
    -g(n) = actual distance from start (what is used as a priority in Dijkstra's)
    -h(n) = heuristic estimate to the goal (Manhattan Distance) = |current_row - endTile_row| + |current_column - endTile_column|
    -f(n) = total estimated cost

Manhattan Distance: Manhattan is planned like a grid, so cant travel diagonally therefore.
    to go from (1,1) to (4, 5):
        Manhattan Distance = |1-4| + |1-5|
                           = 3 + 4
                           = 7

*/

const aStar = (
  grid: GridType,
  startTile: TileType,
  endTile: TileType
): TileType[] => {
  const visitedTilesInOrder: TileType[] = [];

  const minHeap = new PriorityQueue<TileType>();

  //Initialize for the start tile
  startTile.distance = 0;

  //Calculate f(n) = g(n) + h(n)
  const gScore = startTile.distance;
  const hScore = manhattanDistance(startTile, endTile);
  const fScore = gScore + hScore;

  //Add start to the minHeap
  minHeap.enqueue(startTile, fScore);

  while (!minHeap.isEmpty()) {
    const currentTile: TileType = minHeap.dequeue()!;

    if (currentTile.isVisited || currentTile.isWall) {
      continue;
    }

    //Mark as visited and add to animation list
    currentTile.isVisited = true;
    visitedTilesInOrder.push(currentTile);

    //Success
    if (currentTile === endTile) {
      return visitedTilesInOrder;
    }

    //Check neighbours and operate on them using A* heuristics
    updateNeighbours(currentTile, grid, endTile, minHeap);
  }

  //No path found
  return visitedTilesInOrder;
};

const updateNeighbours = (
  tile: TileType,
  grid: GridType,
  endTile: TileType,
  minHeap: PriorityQueue<TileType>
): void => {
  const neighbours: TileType[] = getNeighbours(tile, grid);

  for (const neighbour of neighbours) {
    if (neighbour.isVisited || neighbour.isWall) {
      continue;
    }

    const weight = 1; //Unweighted for now
    const newDistance = tile.distance + weight;

    //Relax the edge if new distance is shorter (this is only by considering g(n) in the check)
    if (newDistance < neighbour.distance) {
      neighbour.distance = newDistance; //Update new shorter tile distance
      neighbour.parent = tile; //Update new shorter path parent

      //Calculate f(n) = g(n) + h(n)
      const gScore = newDistance; //g(n) - Actual distance from the start
      const hScore = manhattanDistance(neighbour, endTile); //h(n) - estimate to goal, heuristic
      const fScore = gScore + hScore;

      //Add to the priority queue
      minHeap.enqueue(neighbour, fScore);
    }
  }
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

//Utility function to calculate Manhattan distance for any two tiles
const manhattanDistance = (curr: TileType, goal: TileType): number => {
  const dx = Math.abs(curr.row - goal.row);
  const dy = Math.abs(curr.col - goal.col);

  return dx + dy;
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

export { aStar, getShortestPath };
