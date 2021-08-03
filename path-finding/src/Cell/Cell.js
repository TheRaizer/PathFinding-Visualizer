import React, { useEffect, useState } from "react";
import { determineCellType, CELL_TYPES } from "./CellActions";
import "./cell.css";

/*The Grid
The class that handles the color, costs, and states of a cell.
 */
export default class Cell {
  setCellRerender = null;
  isOnPath = false;
  opened = false;
  closed = false;
  cellType = CELL_TYPES.EMPTY;

  // the cost from this cell to the start cell
  gCost = 0;

  // the cost from this cell to the end cell
  hCost = 0;

  // the total cost
  fCost = () => this.hCost + this.gCost;

  heapIndex = -1;

  // contains another Cell instance used for retracing a path
  parentCell = null;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getCellColor = () => {
    if (
      (!this.opened && !this.isOnPath && !this.closed) ||
      this.cellType !== 0
    ) {
      switch (this.cellType) {
        case CELL_TYPES.EMPTY:
          return "rgba(216, 216, 216, 0.808)";
        case CELL_TYPES.START:
          return "green";
        case CELL_TYPES.END:
          return "red";
        case CELL_TYPES.OBSTACLE:
          return "black";
        default:
          throw new Error("Out of range exception");
      }
    } else if (this.isOnPath) {
      return "rgb(94, 193, 255)";
    } else if (this.closed) {
      return "gray";
    } else if (this.opened) {
      return "rgb(117, 226, 117)";
    }
  };
}

var cellTypeOnMouseDown = -1;

export function CellSquareState(props) {
  const { cell } = props;
  const [, setCellRerender] = useState(false);

  useEffect(() => {
    if (cell.rerenderCell == null) {
      cell.setCellRerender = setCellRerender;
    }
  }, [cell]);

  document.onmouseup = () => {
    cellTypeOnMouseDown = -1;
  };

  return <CellSquare state={{ cell }} />;
}

function CellSquare({ state }) {
  const { cell } = state;
  return (
    <div
      className={`cell ${
        cell.cellType === CELL_TYPES.START || cell.cellType === CELL_TYPES.END
          ? "main"
          : ""
      }`}
      style={{ backgroundColor: cell.getCellColor() }}
      onMouseMove={() => determineCellType(cellTypeOnMouseDown, cell)}
      onMouseDown={() => {
        cellTypeOnMouseDown = cell.cellType;
        determineCellType(cellTypeOnMouseDown, cell);
      }}
    ></div>
  );
}
