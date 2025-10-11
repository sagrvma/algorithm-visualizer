export interface TileType {
  row: number;
  col: number;
  isStart: boolean; //If it is the green starting pointing where pathfinding begins
  isEnd: boolean; //If it is the red target/destination point
  isWall: boolean; //If user drew a wall on this tile
  isVisited: boolean; //Has the algorithm already discovered this tile yet
  isPath: boolean; //If this tile is part of the final shorted path (yellow)
  distance: number; //Shortest distance of current tile from starting node, Will be infinity by default
  parent: TileType | null; // Points to the previous tile in the shorted path
}

export type GridType = TileType[][];
