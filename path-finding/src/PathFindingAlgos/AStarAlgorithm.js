// import Heap from "../DataStructures/Heap";
import { gridCl } from "../Grid/Grid";
import { CELL_TYPES, compareAStarCells } from "../Cell/CellActions";
import { searchVars, retracePath } from "../Search";
import { timer } from "../UtilityFuncs";

export default async function AStarSearch(canCrossDiagonals) {
  await gridCl.resetForSearch();
  // create a heap that will contain any cells that we have opened
  var Heap = require("heap");
  const openHeap = new Heap(compareAStarCells);

  //closed set containing the cells thats neighbours have been checked
  const closedSet = new Set();

  // assign start and end cells
  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  // the parent of the start cell is itself for retracing
  startCell.parentCell = startCell;
  startCell.opened = true;
  // insert the start cell into the heap
  openHeap.push(startCell);
  var foundPath = false;

  while (!openHeap.empty()) {
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      return;
    }
    // get the optimal cell from heap
    const currentCell = openHeap.pop();

    // if the current cell is end cell we've finished
    if (currentCell === endCell) {
      foundPath = true;
      break;
    }
    // init empty list of neighbours
    var neighbours = [];
    if (canCrossDiagonals) {
      neighbours = gridCl.getMooreNeighbours(currentCell.x, currentCell.y);
    } else {
      neighbours = gridCl.getVonNeumannNeighbours(currentCell.x, currentCell.y);
    }
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      // if the neighbour is an obstacle or the closed set has the neighbour skip this neighbour check
      if (
        neighbour.cellType === CELL_TYPES.OBSTACLE ||
        closedSet.has(neighbour)
      ) {
        continue;
      }

      // calculate a new gCost for the neighbour using the currentCells gCost
      var newCostToNeighbour =
        currentCell.gCost +
        gridCl.calculateDistance(currentCell, neighbour, canCrossDiagonals);

      // if the new gCost is less than the previous one or the neighbour is not opened then we must assign new costs
      if (newCostToNeighbour < neighbour.gCost || !neighbour.opened) {
        // assign the costs
        neighbour.gCost = newCostToNeighbour;
        neighbour.hCost = gridCl.calculateDistance(
          neighbour,
          endCell,
          canCrossDiagonals
        );
        // for retracing, the parent cell of the neighbour is the cell that gave it the optimal costs
        neighbour.parentCell = currentCell;

        // if the neighbour is not opened
        if (!neighbour.opened) {
          // add it to the heap
          openHeap.push(neighbour);
          // set it as opened
          neighbour.opened = true;

          //rerender with the color of an opened cell
          neighbour.setCellRerender((rerender) => !rerender);
        } else {
          // if the neighbour was already opened then that means a lesser gCost was given so we must update its pos in the heap
          openHeap.updateItem(neighbour);
        }
      }
    }

    //rerender with the color of a closed cell
    currentCell.closed = true;
    currentCell.setCellRerender((rerender) => !rerender);

    closedSet.add(currentCell);
    // animation interval
    if (searchVars.searchAnimationTime > 0) {
      await timer(searchVars.searchAnimationTime);
    }
  }
  // if we've found a path then retrace it
  if (foundPath) {
    const path = retracePath(startCell, endCell);
    return path;
  } else {
    return null;
  }
}
