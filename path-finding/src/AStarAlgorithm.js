import Heap from "./Heap";
import { gridCl } from "./Grid";
import { CELL_TYPES } from "./CellActions";
import { searchVars, retracePath } from "./Search";
import { mazeVars } from "./Maze";
import { SEARCH_TYPES } from "./Search";
import { timer } from "./UtilityFuncs";

export default async function AStarPathFind(canCrossDiagonals) {
  // lock the async function so it can only run one at a time
  if (searchVars.isSearching || mazeVars.isCreatingMaze) {
    console.log("already searching");
    return;
  }
  searchVars.isSearching = true;
  //search for the path
  await searching(canCrossDiagonals).then(async (path) => {
    if (path == null) {
      console.log("no path");
      searchVars.isSearching = false;
      return;
    }
    //draw the path
    for (let i = 0; i < path.length; i++) {
      const cell = path[i];
      cell.isOnPath = true;
      cell.setCellRerender((rerender) => !rerender);
      await timer(searchVars.pathAnimationTime);
    }
  });
  searchVars.isSearching = false;
}

function searching(canCrossDiagonals) {
  return new Promise((resolve, reject) => {
    resolve(
      search(canCrossDiagonals).catch((err) => {
        console.log(err);
        reject(err);
      })
    );
  });
}

async function search(canCrossDiagonals) {
  await gridCl.resetForSearch();
  // create a heap that will contain any cells that we have opened
  const openHeap = new Heap(SEARCH_TYPES.A_STAR);

  //closed set containing the cells thats neighbours have been checked
  const closedSet = new Set();

  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  startCell.parentCell = startCell;
  startCell.opened = true;
  openHeap.add(startCell);

  var foundPath = false;

  while (openHeap.lastHeapItemIndex >= 0) {
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      console.log("stopped search");
      return;
    }
    const currentCell = openHeap.removeFirst();

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
        currentCell.gCost + gridCl.calculateDistance(currentCell, neighbour);

      if (
        newCostToNeighbour < neighbour.gCost ||
        !openHeap.contains(neighbour)
      ) {
        neighbour.gCost = newCostToNeighbour;
        neighbour.hCost = gridCl.calculateDistance(neighbour, endCell);
        neighbour.parentCell = currentCell;

        if (!openHeap.contains(neighbour)) {
          openHeap.add(neighbour);
          neighbour.opened = true;

          //rerender with the color of an opened cell
          neighbour.setCellRerender((rerender) => !rerender);
        } else {
          openHeap.update(neighbour, true);
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
