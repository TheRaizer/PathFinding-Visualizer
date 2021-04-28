import React from "react";
import Cell, { CellSquareState } from "../Cell/Cell";
import { CELL_TYPES, cellIsStartOrEnd } from "../Cell/CellActions";
import { timer } from "../UtilityFuncs";
import "./grid.css";
/*The Grid
The GridCl class contains all the cells that will be used to path find as well as the start and end cell.
The dimensions should be odd to work with recursive division.

It contains functions that manage the state of the grid.
 */

class GridCl {
  grid = [];
  startCell = null;
  endCell = null;

  // dimensions must be odd to work with recursive division
  maxY = 27;
  maxX = 61;

  constructor() {
    this.initGrid();
  }
  initGrid = () => {
    for (let y = 0; y < this.maxY; y++) {
      var row = [];
      for (let x = 0; x < this.maxX; x++) {
        row.push(new Cell(x, y));
      }
      this.grid.push(row);
    }

    // place the start node a quarter away from the left bound
    let startCell = this.grid[Math.floor(this.maxY / 2)][
      Math.floor(this.maxX / 4)
    ];

    // place the end node a quarter away from the right bound
    let endCell = this.grid[Math.floor(this.maxY / 2)][
      Math.floor(this.maxX - this.maxX / 4)
    ];

    startCell.cellType = CELL_TYPES.START;
    endCell.cellType = CELL_TYPES.END;

    this.startCell = startCell;
    this.endCell = endCell;
  };

  /* get the 8 or less surrounding neighbours of a cell at indices posX and posY

    does not retrieve the neighbour if it is not in the grid

    @param {number} posX - the x-index of a given cell whose neighbours we are checking
    @param {number} posY - the y-index of a given cell whose neighbours we are checking

    @return {Array} neighbours - contains up to 8 surrounding neighbours
   */
  getMooreNeighbours = (posX, posY) => {
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

  /* get top, left, right, and down neighbours of a cell at indices posX and posY

    Does not retrieve the neighbour if it is not in the grid

    @param {number} posX - the x-index of a given cell whose neighbours we are checking
    @param {number} posY - the y-index of a given cell whose neighbours we are checking

    @return {Array} neighbours - contains up to 4 surrounding neighbours
   */
  getVonNeumannNeighbours = (posX, posY) => {
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

  /* Checks if a cell is in the grid

  @param {number} x - the x-index of a cell
  @param {number} y - the y-index of a cell

  @returns {boolean} if given cell index at x and y is contained within the 2d array */
  cellIsInGrid = (x, y) => {
    if (x < 0 || y < 0 || x >= this.maxX || y >= this.maxY) {
      return false;
    } else {
      return true;
    }
  };

  // revert every single cell back to empty other then the start and end cells
  clearEntireGrid = () => {
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

  // reset any opened, closed, or onPath cells
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

  /* Calculates the distance between to cells

  distance for diagonal algorithms is calculated using octile distance.
  distance for non-diagonal algorithms is calculated using manhattan distance.

  @param {Object} cellA - the first cell
  @param {Object} cellB - the second cell
  @param {boolean} canCrossDiagonals - whether the cellA can cross diagonals to get to cellB vice-versa

  @return {float} the distance between cellA and cellB
  */
  calculateDistance(cellA, cellB, canCrossDiagonals) {
    if (canCrossDiagonals) {
      var dstX = Math.abs(cellA.x - cellB.x);
      var dstY = Math.abs(cellA.y - cellB.y);

      if (dstX > dstY) {
        return 14 * dstY + 10 * (dstX - dstY);
      }

      return 14 * dstX + 10 * (dstY - dstX);
    } else {
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

  /*Outlines the grid with a cell of type Obstacle

  @param {float} animTime - the animation time to wait before drawing the next cell
  */
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
