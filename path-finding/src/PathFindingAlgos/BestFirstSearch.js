import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { CELL_TYPES, compareBestFirstCells } from "../Cell/CellActions";

export default async function bestFirstSearch(canCrossDiagonals) {
  // reset the entire grid to prepare for the search
  await gridCl.resetForSearch();
  // init start and end cells
  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;
  var Heap = require("heap");
  //create a heap of unvisited cells
  const unvisitedHeap = new Heap(compareBestFirstCells);
  // initialize the heap with all the cells as they all start unvisited
  await initHeap(unvisitedHeap);

  // the parent cell of the start cell is itself for retracing purposes
  startCell.parentCell = startCell;
  startCell.opened = true;

  // the start cell has a cost of 0
  startCell.gCost = 0;
  // calculate hCost
  startCell.hCost = gridCl.calculateDistance(
    startCell,
    endCell,
    canCrossDiagonals
  );
  // update the start cells pos in the heap
  unvisitedHeap.updateItem(startCell);

  var neighbours = [];
  var foundPath = false;
  // continue looping until there is not unvisited cells
  while (!unvisitedHeap.empty()) {
    var currentCell = unvisitedHeap.pop();
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      return;
    }
    // if current cell is end cell we've finished
    if (currentCell === endCell) {
      foundPath = true;
      break;
    }
    // if lowest distance cell (current cell) is still max value it means there is no path.
    if (currentCell.hCost === Number.MAX_SAFE_INTEGER) {
      break;
    }
    // check certain neigbours depending on if it can cross diagonals or not
    if (canCrossDiagonals) {
      neighbours = gridCl.getMooreNeighbours(currentCell.x, currentCell.y);
    } else {
      neighbours = gridCl.getVonNeumannNeighbours(currentCell.x, currentCell.y);
    }

    console.log(neighbours);
    // filter out any visited neighbours
    const unVisitedNeighbours = neighbours.filter(
      (x) => !x.closed && !x.opened
    );

    let tempCurrentCell = currentCell;

    // loop through all unvisited neighbours
    unVisitedNeighbours.forEach((neighbour) => {
      // only check if neighbour is not an obstacle
      if (neighbour.cellType !== CELL_TYPES.OBSTACLE) {
        // assign the neighbours hCost
        neighbour.hCost = gridCl.calculateDistance(
          neighbour,
          endCell,
          canCrossDiagonals
        );

        // assign the parent cell of the neighbour to be the current cell
        neighbour.parentCell = tempCurrentCell;

        // the neighbour has been opened so rerender
        neighbour.opened = true;
        neighbour.setCellRerender((rerender) => !rerender);

        // update neighbour's position in the heap
        unvisitedHeap.updateItem(neighbour);
      }
    });

    // set the current cell to be closed as its neighbours have been checked and rerender
    currentCell.closed = true;
    currentCell.setCellRerender((rerender) => !rerender);

    // animation interval
    if (searchVars.searchAnimationTime > 0) {
      await timer(searchVars.searchAnimationTime);
    }
  }

  // if we found a path retrace it
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
          // initialize all the gCosts to be as large as possible as none have been visited yet
          cell.hCost = Number.MAX_SAFE_INTEGER;
          heap.push(cell);
        })
      )
    )
  );
}
