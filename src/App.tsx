import PathFindingVisualizer from "./features/pathfinding/PathfindingVisualizer";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>Pathfinding Visualizer</h1>
        <p>Pathfinding - Breadth-First Search (BFS)</p>
      </header>
      <PathFindingVisualizer />
    </div>
  );
};

export default App;
