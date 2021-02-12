import { gridCl } from "./Grid";
import { searchVars } from "./Search";

export const CELL_TYPES = {
  EMPTY: 0,
  START: 1,
  END: 2,
  OBSTACLE: 3,
};

export const isFinishOrStart = (evt, cell) => {
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
      if (cell === gridCl.endCell || cell === gridCl.startCell) {
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
