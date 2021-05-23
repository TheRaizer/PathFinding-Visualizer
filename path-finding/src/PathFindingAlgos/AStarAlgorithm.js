import { gridCl } from "../Grid/Grid";
import { CELL_TYPES, compareFCost } from "../Cell/CellActions";
import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";

/*A* Search Algorithm

Uses a min heap to compare fCosts/hCosts to find the next cell
to check.

A cell is considered closed/visited once its neighbours have been checked.

Always finds a shortest path.

@param {boolean} canCrossDiagonals - whether the path should be able to cross diagonals
@returns {Array} path - The path or null if no path is found

*/
export default async function AStarSearch(canCrossDiagonals) {
  await gridCl.resetForSearch();
  var Heap = require("heap");

  // instantiate a heap that will pop the most optimal cell according to FCost
  const openHeap = new Heap(compareFCost);

  const closedSet = new Set();

  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  startCell.parentCell = startCell;
  startCell.opened = true;
  openHeap.push(startCell);

  var foundPath = false;

  while (!openHeap.empty()) {
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      return;
    }

    // pop the next optimal cell for the path
    const currentCell = openHeap.pop();

    if (currentCell === endCell) {
      foundPath = true;
      break;
    }
    var neighbours = [];

    if (canCrossDiagonals) {
      neighbours = gridCl.getMooreNeighbours(currentCell.x, currentCell.y);
    } else {
      neighbours = gridCl.getVonNeumannNeighbours(currentCell.x, currentCell.y);
    }

    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      if (
        neighbour.cellType === CELL_TYPES.OBSTACLE ||
        closedSet.has(neighbour)
      ) {
        continue;
      }

      const distCurrentToNeighbour = gridCl.calculateDistance(
        currentCell,
        neighbour,
        canCrossDiagonals
      );

      // calculate the distance from the start to the neighbour through the current cell
      const newDistStartToNeighbour =
        currentCell.gCost + distCurrentToNeighbour;

      // if the gCost is better through the current cell then it was for a previous cell
      // then there is a better path to get to this neighbour.
      // if the neighbour was never opened then we need to assign its costs
      if (newDistStartToNeighbour < neighbour.gCost || !neighbour.opened) {
        neighbour.gCost = newDistStartToNeighbour;

        // assign parent cell to this current cell as it has its lowest known cost through this current cell
        neighbour.parentCell = currentCell;

        if (!neighbour.opened) {
          // calculate hCost which doesn't change once opened unlike gCost
          neighbour.hCost = gridCl.calculateDistance(
            neighbour,
            endCell,
            canCrossDiagonals
          );

          // add to the opened heap as this neighbour may be the next optimal cell
          openHeap.push(neighbour);
          neighbour.opened = true;

          neighbour.setCellRerender((rerender) => !rerender);
        } else {
          // since it's in the heap and gCost changed, update position in heap
          openHeap.updateItem(neighbour);
        }
      }
    }

    // this current cell is closed because its neighbours have been checked
    currentCell.closed = true;
    currentCell.setCellRerender((rerender) => !rerender);

    closedSet.add(currentCell);
    if (searchVars.searchAnimationTime > 0) {
      await timer(searchVars.searchAnimationTime);
    }
  }
  if (foundPath) {
    const path = retracePath(startCell, endCell);
    return path;
  } else {
    return null;
  }
}
