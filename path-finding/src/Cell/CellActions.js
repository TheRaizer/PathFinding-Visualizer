import { gridCl } from "../Grid/Grid";
import { searchVars } from "../Search";

export const CELL_TYPES = {
  EMPTY: 0,
  START: 1,
  END: 2,
  OBSTACLE: 3,
};

export const assignFinishOrStart = (evt, cell) => {
  // you cannot reassign start and end cells when searching
  if (searchVars.isSearching) {
    return;
  }
  if (evt.altKey) {
    // if the cell is the end cell
    if (cell.cellType === CELL_TYPES.END) {
      gridCl.endCell = null;
      changeCellType(cell, CELL_TYPES.EMPTY);
    } else {
      // if the start cell is this cell
      if (cell.cellType === CELL_TYPES.START) {
        // empty the start cell
        gridCl.startCell = null;
      }
      // if there is a end cell
      if (gridCl.endCell != null) {
        // empty the end cell
        changeCellType(gridCl.endCell, CELL_TYPES.EMPTY);
      }
      // change the end cell to be this cell
      changeCellType(cell, CELL_TYPES.END);
      gridCl.endCell = cell;
    }
  } else if (evt.ctrlKey) {
    // if the cell is the start cell then make it empty
    if (cell.cellType === CELL_TYPES.START) {
      gridCl.startCell = null;
      changeCellType(cell, CELL_TYPES.EMPTY);
    } else {
      // if the cell type is the end
      if (cell.cellType === CELL_TYPES.END) {
        // empty the end cell
        gridCl.endCell = null;
      }

      // if there is a start cell
      if (gridCl.startCell != null) {
        // empty it
        changeCellType(gridCl.startCell, CELL_TYPES.EMPTY);
      }
      // make this cell the start
      changeCellType(cell, CELL_TYPES.START);
      gridCl.startCell = cell;
    }
  }
};

export const cellIsStartOrEnd = (posX, posY) => {
  return (
    gridCl.grid[posY][posX] === gridCl.startCell ||
    gridCl.grid[posY][posX] === gridCl.endCell
  );
};

export const determineCellType = (
  evt,
  mouseDown,
  cellTypeOnMouseDown,
  cell
) => {
  // if the mouse button is down
  if (mouseDown) {
    // if the mouse button has been lifted leave func
    if (cellTypeOnMouseDown === -1) return;
    // if the cellType the mouse is down on to start is empty than we will be putting walls vice-versa
    const cellType =
      cellTypeOnMouseDown === CELL_TYPES.EMPTY
        ? CELL_TYPES.OBSTACLE
        : CELL_TYPES.EMPTY;

    // if the cellType is not equal to the celltype we are drawing and the alt and ctrl key are not down
    if (cell.cellType !== cellType && !evt.altKey && !evt.ctrlKey) {
      // if the cell is start or end then do not change cell type
      if (cellIsStartOrEnd(cell.x, cell.y)) {
        return;
      }
      // if they are closed or opened and we are searching then do not change cell type
      if ((cell.closed || cell.opened) && searchVars.isSearching) {
        return;
      }
      // change cell type to be the cellType we are drawing
      changeCellType(cell, cellType);
    }
  }
};

const changeCellType = (cell, cellType) => {
  // change cell type and rerender the cell
  cell.cellType = cellType;
  cell.setCellRerender((rerender) => !rerender);
};

export function compareAStarCells(a, b) {
  // the lower the fCost the higher up in the heap the must be
  var comparison = a.fCost() < b.fCost() ? -1 : 1;

  // if the fCosts are equal
  if (a.fCost() === b.fCost()) {
    // if the hcost is smaller then the other cells hcost then it succeeds otherwise it is equal
    comparison = a.hCost < b.hCost ? -1 : 0;
  }

  return comparison;
}

export function compareDijkstrasCells(a, b) {
  // the lower the gCost the higher up in the heap the cell must be
  var comparison = a.gCost < b.gCost ? -1 : 1;
  if (a.gCost === b.gCost) {
    comparison = 0;
  }
  return comparison;
}

export function compareBestFirstCells(a, b) {
  // the lower the hCost the higher up in the heap the cell must be
  var comparison = a.hCost < b.hCost ? -1 : 1;
  if (a.hCost === b.hCost) {
    comparison = 0;
  }
  return comparison;
}
