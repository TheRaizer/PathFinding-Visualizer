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
  maxY = 27;
  maxX = 63;

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
  };

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

  cellIsInGrid = (x, y) => {
    if (x < 0 || y < 0 || x >= this.maxX || y >= this.maxY) {
      return false;
    } else {
      return true;
    }
  };

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

  calculateDistance(cellA, cellB) {
    var dstX = Math.abs(cellA.x - cellB.x);
    var dstY = Math.abs(cellA.y - cellB.y);

    if (dstX > dstY) {
      return 14 * dstY + 10 * (dstX - dstY);
    }

    return 14 * dstX + 10 * (dstY - dstX);
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
        this.grid[y][0].cellType = CELL_TYPES.OBSTACLE;
        this.grid[y][0].setCellRerender((rerender) => !rerender);
      }
      if (!cellIsStartOrEnd(this.maxX - 1, y)) {
        this.grid[y][this.maxX - 1].cellType = CELL_TYPES.OBSTACLE;
        this.grid[y][this.maxX - 1].setCellRerender((rerender) => !rerender);
      }
      await timer(animTime);
    }
    for (let x = 0; x < this.maxX; x++) {
      if (!cellIsStartOrEnd(x, 0)) {
        this.grid[0][x].cellType = CELL_TYPES.OBSTACLE;
        this.grid[0][x].setCellRerender((rerender) => !rerender);
      }
      if (!cellIsStartOrEnd(x, this.maxY - 1)) {
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
