import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { CELL_TYPES, compareHCost } from "../Cell/CellActions";

/* Best First Search Algorithm

Uses a min heap that compares hCosts to find the next cell to check.

A cell is considered closed/visited once its neighbours have been checked.

Because BFS is a greedy algorithm it only finds the locally optimal solution 
each time when picking the next cell to travel too. This means it does not always find the shortest path.

Due to BFS only checking the heuristic cost it will attempt to move straight to the end node without
taking account a better alternate path due to obstructions. This is shown when unlike the other algorithms
BFS does not recalculate a new distance through the current cell.

@param {boolean} canCrossDiagonals - whether the path should be able to cross diagonals
@returns {Array} path - The path or null if no path is found

*/

export default async function bestFirstSearch(canCrossDiagonals) {
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
    // get the next most optimal cell according to hCost
    var currentCell = unvisitedHeap.pop();
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      return;
    }
    if (currentCell === endCell) {
      foundPath = true;
      break;
    }

    // if the next optimal cell we have chosen has not changed in hCost it means there is no path
    if (currentCell.hCost === Number.MAX_SAFE_INTEGER) {
      // needs this break because all cells are given to BFS heap on initialization
      break;
    }

    if (canCrossDiagonals) {
      neighbours = gridCl.getMooreNeighbours(currentCell.x, currentCell.y);
    } else {
      neighbours = gridCl.getVonNeumannNeighbours(currentCell.x, currentCell.y);
    }

    // Filter out any opened or closed neighbours
    // The reason we filter out any opened is because BFS will not
    // attempt to recalculate a new distance through the current cell
    // so there is no need to include opened cells for recalculation
    const unVisitedNeighbours = neighbours.filter(
      (x) => !x.closed && !x.opened
    );

    let tempCurrentCell = currentCell;

    // for every neighbour assign hCost, parent cell, and update position in heap
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

    // we have now checked the neighbours of the current cell
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

/* Resets the cells to have the maximum hCost before adding them to the heap.

This is done so every cell can update its hCost during BFS.

@param {Heap} heap - the heap to add cells to after hCost reset
@returns {Promise} - resolves the action of reseting hCosts and adding to heap

*/
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
