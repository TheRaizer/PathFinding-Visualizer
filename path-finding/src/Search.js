import { ALGO_ACTIONS } from "./AlgorithmReducer";
import { mazeVars } from "./Maze";
import { timer } from "./UtilityFuncs";

export const SEARCH_TYPES = {
  A_STAR: "A*",
  DIJKSTRA: "DIJKSTRA",
  BEST_FIRST: "BEST_FIRST",
};

export const searchVars = {
  isSearching: false,
  stopSearch: false,
  pathAnimationTime: 10,
  searchAnimationTime: 15,
};

export function retracePath(start, end) {
  const path = [];
  var currentCell = end;

  while (currentCell !== start) {
    path.push(currentCell);
    currentCell = currentCell.parentCell;
  }
  path.reverse();

  return path;
}

export async function pathFind(canCrossDiagonals, varDispatch, search) {
  // lock the async function so it can only run one at a time
  if (searchVars.isSearching || mazeVars.isCreatingMaze) {
    return;
  }
  searchVars.isSearching = true;
  varDispatch({ type: ALGO_ACTIONS.IS_SEARCHING, payload: true });
  //search for the path
  await searching(canCrossDiagonals, search).then(async (path) => {
    if (path == null) {
      searchVars.isSearching = false;
      searchVars.stopSearch = false;
      varDispatch({ type: ALGO_ACTIONS.IS_SEARCHING, payload: false });
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
  searchVars.stopSearch = false;
  varDispatch({ type: ALGO_ACTIONS.IS_SEARCHING, payload: false });
}

function searching(canCrossDiagonals, search) {
  return new Promise((resolve, reject) => {
    resolve(
      search(canCrossDiagonals).catch((err) => {
        console.log(err);
        reject(err);
      })
    );
  });
}
