import React, { useReducer, useState } from "react";
import AStarSearch from "../PathFindingAlgos/AStarAlgorithm";
import dijkstrasSearch from "../PathFindingAlgos/DijkstrasAlgorithm";
import breadthFirstSearch from "../PathFindingAlgos/BreadthFirstSearch";
import bestFirstSearch from "../PathFindingAlgos/BestFirstSearch";
import startRecursiveDivision from "../MazeAlgos/RecursiveDivision";
import closeIcon from "./Icons/close-icon.png";
import { searchVars, pathFind } from "../Search";
import { gridCl } from "../Grid/Grid";
import { createMaze } from "../Maze";
import algoReducer, { ALGO_ACTIONS, initialState } from "../AlgorithmReducer";
import { clamp } from "../UtilityFuncs";
import "./header.css";

function Header() {
  // this reducer changes state during pathfinding and allows this header to rerender.
  const [state, dispatch] = useReducer(algoReducer, initialState);

  const [canCrossDiagonals, setCanCrossDiagonals] = useState(true);
  const [animationInterval, setAnimationInterval] = useState(15);

  const executePathFinding = (algorithm) => {
    if (gridCl.startCell != null && gridCl.endCell != null) {
      pathFind(canCrossDiagonals, dispatch, algorithm);
    }
  };
  return (
    <section className="header">
      <div className="main">
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
                    Number.MAX_VALUE
                  );
                  searchVars.searchAnimationTime = interval;
                }
                setAnimationInterval(evt.target.value);
              }}
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
        <section>
          <h4>Create Obstacles</h4>
          <button
            onClick={() => createMaze(startRecursiveDivision, dispatch)}
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Create Maze
          </button>
        </section>
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
              gridCl.clearEntireGrid();
            }}
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Clear Entire Grid
          </button>
          <button
            onClick={() => {
              gridCl.clearWalls();
            }}
            className={
              state.isCreatingMaze || searchVars.isSearching ? "disabled" : ""
            }
          >
            Clear Walls
          </button>
          <button
            onClick={() => {
              searchVars.stopSearch = true;
            }}
            type="button"
            className={state.isSearching ? "" : "disabled"}
          >
            Stop Search
          </button>
        </section>
      </div>
      <div className={`notif ${state.foundPath === true ? "" : "appear"}`}>
        <div>
          <h4>No path was found!</h4>
          <button
            onClick={() => {
              dispatch({ type: ALGO_ACTIONS.FOUND_PATH, payload: true });
            }}
          >
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Header;
