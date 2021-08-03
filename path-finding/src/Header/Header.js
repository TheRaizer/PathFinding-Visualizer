import React, { useReducer, useState } from "react";
import AStarSearch from "../PathFindingAlgos/AStarAlgorithm";
import dijkstrasSearch from "../PathFindingAlgos/DijkstrasAlgorithm";
import breadthFirstSearch from "../PathFindingAlgos/BreadthFirstSearch";
import bestFirstSearch from "../PathFindingAlgos/BestFirstSearch";
import startRecursiveDivision from "../MazeAlgos/RecursiveDivision";
import { searchVars, pathFind } from "../Search";
import { gridCl } from "../Grid/Grid";
import { mazeVars, createMaze } from "../Maze";
import algoReducer, { initialState } from "../AlgorithmReducer";
import { clamp } from "../UtilityFuncs";
import "./header.css";

function Header() {
  const [state, dispatch] = useReducer(algoReducer, initialState);

  const [canCrossDiagonals, setCanCrossDiagonals] = useState(true);
  const [animationInterval, setAnimationInterval] = useState(15);
  const [missingCell, setMissingCell] = useState(false);

  const executePathFinding = (algorithm) => {
    if (gridCl.startCell != null && gridCl.endCell != null) {
      pathFind(canCrossDiagonals, dispatch, algorithm);
    } else {
      setMissingCell(true);
    }
  };

  return (
    <section className="header">
      <div className="main">
        <section id="click-instructions">
          <h4>Ctrl Click: set start cell</h4>
          <h4>Alt Click: set end cell</h4>
        </section>
        <div>
          <div className="input-with-prepending">
            <h5>Animation Interval (ms)</h5>
            <input
              value={animationInterval}
              onChange={(evt) => {
                if (evt.target.value !== "") {
                  let interval = clamp(
                    parseFloat(evt.target.value),
                    searchVars.minSearchTime,
                    searchVars.maxSearchTime
                  );
                  setAnimationInterval(interval);
                  searchVars.searchAnimationTime = interval;
                }
              }}
              min={searchVars.minSearchTime}
              max={searchVars.maxSearchTime}
              type="number"
            />
          </div>
          <div className="input-with-prepending">
            <h5>Can Cross Diagonals</h5>
            <input
              id="diagonals-checkbox"
              type="checkbox"
              checked={canCrossDiagonals}
              onChange={() =>
                setCanCrossDiagonals((canCrossDiagonals) => !canCrossDiagonals)
              }
            />
            <span className="slider round"></span>
          </div>
        </div>
        <button
          onClick={() => createMaze(startRecursiveDivision, dispatch)}
          className={
            state.isSearching || state.isCreatingMaze ? "disabled" : ""
          }
        >
          Create Maze
        </button>
        <section className="algorithms">
          <h4>Pathfinding Algorithms</h4>
          <button
            onClick={() => executePathFinding(AStarSearch)}
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            A*
          </button>
          <button
            onClick={() => executePathFinding(dijkstrasSearch)}
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Dijkstras
          </button>
          <button
            onClick={() => executePathFinding(breadthFirstSearch)}
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Breadth First Search
          </button>
          <button
            onClick={() => executePathFinding(bestFirstSearch)}
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Best First Search
          </button>
        </section>
        <section className="clears">
          <h4>Clearing Options</h4>
          <button
            onClick={() => {
              if (!searchVars.isSearching && !mazeVars.isCreatingMaze) {
                gridCl.clearEntireGrid();
              }
            }}
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Clear Entire Grid
          </button>
          <button
            onClick={() => {
              if (!mazeVars.isCreatingMaze && !searchVars.isSearching) {
                gridCl.clearWalls();
              }
            }}
            className={
              state.isCreatingMaze || searchVars.isSearching ? "disabled" : ""
            }
          >
            Clear Walls
          </button>
          <button
            onClick={() => {
              if (searchVars.isSearching) {
                searchVars.stopSearch = true;
              }
            }}
            type="button"
            className={state.isSearching ? "" : "disabled"}
          >
            Stop Search
          </button>
        </section>
      </div>
      <div
        className={`notif ${missingCell ? "appear" : ""}`}
        onClose={() => setMissingCell(false)}
      >
        <div>
          <h4>You are missing a start or end cell</h4>
        </div>
      </div>
    </section>
  );
}

export default Header;
