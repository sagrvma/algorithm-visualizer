import { useState } from "react";
import type { GridType, TileType } from "./types";
import createInitialGrid, { END_NODE, START_NODE } from "./utils/gridHelpers";
import { bfs, getShortestPath } from "./algorithms/bfs";
import Grid from "./components/Grid";
import "./PathfindingVisualizer.css";

const PathFindingVisualizer = () => {
  //STATE MANAGEMENT
  const [grid, setGrid] = useState<GridType>(createInitialGrid());
  const [isMousePressed, setIsMousePressed] = useState<boolean>(false); //Used for click-and-drag wall drawing functionality
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false); //To prevent user from drawing walls or starting another animation while the visualization animation is already running

  //WALL DRAWING HANDLERS/EVENT HANDLERS
  const toggleWall = (
    currentGrid: GridType,
    row: number,
    col: number
  ): GridType => {
    //Create a deep copy of grid to update as we cannot make changes to the original grid using setState. As while updating states in react, we must create new objects, not modify existing ones as react compares references to detect changes.
    const newGrid: GridType = currentGrid.map((r) =>
      r.map((tile) => ({ ...tile }))
    );

    const tile: TileType = newGrid[row][col];

    tile.isWall = !tile.isWall; //not just true as user can also decide to unset a tile as a wall

    return newGrid;
  };

  const handleMouseDown = (row: number, col: number): void => {
    if (isVisualizing) {
      return;
    }

    const tile: TileType = grid[row][col];

    if (tile.isStart || tile.isEnd) {
      return;
    }

    const newGrid = toggleWall(grid, row, col);

    setGrid(newGrid);

    setIsMousePressed(true);
  };

  const handleMouseEnter = (row: number, col: number): void => {
    if (!isMousePressed) {
      return;
    }

    if (isVisualizing) {
      return;
    }

    const tile: TileType = grid[row][col];

    if (tile.isStart || tile.isEnd) {
      return;
    }

    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = (): void => {
    setIsMousePressed(false);
  };

  //VISUALIZATION LOGIC

  const visualizeBFS = (): void => {
    if (isVisualizing) {
      return;
    }

    setIsVisualizing(true);

    const gridCopy: GridType = grid.map((r) => r.map((tile) => ({ ...tile })));

    const startTile = gridCopy[START_NODE.row][START_NODE.col];
    const endTile = gridCopy[END_NODE.row][END_NODE.col];

    const visitedTiles = bfs(gridCopy, startTile, endTile);

    const shortestPath = getShortestPath(endTile);

    animateAlgorithm(visitedTiles, shortestPath);
  };

  const animateAlgorithm = (
    visitedTiles: (typeof grid)[0],
    shortestPath: (typeof grid)[0]
  ): void => {
    const VISITED_SPEED = 10;

    for (let i = 0; i < visitedTiles.length; i++) {
      setTimeout(() => {
        const tile: TileType = visitedTiles[i];

        setGrid((prevGrid) => {
          const newGrid: GridType = prevGrid.map((r) =>
            r.map((tile) => ({ ...tile }))
          );

          newGrid[tile.row][tile.col].isVisited = true;

          return newGrid;
        });

        //When the last visitedTile is animated, wait for 50ms and start the path animation

        if (i === visitedTiles.length - 1) {
          setTimeout(() => {
            animatePath(shortestPath);
          }, 50);
        }
      }, VISITED_SPEED * i);
    }
  };

  const animatePath = (path: (typeof grid)[0]): void => {
    const PATH_SPEED = 50; //Slower than Visted animation speed

    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const tile: TileType = path[i];

        setGrid((prevGrid) => {
          const newGrid: GridType = prevGrid.map((r) =>
            r.map((tile) => ({ ...tile }))
          );

          newGrid[tile.row][tile.col].isPath = true;
          return newGrid;
        });

        //After the last tile, animation ends
        if (i === path.length - 1) {
          setIsVisualizing(false);
        }
      }, PATH_SPEED * i);
    }
  };

  //RESET FUNCTIONALITY

  const resetGrid = (): void => {
    if (isVisualizing) {
      return;
    }

    const newGrid: GridType = createInitialGrid();

    setGrid(newGrid);
  };

  //RENDER
  return (
    //adding mouseUp handler here so it works even if the mouse pointer leaves the grid
    <div className="visualizerWrapper" onMouseUp={handleMouseUp}>
      <div className="controls">
        <button onClick={visualizeBFS} disabled={isVisualizing}>
          Visualize BFS
        </button>
        <button onClick={resetGrid} disabled={isVisualizing}>
          Reset
        </button>
      </div>

      <Grid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
      />

      <div className="legend">
        <div className="legend-item">
          <span className="legend-box legend-start"></span>
          <span>Start</span>
        </div>
        <div className="legend-item">
          <span className="legend-box legend-end"></span>
          <span>End</span>
        </div>
        <div className="legend-item">
          <span className="legend-box legend-visited"></span>
          <span>Visited</span>
        </div>
        <div className="legend-item">
          <span className="legend-box legend-path"></span>
          <span>Path</span>
        </div>
        <div className="legend-item">
          <span className="legend-box legend-wall"></span>
          <span>Wall</span>
        </div>
      </div>
    </div>
  );
};

export default PathFindingVisualizer;
