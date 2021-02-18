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

      var newCostToNeighbour =
        currentCell.gCost +
        gridCl.calculateDistance(currentCell, neighbour, canCrossDiagonals);

      if (newCostToNeighbour < neighbour.gCost || !neighbour.opened) {
        neighbour.gCost = newCostToNeighbour;
        neighbour.hCost = gridCl.calculateDistance(
          neighbour,
          endCell,
          canCrossDiagonals
        );
        neighbour.parentCell = currentCell;

        if (!neighbour.opened) {
          openHeap.push(neighbour);
          neighbour.opened = true;

          //rerender with the color of an opened cell
          neighbour.setCellRerender((rerender) => !rerender);
        } else {
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
  if (foundPath) {
    const path = retracePath(startCell, endCell);
    return path;
  } else {
    console.log("no path found");
    return null;
  }
}
