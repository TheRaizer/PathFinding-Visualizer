import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { CELL_TYPES } from "../Cell/CellActions";
import Queue from "../DataStructures/Queue";

export default async function breadthFirstSearch(canCrossDiagonals) {
  // reset the entire grid to prepare for the search
  await gridCl.resetForSearch();

  // init start and end cells
  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  //create a heap of unvisited cells
  const unvisitedQueue = new Queue();
  // initialize the heap with all the cells as they all start unvisited
  await initGCosts();

  // the parent cell of the start cell is itself for retracing purposes
  startCell.parentCell = startCell;

  var currentCell = null;

  var neighbours = [];
  // add to the queue the start cell
  startCell.opened = true;
  startCell.gCost = 0;
  unvisitedQueue.enQueue(startCell);
  var foundPath = false;

  // continue looping until there is not unvisited cells
  while (unvisitedQueue.size() > 0) {
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      return;
    }
    // dequeue to cell to get the current cell
    currentCell = unvisitedQueue.deQueue();

    // if the current cell is the end then we have the shortest path
    if (currentCell === endCell) {
      foundPath = true;
      break;
    }

    // check certain neigbours depending on if it can cross diagonals or not
    if (canCrossDiagonals) {
      neighbours = gridCl.getMooreNeighbours(currentCell.x, currentCell.y);
    } else {
      neighbours = gridCl.getVonNeumannNeighbours(currentCell.x, currentCell.y);
    }

    // filter out any visited neighbours
    const unVisitedNeighbours = neighbours.filter((x) => !x.closed);

    let tempCurrentCell = currentCell;

    // loop through all unvisited neighbours
    for (let i = 0; i < unVisitedNeighbours.length; i++) {
      var neighbour = unVisitedNeighbours[i];
      // only check if neighbour is not an obstacle
      if (neighbour.cellType !== CELL_TYPES.OBSTACLE) {
        // if the neighbour is not closed or opened
        if (!neighbour.closed && !neighbour.opened) {
          // add neighbour to queue
          unvisitedQueue.enQueue(neighbour);
        }
        // calculate the new distance to the neighbour using the distance from the curr to the start plus the distance from the curr to the neighbour
        const newDistanceFromStartToNeighbour =
          tempCurrentCell.gCost +
          gridCl.calculateDistance(
            tempCurrentCell,
            neighbour,
            canCrossDiagonals
          );

        // if the newDistanceFromStartToNeighbour is smaller then the current shortest
        if (newDistanceFromStartToNeighbour < neighbour.gCost) {
          // assign the new shortest distance
          neighbour.gCost = newDistanceFromStartToNeighbour;

          // assign the parent cell of the neighbour to be the curr
          neighbour.parentCell = tempCurrentCell;

          // the neighbour has been opened so rerender
          neighbour.opened = true;
          neighbour.setCellRerender((rerender) => !rerender);
        }
      }
    }
    // set the current cell to be closed as its neighbours have been checked and rerender
    currentCell.closed = true;
    currentCell.setCellRerender((rerender) => !rerender);

    // animation interval
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
