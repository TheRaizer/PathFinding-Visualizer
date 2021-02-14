import React, { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import AStarPathFind from "./AStarAlgorithm";
import DijkstrasPathFind from "./DijkstrasAlgorithm";
import BreadthFirstSearch from "./BreadthFirstSearch";
import CreateMaze from "./RecursiveDivision";
import { searchVars } from "./Search";
import { gridCl } from "./Grid";
import { mazeVars } from "./Maze";
import "./header.css";

function Header() {
  const [canCrossDiagonals, setCanCrossDiagonals] = useState(true);
  const [animationInterval, setAnimationInterval] = useState(15);
  const [missingCell, setMissingCell] = useState(false);

  return (
    <Container id="header" className="py-5" fluid>
      <Row>
        <Col>Ctrl Click: set start cell</Col>
        <Col>Alt Click: set end cell</Col>
        <Col>
          <button onClick={CreateMaze}>Create Maze</button>
          <button
            onClick={() => {
              if (gridCl.startCell != null && gridCl.endCell != null) {
                AStarPathFind(canCrossDiagonals, animationInterval);
              } else {
                setMissingCell(true);
              }
            }}
          >
            A*
          </button>
          <button
            onClick={() => {
              if (gridCl.startCell != null && gridCl.endCell != null) {
                DijkstrasPathFind(canCrossDiagonals, animationInterval);
              } else {
                setMissingCell(true);
              }
            }}
          >
            Dijkstras
          </button>
          <button
            onClick={() => {
              if (gridCl.startCell != null && gridCl.endCell != null) {
                BreadthFirstSearch(canCrossDiagonals, animationInterval);
              } else {
                setMissingCell(true);
              }
            }}
          >
            Breadth First Search
          </button>
        </Col>
        <Col>
          <button
            onClick={() => {
              if (!searchVars.isSearching && !mazeVars.isCreatingMaze) {
                gridCl.clearEntireGrid();
              }
            }}
          >
            Clear Entire Grid
          </button>
          <button
            onClick={() => {
              if (!mazeVars.isCreatingMaze) {
                gridCl.clearWalls();
              }
            }}
          >
            Clear Walls
          </button>
          <button
            onClick={() => {
              if (searchVars.isSearching) {
                searchVars.stopSearch = true;
              }
            }}
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
