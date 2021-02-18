import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { CELL_TYPES, compareDijkstrasCells } from "../Cell/CellActions";

export default async function dijkstrasSearch(canCrossDiagonals) {
  /*if a cell is closed it means it has been visited, if it is not closed but is instead open
    then the cells dijkstrasShortest has been assigned, but its neighbours have not been checked. 
    To be visited it means that cells neighbours must have been checked.*/

  // reset the entire grid to prepare for the search
  await gridCl.resetForSearch();
  // init start and end cells
  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  var Heap = require("heap");

  //create a heap of unvisited cells
  const unvisitedHeap = new Heap(compareDijkstrasCells);
  // initialize the heap with all the cells as they all start unvisited
  await initHeap(unvisitedHeap);

  // the parent cell of the start cell is itself for retracing purposes
  startCell.parentCell = startCell;
  startCell.opened = true;
  // the start cell has a cost of 0
  startCell.gCost = 0;
  unvisitedHeap.updateItem(startCell);

  var currentCell = unvisitedHeap.pop();
  var neighbours = [];
  var foundPath = false;

  // continue looping until there is not unvisited cells
  while (!unvisitedHeap.empty()) {
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      return;
    }
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
    unVisitedNeighbours.forEach((neighbour) => {
      // only check if neighbour is not an obstacle
      if (neighbour.cellType !== CELL_TYPES.OBSTACLE) {
        // calculate the new distance to the neighbour using the distance from the curr to the start plus the distance from the curr to the neighbour
        const newDistanceFromStartToNeighbour =
          tempCurrentCell.gCost +
          gridCl.calculateDistance(
            tempCurrentCell,
            neighbour,
            canCrossDiagonals
          );

        // if the newDistanceFromStartToNeighbour is smaller then the current shortest
        if (neighbour.gCost > newDistanceFromStartToNeighbour) {
          // assign the new shortest distance
          neighbour.gCost = newDistanceFromStartToNeighbour;

          // assign the parent cell of the neighbour to be the curr
          neighbour.parentCell = tempCurrentCell;

          // the neighbour has been opened so rerender
          neighbour.opened = true;
          neighbour.setCellRerender((rerender) => !rerender);

          // update its position in the heap
          unvisitedHeap.updateItem(neighbour);
        }
      }
    });

    // set the current cell to be closed as its neighbours have been checked and rerender
    currentCell.closed = true;
    currentCell.setCellRerender((rerender) => !rerender);

    // animation interval
    if (searchVars.searchAnimationTime > 0) {
      await timer(searchVars.searchAnimationTime);
    }

    // pick the cell with the lowest distance from the start
    currentCell = unvisitedHeap.pop();

    // if after picking new distances for neighbours the lowest distance cell is still max value it means there is no path.
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
