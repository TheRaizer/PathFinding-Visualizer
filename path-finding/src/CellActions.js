import { gridCl } from "./Grid";

export const CELL_TYPES = {
  EMPTY: 0,
  START: 1,
  END: 2,
  OBSTACLE: 3,
};

export const isFinishOrStart = (evt, cell, setCellRerender) => {
  if (evt.altKey) {
    if (cell.cellType === CELL_TYPES.END) {
      gridCl.endCell = null;
      changeCellType(cell, CELL_TYPES.EMPTY, setCellRerender);
    } else {
      if (gridCl.endCell != null) {
        //user needs to get rid of end cell to place it somewhere else
        return;
      }
      changeCellType(cell, CELL_TYPES.END, setCellRerender);
      gridCl.endCell = cell;
    }
  } else if (evt.ctrlKey) {
    // if the cell is the start cell then make it empty
    if (cell.cellType === CELL_TYPES.START) {
      gridCl.startCell = null;
      changeCellType(cell, CELL_TYPES.EMPTY, setCellRerender);
    } else {
      if (gridCl.startCell != null) {
        //user needs to get rid of end cell to place it somewhere else
        return;
      }
      // make the cell the start
      changeCellType(cell, CELL_TYPES.START, setCellRerender);
      gridCl.startCell = cell;
    }
  }
};

export const determineCellType = (
  evt,
  mouseDown,
  cellTypeOnMouseDown,
  cell,
  setCellRerender
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
      changeCellType(cell, cellType, setCellRerender);
    }
  }
};

const changeCellType = (cell, cellType, setCellRerender) => {
  cell.cellType = cellType;
  setCellRerender((rerender) => !rerender);
};
