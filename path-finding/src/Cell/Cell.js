import React, { useEffect, useState } from "react";
import {
  assignFinishOrStart,
  determineCellType,
  CELL_TYPES,
} from "./CellActions";
import { SEARCH_TYPES } from "../Search";
import "./cell.css";

export default class Cell {
  setCellRerender = null;
  isOnPath = false;
  opened = false;
  closed = false;
  cellType = CELL_TYPES.EMPTY;

  // #region A* path finding

  // the cost from this cell to the start cell
  gCost = Number.MAX_SAFE_INTEGER;
  // the cost from this cell to the end cell
  hCost = 0;

  // the total cost
  fCost = () => this.hCost + this.gCost;
  // #endregion

  // the index in the heap
  heapIndex = -1;

  // the referenced parent cell for backtracking and finding the path
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

  compareTo(cellToCompare, searchType) {
    // the cell with the lowest fCost will always be at the top of the heap(indexed at 0) therefore smaller fCosts will precede

    // -1 = precedes
    // 0 = equal
    // 1 = succeeds
    var comparison = 0;
    switch (searchType) {
      case SEARCH_TYPES.A_STAR:
        // if the fcost is smaller then the other cells fcost then it succeeds otherwise it precedes
        comparison = this.fCost() < cellToCompare.fCost() ? 1 : -1;

        // if the fCosts are equal
        if (this.fCost() === cellToCompare.fCost()) {
          // if the hcost is smaller then the other cells hcost then it succeeds otherwise it is equal
          comparison = this.hCost < cellToCompare.hCost ? 1 : 0;
        }

        //return the comparison
        return comparison;
      case SEARCH_TYPES.DIJKSTRA:
        comparison = this.gCost < cellToCompare.gCost ? 1 : -1;
        if (this.gCost === cellToCompare.gCost) {
          comparison = 0;
        }
        return comparison;
      case SEARCH_TYPES.BEST_FIRST:
        comparison = this.hCost < cellToCompare.hCost ? 1 : -1;
        if (this.hCost === cellToCompare.hCost) {
          comparison = 0;
        }
        return comparison;
      default:
        throw new Error("No proper search type given");
    }
  }
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
  const [cellClass, setCellClass] = useState("load-cell");

  return (
    <div
      className={cellClass}
      style={{ backgroundColor: cell.getCellColor() }}
      onMouseMove={(evt) =>
        determineCellType(evt, mouseDown, cellTypeOnMouseDown, cell)
      }
      onMouseDown={(evt) => {
        cellTypeOnMouseDown = cell.cellType;
        determineCellType(evt, true, cellTypeOnMouseDown, cell);
      }}
      onMouseOver={() => {
        if (cellClass !== "cell-hovered") {
          setCellClass("cell-hovered");
        }
      }}
      onMouseLeave={() => {
        if (cellClass !== "cell-unhovered") {
          setCellClass("cell-unhovered");
        }
      }}
      onClick={(evt) => assignFinishOrStart(evt, cell)}
    >
      <p>{/* X: {cell.x} Y: {cell.y} */}</p>
    </div>
  );
}
