import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { CELL_TYPES, compareGCost } from "../Cell/CellActions";

/* Dijkstras Search Algorithm

Uses a min heap that compares gCosts to find the next cell to 
check too.

Always finds a shortest path.

@param {boolean} canCrossDiagonals - whether the path should be able to cross diagonals
@returns {Array} path - The path or null if no path is found

*/
export default async function dijkstrasSearch(canCrossDiagonals) {
  await gridCl.resetForSearch();

  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  var Heap = require("heap");

  const unvisitedHeap = new Heap(compareGCost);
  await initHeap(unvisitedHeap);

  startCell.parentCell = startCell;
  startCell.opened = true;

  startCell.gCost = 0;
  unvisitedHeap.updateItem(startCell);

  var currentCell = unvisitedHeap.pop();
  var neighbours = [];
  var foundPath = false;

  while (!unvisitedHeap.empty()) {
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      return;
    }
    if (currentCell === endCell) {
      foundPath = true;
      break;
    }

    if (canCrossDiagonals) {
      neighbours = gridCl.getMooreNeighbours(currentCell.x, currentCell.y);
    } else {
      neighbours = gridCl.getVonNeumannNeighbours(currentCell.x, currentCell.y);
    }

    const unVisitedNeighbours = neighbours.filter((x) => !x.closed);

    let tempCurrentCell = currentCell;

    unVisitedNeighbours.forEach((neighbour) => {
      const distNeighbourToCurrent = gridCl.calculateDistance(
        tempCurrentCell,
        neighbour,
        canCrossDiagonals
      );
      if (neighbour.cellType !== CELL_TYPES.OBSTACLE) {
        const newDistStartToNeighbour =
          tempCurrentCell.gCost + distNeighbourToCurrent;

        if (newDistStartToNeighbour < neighbour.gCost) {
          neighbour.gCost = newDistStartToNeighbour;

          neighbour.parentCell = tempCurrentCell;

          neighbour.opened = true;
          neighbour.setCellRerender((rerender) => !rerender);

          unvisitedHeap.updateItem(neighbour);
        }
      }
    });

    currentCell.closed = true;
    currentCell.setCellRerender((rerender) => !rerender);

    if (searchVars.searchAnimationTime > 0) {
      await timer(searchVars.searchAnimationTime);
    }

    currentCell = unvisitedHeap.pop();

    if (currentCell.gCost === Number.MAX_SAFE_INTEGER) {
      break;
    }
  }
  if (foundPath) {
    const path = retracePath(startCell, endCell);
    return path;
  }
  console.log("no path found");
}

function initHeap(heap) {
  return new Promise((resolve) =>
    resolve(
      gridCl.grid.forEach((row) =>
        row.forEach((cell) => {
          cell.gCost = Number.MAX_SAFE_INTEGER;
          heap.push(cell);
        })
      )
    )
  );
}
