import React from "react";
import Cell, { CellSquareState } from "../Cell/Cell";
import { CELL_TYPES, cellIsStartOrEnd } from "../Cell/CellActions";
import { timer } from "../UtilityFuncs";
import "./grid.css";

class GridCl {
  grid = [];
  startCell = null;
  endCell = null;
  // dims must be odd to work with recursive division
  maxY = 27; // 27
  maxX = 61; // 61

  constructor() {
    this.initGrid();
  }
  initGrid = () => {
    // generate and push the rows of Cell classes into the 2d array 'grid'
    for (let y = 0; y < this.maxY; y++) {
      var row = [];
      for (let x = 0; x < this.maxX; x++) {
        row.push(new Cell(x, y));
      }
      this.grid.push(row);
    }

    // set the start cell to be in the middle y index and the x index to be a quarter from the left of the grid
    let startCell = this.grid[Math.floor(this.maxY / 2)][
      Math.floor(this.maxX / 4)
    ];
    // set the end cell to be in the middle y index and the x index a quarter from the right of the grid
    let endCell = this.grid[Math.floor(this.maxY / 2)][
      Math.floor(this.maxX - this.maxX / 4)
    ];

    // assign their cellTypes
    startCell.cellType = CELL_TYPES.START;
    endCell.cellType = CELL_TYPES.END;

    // assign the cells
    this.startCell = startCell;
    this.endCell = endCell;
  };

  getMooreNeighbours = (posX, posY) => {
    // get the 8 surrounding neighbours of a cell at indices posX and posY
    const neighbours = [];
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        if (x === 0 && y === 0) {
          continue;
        }
        if (!this.cellIsInGrid(posX + x, posY + y)) {
          continue;
        }

        neighbours.push(this.grid[posY + y][posX + x]);
      }
    }

    return neighbours;
  };

  getVonNeumannNeighbours = (posX, posY) => {
    // get top, left, right, and down neighbours of a cell at indices posX and posY
    const neighbours = [];

    if (this.cellIsInGrid(posX - 1, posY)) {
      neighbours.push(this.grid[posY][posX - 1]);
    }
    if (this.cellIsInGrid(posX + 1, posY)) {
      neighbours.push(this.grid[posY][posX + 1]);
    }
    if (this.cellIsInGrid(posX, posY - 1)) {
      neighbours.push(this.grid[posY - 1][posX]);
    }
    if (this.cellIsInGrid(posX, posY + 1)) {
      neighbours.push(this.grid[posY + 1][posX]);
    }

    return neighbours;
  };

  cellIsInGrid = (x, y) => {
    // returns if given cell index at x and y is contained within the 2d array
    if (x < 0 || y < 0 || x >= this.maxX || y >= this.maxY) {
      return false;
    } else {
      return true;
    }
  };

  clearEntireGrid = () => {
    // revert every single cell to be empty and not opened closed or on path
    this.grid.forEach((row) => {
      row.forEach((cell) => {
        var rerender = false;
        if (cell.opened) {
          cell.opened = false;
          rerender = true;
        }
        if (cell.isOnPath) {
          cell.isOnPath = false;
          rerender = true;
        }
        if (cell.closed) {
          cell.closed = false;
          rerender = true;
        }
        if (
          cell.cellType !== CELL_TYPES.EMPTY &&
          cell.cellType !== CELL_TYPES.START &&
          cell.cellType !== CELL_TYPES.END
        ) {
          cell.cellType = CELL_TYPES.EMPTY;
          rerender = true;
        }
        if (rerender) {
          cell.setCellRerender((rerender) => !rerender);
        }
      });
    });
  };

  resetForSearch() {
    return new Promise((resolve, reject) => {
      resolve(
        this.resetCellsForSearch().catch((err) => {
          console.log(err);
          reject(err);
        })
      );
    });
  }

  async resetCellsForSearch() {
    gridCl.grid.forEach((row) => {
      row.forEach((cell) => {
        var rerender = false;
        if (cell.opened) {
          cell.opened = false;
          rerender = true;
        }
        if (cell.isOnPath) {
          cell.isOnPath = false;
          rerender = true;
        }
        if (cell.closed) {
          cell.closed = false;
          rerender = true;
        }
        if (rerender) {
          cell.setCellRerender((rerender) => !rerender);
        }
      });
    });
  }

  clearWalls = () => {
    this.grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.cellType === CELL_TYPES.OBSTACLE) {
          cell.cellType = CELL_TYPES.EMPTY;
          cell.setCellRerender((rerender) => !rerender);
        }
      });
    });
  };

  calculateDistance(cellA, cellB, canCrossDiagonals) {
    if (canCrossDiagonals) {
      // distance for diagonal algorithms is calculated using octile distance
      var dstX = Math.abs(cellA.x - cellB.x);
      var dstY = Math.abs(cellA.y - cellB.y);

      if (dstX > dstY) {
        return 14 * dstY + 10 * (dstX - dstY);
      }

      return 14 * dstX + 10 * (dstY - dstX);
    } else {
      // distance for non-diagonal algorithms is calculated using manhattan distance
      return Math.abs(cellA.x - cellB.x) + Math.abs(cellA.y - cellB.y);
    }
  }

  outlineGrid(animTime) {
    return new Promise((resolve, reject) =>
      resolve(
        this.outLine(animTime).catch((err) => {
          console.log(err);
          reject(err);
        })
      )
    );
  }
  async outLine(animTime) {
    for (let y = 0; y < this.maxY; y++) {
      if (!cellIsStartOrEnd(0, y)) {
        // outlines left wall
        this.grid[y][0].cellType = CELL_TYPES.OBSTACLE;
        this.grid[y][0].setCellRerender((rerender) => !rerender);
      }
      if (!cellIsStartOrEnd(this.maxX - 1, y)) {
        // outlines right wall
        this.grid[y][this.maxX - 1].cellType = CELL_TYPES.OBSTACLE;
        this.grid[y][this.maxX - 1].setCellRerender((rerender) => !rerender);
      }
      await timer(animTime);
    }
    for (let x = 0; x < this.maxX; x++) {
      if (!cellIsStartOrEnd(x, 0)) {
        // outlines top wall
        this.grid[0][x].cellType = CELL_TYPES.OBSTACLE;
        this.grid[0][x].setCellRerender((rerender) => !rerender);
      }
      if (!cellIsStartOrEnd(x, this.maxY - 1)) {
        // outlines bottom wall
        this.grid[this.maxY - 1][x].cellType = CELL_TYPES.OBSTACLE;
        this.grid[this.maxY - 1][x].setCellRerender((rerender) => !rerender);
      }
      await timer(animTime);
    }
  }
}

export const gridCl = new GridCl();

function Grid() {
  return (
    <section id="grid">
      {gridCl.grid.map((row) =>
        row.map((cell) => {
          return <CellSquareState cell={cell} key={cell.x + " " + cell.y} />;
        })
      )}
    </section>
  );
}

export default Grid;
