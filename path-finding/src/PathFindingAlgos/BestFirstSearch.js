import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { CELL_TYPES, compareHCost } from "../Cell/CellActions";

/* Best First Search Algorithm

Uses a min heap that compares hCosts to find the next cell to 
check too.

Does not always find the shortest path.

@param {boolean} canCrossDiagonals - whether the path should be able to cross diagonals
@returns {Array} path - The path or null if no path is found

*/

export default async function bestFirstSearch(canCrossDiagonals) {
  await gridCl.resetForSearch();

  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  var Heap = require("heap");
  const unvisitedHeap = new Heap(compareHCost);

  await initHeap(unvisitedHeap);

  startCell.parentCell = startCell;
  startCell.opened = true;

  startCell.gCost = 0;
  startCell.hCost = gridCl.calculateDistance(
    startCell,
    endCell,
    canCrossDiagonals
  );
  unvisitedHeap.updateItem(startCell);

  var neighbours = [];
  var foundPath = false;
  while (!unvisitedHeap.empty()) {
    var currentCell = unvisitedHeap.pop();
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      return;
    }
    if (currentCell === endCell) {
      foundPath = true;
      break;
    }
    if (currentCell.hCost === Number.MAX_SAFE_INTEGER) {
      break;
    }

    if (canCrossDiagonals) {
      neighbours = gridCl.getMooreNeighbours(currentCell.x, currentCell.y);
    } else {
      neighbours = gridCl.getVonNeumannNeighbours(currentCell.x, currentCell.y);
    }

    const unVisitedNeighbours = neighbours.filter(
      (x) => !x.closed && !x.opened
    );

    let tempCurrentCell = currentCell;

    unVisitedNeighbours.forEach((neighbour) => {
      if (neighbour.cellType !== CELL_TYPES.OBSTACLE) {
        neighbour.hCost = gridCl.calculateDistance(
          neighbour,
          endCell,
          canCrossDiagonals
        );

        neighbour.parentCell = tempCurrentCell;

        neighbour.opened = true;
        neighbour.setCellRerender((rerender) => !rerender);

        unvisitedHeap.updateItem(neighbour);
      }
    });

    currentCell.closed = true;
    currentCell.setCellRerender((rerender) => !rerender);

    if (searchVars.searchAnimationTime > 0) {
      await timer(searchVars.searchAnimationTime);
    }
  }

  if (foundPath) {
    const path = retracePath(startCell, endCell);
    return path;
  } else {
    console.log("no path found");
  }
}

function initHeap(heap) {
  return new Promise((resolve) =>
    resolve(
      gridCl.grid.forEach((row) =>
        row.forEach((cell) => {
          cell.hCost = Number.MAX_SAFE_INTEGER;
          heap.push(cell);
        })
      )
    )
  );
}
