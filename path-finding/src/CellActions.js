import { gridCl } from "./Grid";

export const CELL_TYPES = {
  EMPTY: 0,
  START: 1,
  END: 2,
  OBSTACLE: 3,
  OPENED: 4,
  CLOSED: 5,
  IS_ON_PATH: 6,
};

export const isFinishOrStart = (evt, cell) => {
  if (evt.altKey) {
    if (cell.cellType === CELL_TYPES.END) {
      gridCl.endCell = null;
      changeCellType(cell, CELL_TYPES.EMPTY);
    } else {
      if (gridCl.endCell != null) {
        changeCellType(gridCl.endCell, CELL_TYPES.EMPTY);
      }
      changeCellType(cell, CELL_TYPES.END);
      gridCl.endCell = cell;
    }
  } else if (evt.ctrlKey) {
    // if the cell is the start cell then make it empty
    if (cell.cellType === CELL_TYPES.START) {
      gridCl.startCell = null;
      changeCellType(cell, CELL_TYPES.EMPTY);
    } else {
      if (gridCl.startCell != null) {
        changeCellType(gridCl.startCell, CELL_TYPES.EMPTY);
      }
      // make the cell the start
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
      if (cell === gridCl.endCell) {
        return;
      } else if (cell === gridCl.startCell) {
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
