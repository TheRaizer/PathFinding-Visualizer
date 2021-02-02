import React from "react";
import Cell, { CellSquare } from "./Cell";
import "./grid.css";

class GridCl {
  grid = [];
  startCell = null;
  endCell = null;
  maxY = 20;
  maxX = 47;

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
