import { gridCl } from "../Grid/Grid";
import { searchVars } from "../Search";

export const CELL_TYPES = {
  EMPTY: 0,
  START: 1,
  END: 2,
  OBSTACLE: 3,
};

export const cellIsStartOrEnd = (posX, posY) => {
  return (
    gridCl.grid[posY][posX] === gridCl.startCell ||
    gridCl.grid[posY][posX] === gridCl.endCell
  );
};

var prevCellType = CELL_TYPES.EMPTY;

// determines the cell type when the mouse is down/hovering over the given cell
export const determineCellType = (cellTypeOnMouseDown, cell) => {
  // if the mouse has been released return
  if (cellTypeOnMouseDown === -1) return;
  const cellType =
    cellTypeOnMouseDown === CELL_TYPES.EMPTY
      ? CELL_TYPES.OBSTACLE
      : CELL_TYPES.EMPTY;

  // if we are making a wall or erasing a wall and the cell is either start or end don't change it.
  if (
    (cellType !== CELL_TYPES.START || cellType !== CELL_TYPES.END) &&
    cellIsStartOrEnd(cell.x, cell.y)
  ) {
    return;
  }

  if (!searchVars.isSearching) {
    // if the cell is the start, empty the previous start cell and fill the current cell as start
    if (cellTypeOnMouseDown === CELL_TYPES.START) {
      changeCellType(gridCl.startCell, prevCellType);

      prevCellType = cell.cellType;
      gridCl.startCell = cell;
      changeCellType(cell, CELL_TYPES.START);
      return;
    }

    // if the cell is the end, empty the previous end cell and fill the current cell as end
    if (cellTypeOnMouseDown === CELL_TYPES.END) {
      changeCellType(gridCl.endCell, prevCellType);
      prevCellType = cell.cellType;
      gridCl.endCell = cell;
      changeCellType(cell, CELL_TYPES.END);
      return;
    }
  }
  if ((cell.closed || cell.opened) && searchVars.isSearching) {
    return;
  }
  changeCellType(cell, cellType);
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
