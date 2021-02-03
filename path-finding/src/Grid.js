import React from "react";
import Cell, { CellSquare } from "./Cell";
import "./grid.css";

class GridCl {
  grid = [];
  startCell = null;
  endCell = null;
  maxY = 20;
  maxX = 48;

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

  cellIsInGrid = (x, y) => {
    if (x < 0 || y < 0 || x >= this.maxX || y >= this.maxY) {
      return false;
    } else {
      return true;
    }
  };
}

export const gridCl = new GridCl();

function Grid() {
  return (
    <section id="grid">
      {gridCl.grid.map((row) =>
        row.map((cell) => {
          return <CellSquare cell={cell} key={cell.x + " " + cell.y} />;
        })
      )}
    </section>
  );
}

export default Grid;
