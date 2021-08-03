import React, { useEffect, useState } from "react";
import {
  assignFinishOrStart,
  determineCellType,
  CELL_TYPES,
} from "./CellActions";
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
          return "rgba(221, 221, 221, 0.603)";
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
      return "lightskyblue";
    } else if (this.closed) {
      return "lightgray";
    } else if (this.opened) {
      return "lightgreen";
    }
  };
}

var mouseDown = false;
var cellTypeOnMouseDown = -1;

export function CellSquareState(props) {
  const { cell } = props;
  const [, setCellRerender] = useState(false);

  useEffect(() => {
    if (cell.rerenderCell == null) {
      cell.setCellRerender = setCellRerender;
    }
  }, [cell]);

  document.onmousedown = () => (mouseDown = true);

  document.onmouseup = () => {
    mouseDown = false;
    cellTypeOnMouseDown = -1;
  };

  return <CellSquare state={{ cell }} />;
}

function CellSquare({ state }) {
  const { cell } = state;
  return (
    <div
      className={"cell"}
      style={{ backgroundColor: cell.getCellColor() }}
      onMouseMove={(evt) =>
        determineCellType(evt, mouseDown, cellTypeOnMouseDown, cell)
      }
      onMouseDown={(evt) => {
        cellTypeOnMouseDown = cell.cellType;
        determineCellType(evt, true, cellTypeOnMouseDown, cell);
      }}
      onClick={(evt) => assignFinishOrStart(evt, cell)}
    ></div>
  );
}
