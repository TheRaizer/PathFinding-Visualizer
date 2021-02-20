import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { CELL_TYPES } from "../Cell/CellActions";
import Queue from "../DataStructures/Queue";

/* Breadth First Search Algorithm

Uses a Queue to choose the next cell to check.
Uses the boolean var opened instead of an openedSet.

Always finds a shortest path.

returns:
path: list of cells representing the path or null if no path is found

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
          unvisitedQueue.enQueue(neighbour);
        }
        const distCurrentToNeighbour = gridCl.calculateDistance(
          tempCurrentCell,
          neighbour,
          canCrossDiagonals
        );
        const newDistStartToNeighbour =
          tempCurrentCell.gCost + distCurrentToNeighbour;

        if (newDistStartToNeighbour < neighbour.gCost) {
          neighbour.gCost = newDistStartToNeighbour;

          neighbour.parentCell = tempCurrentCell;

          neighbour.opened = true;
          neighbour.setCellRerender((rerender) => !rerender);
        }
      }
    }
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
