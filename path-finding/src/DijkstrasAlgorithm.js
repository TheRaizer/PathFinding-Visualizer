import { searchVars, retracePath, SEARCH_TYPES } from "./Search";
import { timer } from "./UtilityFuncs";
import { gridCl } from "./Grid";
import { mazeVars } from "./Maze";
import { CELL_TYPES } from "./CellActions";
import Heap from "./Heap";

export default async function DijkstrasPathFind(canCrossDiagonals) {
  // lock the async function so it can only run one at a time
  if (searchVars.isSearching || mazeVars.isCreatingMaze) {
    console.log("already searching");
    return;
  }
  searchVars.isSearching = true;
  //search for the path
  const path = await searching(canCrossDiagonals);
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

  searchVars.isSearching = false;
}

function searching(canCrossDiagonals) {
  return new Promise((resolve) => {
    resolve(search(canCrossDiagonals));
  });
}

async function search(canCrossDiagonals) {
  /*if a cell is closed it means it has been visited, if it is not closed but is instead open
    then the cells dijkstrasShortest has been assigned, but its neighbours have not been checked. 
    To be visited it means that cells neighbours must have been checked.*/

  // reset the entire grid to prepare for the search
  await gridCl.resetForSearch();

  // init start and end cells
  const startCell = gridCl.startCell;
  const endCell = gridCl.endCell;

  //create a heap of unvisited cells
  const unvisitedHeap = new Heap(SEARCH_TYPES.DIJKSTRA);
  // initialize the heap with all the cells as they all start unvisited
  await initHeap(unvisitedHeap);

  // the parent cell of the start cell is itself for retracing purposes
  startCell.parentCell = startCell;
  startCell.opened = true;
  var currentCell = startCell;

  // the start cell has a cost of 0
  currentCell.gCost = 0;

  var neighbours = [];

  // continue looping until there is not unvisited cells
  while (unvisitedHeap.lastHeapItemIndex >= 0) {
    if (searchVars.stopSearch) {
      searchVars.stopSearch = false;
      console.log("stopped search");
      return;
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
          gridCl.calculateDistance(tempCurrentCell, neighbour);

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
          unvisitedHeap.update(neighbour, true);
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
    currentCell = unvisitedHeap.removeFirst();

    // if the current cell is the end then we have the shortest path
    if (currentCell === endCell) {
      const path = retracePath(startCell, endCell);
      return path;
    }
    // if after picking new distances for neighbours the lowest distance cell is still max value it means there is no path.
    if (currentCell.gCost === Number.MAX_SAFE_INTEGER) {
      break;
    }
  }
  console.log("no path found");
}

function initHeap(heap) {
  return new Promise((resolve) =>
    resolve(
      gridCl.grid.forEach((row) =>
        row.forEach((cell) => {
          cell.gCost = Number.MAX_SAFE_INTEGER;
          heap.add(cell);
        })
      )
    )
  );
}
