import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { CELL_TYPES, compareGCost } from "../Cell/CellActions";

/* Dijkstras Search Algorithm

Uses a min heap that compares gCosts to find the next cell to 
check.

A cell is considered closed/visited once its neighbours have been checked.

Always finds a shortest path.

@param {boolean} canCrossDiagonals - whether the path should be able to cross diagonals
@returns {Array} path - The path or null if no path is found

*/
export default async function dijkstrasSearch(canCrossDiagonals) {
  let success = await gridCl.resetForSearch().catch((err) => {
    // if the promise was rejected log the error
    console.error(err);
  });

  // if the reset for search promise did not resolve true leave
  if (!success) {
    return;
  }

  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  var Heap = require("heap");

  const unvisitedHeap = new Heap(compareGCost);

  // reset gCosts of every node before adding it to the heap
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

    // we cannot include cells that are already on the path
    const unVisitedNeighbours = neighbours.filter((x) => !x.closed);

    let tempCurrentCell = currentCell;

    unVisitedNeighbours.forEach((neighbour) => {
      const distNeighbourToCurrent = gridCl.calculateDistance(
        tempCurrentCell,
        neighbour,
        canCrossDiagonals
      );
      if (neighbour.cellType !== CELL_TYPES.OBSTACLE) {
        // calculate the distance from the start to the neighbour through the current cell
        const newDistStartToNeighbour =
          tempCurrentCell.gCost + distNeighbourToCurrent;

        // if the gCost is better through the current cell then it was for a previous cell
        if (newDistStartToNeighbour < neighbour.gCost) {
          neighbour.gCost = newDistStartToNeighbour;

          // set parent cell to the current cell for path retracing
          neighbour.parentCell = tempCurrentCell;

          neighbour.opened = true;
          neighbour.setCellRerender((rerender) => !rerender);

          // since gCost has updated we must update its position in the heap
          unvisitedHeap.updateItem(neighbour);
        }
      }
    });

    // close this current cell as we have checked its neighbours
    currentCell.closed = true;
    currentCell.setCellRerender((rerender) => !rerender);

    if (searchVars.searchAnimationTime > 0) {
      await timer(searchVars.searchAnimationTime);
    }

    // pop the next cell with the lowest gCost to be the current
    currentCell = unvisitedHeap.pop();

    // if the next cell optimal cell has not changed in gCost it means there is no path
    if (currentCell.gCost === Number.MAX_SAFE_INTEGER) {
      // needs this break because all cells are given to dijkstras heap on initialization
      break;
    }
  }
  if (foundPath) {
    const path = retracePath(startCell, endCell);
    return path;
  }
}

/* Resets the cells to have the maximum gCost before adding them to the heap.

This is done so every cell can update its gCost during dijkstras.

@param {Heap} heap - the heap to add cells to after gCost reset
@returns {Promise} - resolves the action of reseting gCosts and adding to heap

*/
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
