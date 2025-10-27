import { useState } from "react";
import type { GridType, TileType } from "./types";
import createInitialGrid, { END_NODE, START_NODE } from "./utils/gridHelpers";
import { bfs, getShortestPath } from "./algorithms/bfs";
import Grid from "./components/Grid";
import "./PathfindingVisualizer.css";
import { dijkstra } from "./algorithms/dijkstra";
import { generateMaze } from "./utils/mazeGenerator";
import { aStar } from "./algorithms/aStar";
import { dfs } from "./algorithms/dfs";

const PathFindingVisualizer = () => {
  //STATE MANAGEMENT
  const [grid, setGrid] = useState<GridType>(createInitialGrid());
  const [isMousePressed, setIsMousePressed] = useState<boolean>(false); //Used for click-and-drag wall drawing functionality
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false); //To prevent user from drawing walls or starting another animation while the visualization animation is already running
  const [speed, setSpeed] = useState<number>(50);
  const [algorithm, setAlgorithm] = useState<
    "BFS" | "DIJKSTRA" | "ASTAR" | "DFS"
  >("BFS");
  const [isWeightMode, setIsWeightMode] = useState<boolean>(false);
  //Track which node is being dragged
  const [draggedNode, setDraggedNode] = useState<"START" | "END" | null>(null);

  //ALGORITHM CHANGE HANDLER
  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAlgorithm = e.target.value as
      | "BFS"
      | "DIJKSTRA"
      | "ASTAR"
      | "DFS";
    setAlgorithm(selectedAlgorithm);
  };

  //HANDLE MAZE GENERATION
  const handleMazeGeneration = () => {
    if (isVisualizing) {
      return;
    }

    const newGrid = generateMaze(grid);
    setGrid(newGrid);
  };

  //SPEED CHANGE HANDLER
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newSpeed = Number(e.target.value);
    setSpeed(newSpeed);
  };

  //TOGGLE WEIGHT MODE
  const toggleWeightMode = () => {
    setIsWeightMode(!isWeightMode);
  };

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

  //Weight Mode - Toggle Weights
  const toggleWeight = (
    currentGrid: GridType,
    row: number,
    col: number
  ): GridType => {
    const newGrid: GridType = currentGrid.map((r) =>
      r.map((tile) => ({ ...tile }))
    );

    const tile: TileType = newGrid[row][col];

    //Cycle through the weights
    if (tile.weight === 1) {
      tile.weight = 5;
      tile.isWall = false; //Remove wall if it was one
    } else if (tile.weight === 5) {
      tile.weight = 15;
    } else {
      tile.weight = 1; //Back to normal
    }

    return newGrid;
  };

  const handleMouseDown = (row: number, col: number): void => {
    if (isVisualizing) {
      return;
    }

    const tile: TileType = grid[row][col];

    //Check if dragging start or end node
    if (tile.isStart) {
      setDraggedNode("START");
      setIsMousePressed(true);
      return;
    }
    if (tile.isEnd) {
      setDraggedNode("END");
      setIsMousePressed(true);
      return;
    }

    //Don't modify start/end nodes
    if (tile.isStart || tile.isEnd) {
      return;
    }

    //In in weight mode, cycle through weights
    if (isWeightMode) {
      const newGrid = toggleWeight(grid, row, col);
      setGrid(newGrid);
    } else {
      //Normal mode - Toggle walls
      const newGrid = toggleWall(grid, row, col);
      setGrid(newGrid);
    }

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

    if (draggedNode === "START") {
      //Dont move start node on end node or walls, could be handled automatically by placing this below the below check, but still here for clarity
      if (tile.isEnd || tile.isWall) {
        return;
      }
      moveStartNode(row, col);
      return;
    }
    if (draggedNode === "END") {
      if (tile.isStart || tile.isWall) {
        return;
      }
      moveEndNode(row, col);
      return;
    }

    if (tile.isStart || tile.isEnd) {
      return;
    }

    if (isWeightMode) {
      //Weight Mode
      const newGrid = toggleWeight(grid, row, col);
      setGrid(newGrid);
    } else {
      //Normal mode
      const newGrid = toggleWall(grid, row, col);
      setGrid(newGrid);
    }
  };

  const handleMouseUp = (): void => {
    setIsMousePressed(false);
    //Unset dragged node
    setDraggedNode(null);
  };

  //MOVE DRAGGED NODES
  const moveStartNode = (newRow: number, newCol: number): void => {
    setGrid((prevGrid) => {
      const newGrid: GridType = prevGrid.map((r) =>
        r.map((tile) => ({
          ...tile,
          isStart: false, //Unset old start node
          //Clear path since on moving it becomes invalid
          isVisited: false,
          isPath: false,
          distance: Infinity,
          parent: null,
        }))
      );

      // //Unset old start position
      // for (let row = 0; row < newGrid.length; row++) {
      //   for (let col = 0; col < newGrid[0].length; col++) {
      //     if (newGrid[row][col].isStart) {
      //       newGrid[row][col].isStart = false;
      //     }
      //   }
      // }

      //Set new start position
      newGrid[newRow][newCol].isStart = true;

      //Remove if it was earlier a wall
      newGrid[newRow][newCol].isWall = false;

      return newGrid;
    });

    //Update START_NODE's const reference
    START_NODE.row = newRow;
    START_NODE.col = newCol;
  };

  const moveEndNode = (newRow: number, newCol: number): void => {
    setGrid((prevGrid) => {
      const newGrid: GridType = prevGrid.map((r) =>
        r.map((tile) => ({
          ...tile,
          isEnd: false, //Unset old end node
          //Clear older path since on dragging it becomes invalid
          isVisited: false,
          isPath: false,
          distance: Infinity,
          parent: null,
        }))
      );

      // //Unset older end node
      // for (let row = 0; row < newGrid.length; row++) {
      //   for (let col = 0; col < newGrid[0].length; col++) {
      //     if (newGrid[row][col].isEnd) {
      //       newGrid[row][col].isEnd = false;
      //     }
      //   }
      // }

      //Set new end
      newGrid[newRow][newCol].isEnd = true;

      //Remove if it was previously a wall
      newGrid[newRow][newCol].isWall = false;

      return newGrid;
    });

    //Update END_NODE's const reference
    END_NODE.row = newRow;
    END_NODE.col = newCol;
  };

  //VISUALIZATION LOGIC

  const visualizeAlgorithm = (): void => {
    if (isVisualizing) {
      return;
    }

    setIsVisualizing(true);

    clearPath(); //This is asynchronous, as it involed setting react state. So this depends on the Event loop to queue it accordingly. The reason it works is because the animations below depend on another asynchronous event which is setTimeout which is always queued after react state updates. So the event loop automatically ensures the order of execution turns out to be right.

    const gridCopy: GridType = grid.map((r) =>
      r.map((tile) => ({
        ...tile,
        //Setting it back to clean so as to ensure if the path is already present, the animation still runs as otherwise if we dont clear it and use visualize after it has already ran before, visited class will already be present in the tiles and the animation won't run as it only runs when the class is added for the first time, thats how the animation works.
        isVisited: false,
        isPath: false,
        distance: Infinity,
        parent: null,
      }))
    );

    const startTile = gridCopy[START_NODE.row][START_NODE.col];
    const endTile = gridCopy[END_NODE.row][END_NODE.col];

    let visitedTiles: TileType[] = [];

    if (algorithm === "BFS") {
      visitedTiles = bfs(gridCopy, startTile, endTile);
    } else if (algorithm === "DIJKSTRA") {
      visitedTiles = dijkstra(gridCopy, startTile, endTile);
    } else if (algorithm === "ASTAR") {
      visitedTiles = aStar(gridCopy, startTile, endTile);
    } else if (algorithm === "DFS") {
      visitedTiles = dfs(gridCopy, startTile, endTile);
    }

    const shortestPath = getShortestPath(endTile);

    animateAlgorithm(visitedTiles, shortestPath);
  };

  const animateAlgorithm = (
    visitedTiles: (typeof grid)[0],
    shortestPath: (typeof grid)[0]
  ): void => {
    const VISITED_ANIMATION_DELAY = 101 - speed; //Since this will directly affect the delay, so if user chooses a faster speed, the delay will be more. So to invert that, subtract from 101. Now for faster speeds, there will be a lesser delay, and a faster animation, which makes more sense.

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
      }, VISITED_ANIMATION_DELAY * i);
    }
  };

  const animatePath = (path: (typeof grid)[0]): void => {
    const PATH_ANIMATION_DELAY = (101 - speed) * 5; //Should be slower than visitedpathdelay, so multiplying by 5 to make it more noticeable

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
      }, PATH_ANIMATION_DELAY * i);
    }
  };

  //RESET FUNCTIONALITY

  const resetGrid = (): void => {
    if (isVisualizing) {
      return;
    }

    //Reset start and end nodes to default
    START_NODE.row = 10;
    START_NODE.col = 10;
    END_NODE.row = 10;
    END_NODE.col = 30;

    const newGrid: GridType = createInitialGrid();

    setGrid(newGrid);
  };

  //CLEAR PATH FUNCTIONALITY
  const clearPath = (): void => {
    if (isVisualizing) {
      return;
    }

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) =>
        r.map((tile) => ({
          ...tile,
          isPath: false,
          isVisited: false,
          distance: Infinity,
          parent: null,
        }))
      );

      return newGrid;
    });
  };

  //CLEAR WALLS FUNCTIONALITY
  const clearWalls = (): void => {
    if (isVisualizing) {
      return;
    }

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) =>
        r.map((tile) => ({
          ...tile,
          isWall: false,
        }))
      );
      return newGrid;
    });
  };

  //CLEAR WEIGHTS FUNCTIONALITY
  const clearWeights = (): void => {
    if (isVisualizing) {
      return;
    }

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) =>
        r.map((tile) => ({
          ...tile,
          weight: 1, //Reset weight to normal
        }))
      );

      return newGrid;
    });
  };

  //RENDER
  return (
    //adding mouseUp handler here so it works even if the mouse pointer leaves the grid
    <div className="visualizerWrapper" onMouseUp={handleMouseUp}>
      <div className="controls">
        <div className="algorithm-selector">
          <label htmlFor="algorithm-select">Algorithm:</label>
          <select
            id="algorithm-select"
            value={algorithm}
            onChange={handleAlgorithmChange}
            disabled={isVisualizing}
          >
            <option value="BFS">Breadth-First Search</option>
            <option value="DIJKSTRA">Dijkstra's Algorithm</option>
            <option value="ASTAR">A* Search</option>
            <option value="DFS">DFS</option>
          </select>
        </div>
        <button onClick={visualizeAlgorithm} disabled={isVisualizing}>
          Visualize{" "}
          {algorithm === "DIJKSTRA"
            ? "Dijkstra"
            : algorithm === "BFS"
            ? "BFS"
            : algorithm === "ASTAR"
            ? "A*"
            : "DFS"}
        </button>

        <button
          className={`weight-toggle ${isWeightMode ? "active" : ""}`}
          onClick={toggleWeightMode}
          disabled={isVisualizing}
        >
          {isWeightMode ? "Weight Mode" : "Wall Mode"}
        </button>
        <button
          className="maze-button"
          onClick={handleMazeGeneration}
          disabled={isVisualizing}
        >
          Generate Maze
        </button>
        <button
          className="clear-button"
          onClick={clearPath}
          disabled={isVisualizing}
        >
          Clear Path
        </button>
        <button
          className="clear-button"
          onClick={clearWalls}
          disabled={isVisualizing}
        >
          Clear Walls
        </button>
        <button
          className="clear-button"
          onClick={clearWeights}
          disabled={isVisualizing}
        >
          Clear Weights
        </button>
        <button
          className="reset-button"
          onClick={resetGrid}
          disabled={isVisualizing}
        >
          Reset
        </button>
        <div className="speed-control">
          <label htmlFor="speed-slider">
            Speed: <span className="speed-value">{speed}</span>
          </label>
          <input
            id="speed-slider"
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={handleSpeedChange}
            disabled={isVisualizing}
          />
        </div>
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
        <div className="legend-item">
          <span className="legend-box legend-weight-medium"></span>
          <span>Weight: 5</span>
        </div>
        <div className="legend-item">
          <span className="legend-box legend-weight-heavy"></span>
          <span>Weight: 15</span>
        </div>
      </div>
    </div>
  );
};

export default PathFindingVisualizer;
