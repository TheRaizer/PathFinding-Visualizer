import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import AStarPathFind from "./AStarAlgorithm";
import { gridCl } from "./Grid";
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
          <h4>
            {missingCell ? "You are either missing a Start or End cell" : ""}
          </h4>
          <button
            onClick={() => {
              if (gridCl.startCell != null && gridCl.endCell != null) {
                AStarPathFind(canCrossDiagonals, animationInterval);
              } else {
                setMissingCell(true);
              }
            }}
          >
            A* PathFind
          </button>
          <button onClick={gridCl.clearEntireGrid}>Clear Entire Grid</button>
          <button onClick={gridCl.clearWalls}>Clear Walls</button>
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
            onChange={(evt) => setAnimationInterval(evt.target.value)}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Header;
