import React, { useEffect, useState } from "react";
import { isFinishOrStart, determineCellType } from "./CellActions";
import { SEARCH_TYPES } from "./Search";
import "./cell.css";

export default class Cell {
  setCellRerender = null;
  isOnPath = false;
  opened = false;
  closed = false;
  // 0 = empty / 1 = start / 2 = end / 3 = obstacle
  cellType = 0;

  // #region A* path finding
  // the cost from this cell to the start cell
  gCost = 0;
  // the cost from this cell to the end cell
  hCost = 0;

  // the total cost
  fCost = () => this.hCost + this.gCost;
  // #endregion

  // the index in the heap
  heapIndex = -1;

  dijkstraShortest = Number.MAX_VALUE;

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
        comparison =
          this.dijkstraShortest < cellToCompare.dijkstraShortest ? 1 : -1;
        if (this.dijkstraShortest === cellToCompare.dijkstraShortest) {
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
  return (
    <div
      className="cell"
      style={{ backgroundColor: cell.getCellColor() }}
      onMouseMove={(evt) =>
        determineCellType(evt, mouseDown, cellTypeOnMouseDown, cell)
      }
      onMouseDown={(evt) => {
        cellTypeOnMouseDown = cell.cellType;
        determineCellType(evt, true, cellTypeOnMouseDown, cell);
      }}
      onClick={(evt) => isFinishOrStart(evt, cell)}
    >
      <p>{/* X: {cell.x} Y: {cell.y} */}</p>
    </div>
  );
}
