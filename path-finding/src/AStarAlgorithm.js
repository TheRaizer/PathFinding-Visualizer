import Heap from "./Heap";
import { gridCl } from "./Grid";
import { CELL_TYPES } from "./CellActions";

var isSearching = false;
const pathAnimationTime = 10;

export default async function AStarPathFind(canCrossDiagonals, animTime) {
  // lock the async function so it can only run one at a time
  if (isSearching) {
    console.log("already searching");
    return;
  }
  isSearching = true;
  //search for the path
  const path = await searching(canCrossDiagonals, animTime);
  if (path == null) {
    console.log("no path");
    return;
  }
  //draw the path
  for (let i = 0; i < path.length; i++) {
    const cell = path[i];
    cell.isOnPath = true;
    cell.setCellRerender((rerender) => !rerender);
    await timer(pathAnimationTime);
  }

  isSearching = false;
}

function searching(canCrossDiagonals, animTime) {
  return new Promise((resolve) => {
    resolve(search(canCrossDiagonals, animTime));
  });
}

const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function reset() {
  return new Promise((resolve) => {
    resolve(resetCells());
  });
}

async function resetCells() {
  gridCl.grid.forEach((row) => {
    row.forEach((cell) => {
      var rerender = false;
      if (cell.opened) {
        cell.opened = false;
        rerender = true;
      }
      if (cell.isOnPath) {
        cell.isOnPath = false;
        rerender = true;
      }
      if (cell.closed) {
        cell.closed = false;
        rerender = true;
      }
      if (rerender) {
        cell.setCellRerender((rerender) => !rerender);
      }
    });
  });
}

async function search(canCrossDiagonals, animTime) {
  await reset();
  // create a heap that will contain any cells that we have opened (assigned a gcost)
  const openHeap = new Heap();

  //closed set containing the cells that are part of the path
  const closedSet = new Set();

  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  startCell.parentCell = startCell;
  openHeap.add(startCell);

  var foundPath = false;
  while (openHeap.lastHeapCellIndex >= 0) {
    const currentCell = openHeap.removeFirst();

    //rerender with the color of a closed cell
    currentCell.closed = true;
    currentCell.setCellRerender((rerender) => !rerender);

    closedSet.add(currentCell);

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
        currentCell.gCost + calculateDistance(currentCell, neighbour);

      if (
        newCostToNeighbour < neighbour.gCost ||
        !openHeap.contains(neighbour)
      ) {
        neighbour.gCost = newCostToNeighbour;
        neighbour.hCost = calculateDistance(neighbour, endCell);
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

    await timer(animTime);
  }

  if (foundPath) {
    const path = retracePath(startCell, endCell);
    return path;
  } else {
    console.log("no path found");
    return null;
  }
}

function retracePath(start, end) {
  const path = [];
  var currentCell = end;

  while (currentCell !== start) {
    path.push(currentCell);
    currentCell = currentCell.parentCell;
  }
  path.reverse();

  return path;
}

function calculateDistance(cellA, cellB) {
  var dstX = Math.abs(cellA.x - cellB.x);
  var dstY = Math.abs(cellA.y - cellB.y);

  if (dstX > dstY) {
    return 14 * dstY + 10 * (dstX - dstY);
  }

  return 14 * dstX + 10 * (dstY - dstX);
}
