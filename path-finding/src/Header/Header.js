import React, { useReducer, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import AStarSearch from "../PathFindingAlgos/AStarAlgorithm";
import dijkstrasSearch from "../PathFindingAlgos/DijkstrasAlgorithm";
import breadthFirstSearch from "../PathFindingAlgos/BreadthFirstSearch";
import bestFirstSearch from "../PathFindingAlgos/BestFirstSearch";
import startRecursiveDivision from "../MazeAlgos/RecursiveDivision";
import { searchVars, pathFind } from "../Search";
import { gridCl } from "../Grid/Grid";
import { mazeVars, createMaze } from "../Maze";
import algoReducer, { initialState } from "../AlgorithmReducer";
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
    <Container id="header" className="py-3" fluid>
      <Row className="unselectable">
        <Col xs={2}>
          <p>Ctrl Click: set start cell</p>
          <p>Alt Click: set end cell</p>
        </Col>
        <Col xs={4} className="algorithms">
          <button
            onClick={() => createMaze(startRecursiveDivision, dispatch)}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze
                ? "btn btn-outline-dark disabled"
                : "btn btn-outline-dark"
            }
          >
            Create Maze
          </button>
          <button
            onClick={() => executePathFinding(AStarSearch)}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze
                ? "btn btn-outline-dark disabled"
                : "btn btn-outline-dark"
            }
          >
            A*
          </button>
          <button
            onClick={() => executePathFinding(dijkstrasSearch)}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze
                ? "btn btn-outline-dark disabled"
                : "btn btn-outline-dark"
            }
          >
            Dijkstras
          </button>
          <button
            onClick={() => executePathFinding(breadthFirstSearch)}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze
                ? "btn btn-outline-dark disabled"
                : "btn btn-outline-dark"
            }
          >
            Breadth First Search
          </button>
          <button
            onClick={() => executePathFinding(bestFirstSearch)}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze
                ? "btn btn-outline-dark disabled"
                : "btn btn-outline-dark"
            }
          >
            Best First Search
          </button>
        </Col>
        <Col>
          <button
            onClick={() => {
              if (!searchVars.isSearching && !mazeVars.isCreatingMaze) {
                gridCl.clearEntireGrid();
              }
            }}
            type="button"
            className={
              state.isCreatingMaze
                ? "btn btn-outline-danger disabled"
                : "btn btn-outline-danger"
            }
          >
            Clear Entire Grid
          </button>
          <button
            onClick={() => {
              if (!mazeVars.isCreatingMaze) {
                gridCl.clearWalls();
              }
            }}
            type="button"
            className={
              state.isCreatingMaze
                ? "btn btn-outline-danger disabled"
                : "btn btn-outline-danger"
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
            className={
              state.isSearching
                ? "btn btn-outline-danger"
                : "btn btn-outline-danger disabled"
            }
          >
            Stop Search
          </button>
        </Col>
        <Col>
          <input
            type="checkbox"
            checked={canCrossDiagonals}
            onChange={() =>
              setCanCrossDiagonals((canCrossDiagonals) => !canCrossDiagonals)
            }
          />
          Can Cross Diagonals
        </Col>
        <Col>
          <p>Animation Interval (ms)</p>
          <input
            type="number"
            value={animationInterval}
            onChange={(evt) => {
              setAnimationInterval(evt.target.value);
              searchVars.searchAnimationTime = evt.target.value;
            }}
          />
        </Col>
      </Row>
      {missingCell ? (
        <Alert
          variant={"danger"}
          onClose={() => setMissingCell(false)}
          dismissible
        >
          <Alert.Heading>You are missing a start or end cell</Alert.Heading>
        </Alert>
      ) : (
        <div></div>
      )}
    </Container>
  );
}

export default Header;
