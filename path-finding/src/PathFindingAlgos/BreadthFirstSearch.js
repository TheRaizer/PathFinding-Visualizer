import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { CELL_TYPES } from "../Cell/CellActions";
import Queue from "../DataStructures/Queue";

/* Breadth First Search Algorithm

Starts at the root of a tree and searches from each neighbouring 
node at present depth before moving into the next level of depth.

Uses a Queue to choose the next cell to check.
Uses gCost to assign parent cells for retracing path.
Uses the boolean var 'opened' to determine whether a cell is in the queue.

A cell is considered closed/visited once its neighbours have been checked.

Always finds a shortest path.

@param {boolean} canCrossDiagonals - whether the path should be able to cross diagonals
@returns {Array} path - The path or null if no path is found

*/

export default async function breadthFirstSearch(canCrossDiagonals) {
  await gridCl.resetForSearch();

  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  const unvisitedQueue = new Queue();
  await initGCosts();

  startCell.parentCell = startCell;

  var currentCell = null;

  var neighbours = [];

  startCell.opened = true;
  startCell.gCost = 0;

  unvisitedQueue.enQueue(startCell);
  var foundPath = false;

  while (unvisitedQueue.size() > 0) {
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      return;
    }
    currentCell = unvisitedQueue.deQueue();

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

    for (let i = 0; i < unVisitedNeighbours.length; i++) {
      var neighbour = unVisitedNeighbours[i];
      if (neighbour.cellType !== CELL_TYPES.OBSTACLE) {
        if (!neighbour.closed && !neighbour.opened) {
          // add to the unvisited Queue if its not already been in the queue
          unvisitedQueue.enQueue(neighbour);
        }
        const distCurrentToNeighbour = gridCl.calculateDistance(
          tempCurrentCell,
          neighbour,
          canCrossDiagonals
        );

        // calculate the new distance from start to neighbour through the current cell
        const newDistStartToNeighbour =
          tempCurrentCell.gCost + distCurrentToNeighbour;

        // if the gCost is better through the current cell then it was for a previous cell
        if (newDistStartToNeighbour < neighbour.gCost) {
          neighbour.gCost = newDistStartToNeighbour;

          // assign parent cell to current cell for path retracing
          neighbour.parentCell = tempCurrentCell;

          neighbour.opened = true;
          neighbour.setCellRerender((rerender) => !rerender);
        }
      }
    }

    // current cell has been visited
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

function initGCosts() {
  return new Promise((resolve) =>
    resolve(
      gridCl.grid.forEach((row) =>
        row.forEach((cell) => {
          // initialize all the gCosts to be as large as possible as none have been visited yet
          cell.gCost = Number.MAX_SAFE_INTEGER;
        })
      )
    )
  );
}
