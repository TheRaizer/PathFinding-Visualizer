import Heap from "./Heap";
import { gridCl } from "./Grid";
import { CELL_TYPES } from "./CellActions";

function search() {
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

    closedSet.add(currentCell);
    if (currentCell === endCell) {
      foundPath = true;
      break;
    }

    const neighbours = gridCl.getMooreNeighbours(currentCell);
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
        } else {
          openHeap.update(neighbour, true);
        }
      }
    }
  }

  if (foundPath) {
    retracePath(startCell, endCell);
  } else {
    console.log("no path found");
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
