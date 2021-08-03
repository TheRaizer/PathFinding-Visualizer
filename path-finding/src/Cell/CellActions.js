import { gridCl } from "../Grid/Grid";
import { searchVars } from "../Search";

export const CELL_TYPES = {
  EMPTY: 0,
  START: 1,
  END: 2,
  OBSTACLE: 3,
};

/** Determines whether a given position is a start or end cell.
 *
 * @param {Number} posX - the x position of the cell.
 * @param {Number} posY - the y position of the cell.
 * @returns {Boolean} whether the position is a start or end cell.
 */
export const cellIsStartOrEnd = (posX, posY) => {
  return (
    gridCl.grid[posY][posX] === gridCl.startCell ||
    gridCl.grid[posY][posX] === gridCl.endCell
  );
};

/** Determines the cell type when mouse is down.
 *
 * @param {CELL_TYPES} cellTypeOnMouseDown - the initial cell type that the mouse was first clicked down on.
 * @param {Cell} cell - the cell that the mouse is currently over.
 */
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
    let hasMoved = moveStartEndCell(cellTypeOnMouseDown, cell);
    if (hasMoved) {
      return;
    }
  }
  if ((cell.closed || cell.opened) && searchVars.isSearching) {
    return;
  }
  changeCellType(cell, cellType);
};

var prevCellType = CELL_TYPES.EMPTY;
/** Moves the start or end cell if needed.
 *
 * @param {CELL_TYPES} cellTypeOnMouseDown - the initial cell type that the mouse was first clicked down on.
 * @param {Cell} cell - the cell that the mouse is currently over.
 * @returns whether the start or end cell was moved.
 */
const moveStartEndCell = (cellTypeOnMouseDown, cell) => {
  // if the cell is the start, reset the previous start cell back to what it was and fill the current cell as start
  if (cellTypeOnMouseDown === CELL_TYPES.START) {
    changeCellType(gridCl.startCell, prevCellType);

    prevCellType = cell.cellType;
    gridCl.startCell = cell;
    changeCellType(cell, CELL_TYPES.START);
    return true;
  }

  // if the cell is the end, reset the previous end cell back to what it was and fill the current cell as end
  if (cellTypeOnMouseDown === CELL_TYPES.END) {
    changeCellType(gridCl.endCell, prevCellType);
    prevCellType = cell.cellType;
    gridCl.endCell = cell;
    changeCellType(cell, CELL_TYPES.END);
    return true;
  }

  return false;
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
