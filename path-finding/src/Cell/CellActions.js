import { gridCl } from "../Grid/Grid";
import { searchVars } from "../Search";

export const CELL_TYPES = {
  EMPTY: 0,
  START: 1,
  END: 2,
  OBSTACLE: 3,
};
// assigns the start and end cells depending on which cell you click and whether Ctrl or Alt is down.
export const assignFinishOrStart = (evt, cell) => {
  if (searchVars.isSearching) {
    return;
  }
  if (evt.altKey) {
    if (cell.cellType === CELL_TYPES.END) {
      gridCl.endCell = null;
      changeCellType(cell, CELL_TYPES.EMPTY);
    } else {
      if (cell.cellType === CELL_TYPES.START) {
        gridCl.startCell = null;
      }
      if (gridCl.endCell != null) {
        changeCellType(gridCl.endCell, CELL_TYPES.EMPTY);
      }
      changeCellType(cell, CELL_TYPES.END);
      gridCl.endCell = cell;
    }
  } else if (evt.ctrlKey) {
    if (cell.cellType === CELL_TYPES.START) {
      gridCl.startCell = null;
      changeCellType(cell, CELL_TYPES.EMPTY);
    } else {
      if (cell.cellType === CELL_TYPES.END) {
        gridCl.endCell = null;
      }

      if (gridCl.startCell != null) {
        changeCellType(gridCl.startCell, CELL_TYPES.EMPTY);
      }
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

// determines the cell type when the mouse is down/hovering over the given cell
export const determineCellType = (
  evt,
  mouseDown,
  cellTypeOnMouseDown,
  cell
) => {
  if (mouseDown) {
    if (cellTypeOnMouseDown === -1) return;
    const cellType =
      cellTypeOnMouseDown === CELL_TYPES.EMPTY
        ? CELL_TYPES.OBSTACLE
        : CELL_TYPES.EMPTY;

    if (cell.cellType !== cellType && !evt.altKey && !evt.ctrlKey) {
      if (cellIsStartOrEnd(cell.x, cell.y)) {
        return;
      }
      if ((cell.closed || cell.opened) && searchVars.isSearching) {
        return;
      }
      changeCellType(cell, cellType);
    }
  }
};

const changeCellType = (cell, cellType) => {
  cell.cellType = cellType;
  cell.setCellRerender((rerender) => !rerender);
};

// compare cells by fCost and if needed by hCost
export function compareFCost(a, b) {
  var comparison = a.fCost() < b.fCost() ? -1 : 1;

  if (a.fCost() === b.fCost()) {
    comparison = a.hCost < b.hCost ? -1 : 0;
  }

  return comparison;
}

// compare cells by gCost
export function compareGCost(a, b) {
  var comparison = a.gCost < b.gCost ? -1 : 1;
  if (a.gCost === b.gCost) {
    comparison = 0;
  }
  return comparison;
}

// compare cells by hCost
export function compareHCost(a, b) {
  var comparison = a.hCost < b.hCost ? -1 : 1;
  if (a.hCost === b.hCost) {
    comparison = 0;
  }
  return comparison;
}
