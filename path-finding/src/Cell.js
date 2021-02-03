import React, { useState } from "react";
import { isFinishOrStart, determineCellType } from "./CellActions";
import "./cell.css";

export default class Cell {
  opened = false;
  // 0 = empty / 1 = start / 2 = end / 3 = obstacle
  cellType = 0;

  // the cost from this cell to the start cell
  gCost = 0;
  // the cost from this cell to the end cell
  hCost = 0;

  // the total cost
  fCost = () => this.hCost + this.gCost;

  // the index in the heap
  heapIndex = -1;

  // the referenced parent cell for backtracking and finding the path
  parentCell = null;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getCellColor = () => {
    switch (this.cellType) {
      case 0:
        return "rgba(221, 221, 221, 0.603)";
      case 1:
        return "green";
      case 2:
        return "red";
      case 3:
        return "black";
      default:
        throw new Error("Out of range exception");
    }
  };

  compareTo(cellToCompare) {
    // the cell with the lowest fCost will always be at the top of the heap(indexed at 0) therefore smaller fCosts will precede

    // -1 = precedes
    // 0 = equal
    // 1 = succeeds

    // if the fcost is smaller then the other cells fcost then it succeeds otherwise it precedes
    var comparison = this.fCost() < cellToCompare.fCost() ? 1 : -1;

    // if the fCosts are equal
    if (this.fCost() === cellToCompare.fCost()) {
      // if the hcost is smaller then the other cells hcost then it succeeds otherwise it is equal
      comparison = this.hCost < cellToCompare.hCost ? 1 : 0;
    }

    //return the comparison
    return comparison;
  }
}

var mouseDown = false;
var cellTypeOnMouseDown = -1;

export function CellSquare(props) {
  const { cell } = props;
  const [, setCellRerender] = useState(false);

  document.onmousedown = () => (mouseDown = true);

  document.onmouseup = () => {
    mouseDown = false;
    cellTypeOnMouseDown = -1;
  };

  return (
    <div
      className="cell"
      style={{ backgroundColor: cell.getCellColor() }}
      onMouseMove={(evt) =>
        determineCellType(
          evt,
          mouseDown,
          cellTypeOnMouseDown,
          cell,
          setCellRerender
        )
      }
      onMouseDown={(evt) => {
        cellTypeOnMouseDown = cell.cellType;
        determineCellType(
          evt,
          true,
          cellTypeOnMouseDown,
          cell,
          setCellRerender
        );
      }}
      onClick={(evt) => isFinishOrStart(evt, cell, setCellRerender)}
    ></div>
  );
}
