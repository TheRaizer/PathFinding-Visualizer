import React, { useReducer, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
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
        <Col>
          <InputGroup className="mt-4">
            <InputGroup.Prepend>
              <InputGroup.Text id="prepending-text">
                Animation Interval (ms)
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              id="basic-number"
              aria-describedby="prepending-text"
              value={animationInterval}
              onChange={(evt) => {
                setAnimationInterval(evt.target.value);
                searchVars.searchAnimationTime = evt.target.value;
              }}
            />
          </InputGroup>
        </Col>
        <Col className="can-cross-diagonals">
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Can Cross Diagonals"
              checked={canCrossDiagonals}
              onChange={() =>
                setCanCrossDiagonals((canCrossDiagonals) => !canCrossDiagonals)
              }
            />
          </Form>
        </Col>
        <Col xs={4} className="algorithms">
          <Button
            variant="outline-dark"
            onClick={() => createMaze(startRecursiveDivision, dispatch)}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Create Maze
          </Button>
          <Button
            variant="outline-dark"
            onClick={() => executePathFinding(AStarSearch)}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            A*
          </Button>
          <Button
            variant="outline-dark"
            onClick={() => executePathFinding(dijkstrasSearch)}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Dijkstras
          </Button>
          <Button
            variant="outline-dark"
            onClick={() => executePathFinding(breadthFirstSearch)}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Breadth First Search
          </Button>
          <Button
            variant="outline-dark"
            onClick={() => executePathFinding(bestFirstSearch)}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Best First Search
          </Button>
        </Col>
        <Col className="clears">
          <Button
            variant="outline-danger"
            onClick={() => {
              if (!searchVars.isSearching && !mazeVars.isCreatingMaze) {
                gridCl.clearEntireGrid();
              }
            }}
            type="button"
            className={
              state.isSearching || state.isCreatingMaze ? "disabled" : ""
            }
          >
            Clear Entire Grid
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => {
              if (!mazeVars.isCreatingMaze) {
                gridCl.clearWalls();
              }
            }}
            type="button"
            className={state.isCreatingMaze ? "disabled" : ""}
          >
            Clear Walls
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => {
              if (searchVars.isSearching) {
                searchVars.stopSearch = true;
              }
            }}
            type="button"
            className={state.isSearching ? "" : "disabled"}
          >
            Stop Search
          </Button>
        </Col>
        <Col xs={2}>
          <p>
            <b>Ctrl Click:</b> set start cell
          </p>
          <p>
            <b>Alt Click:</b> set end cell
          </p>
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
