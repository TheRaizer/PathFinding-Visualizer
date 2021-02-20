import { ALGO_ACTIONS } from "./AlgorithmReducer";
import { mazeVars } from "./Maze";
import { timer } from "./UtilityFuncs";

export const searchVars = {
  isSearching: false,
  stopSearch: false,
  maxSearchTime: 3000,
  minSearchTime: 1,
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

/*Starts a given pathfinding algorithm and draws the path if found.

  @param {Function} varDispatch - dispatch function used to change state for the Header component
  @param {Function} searching - the searching algorithm to run
*/
export async function pathFind(canCrossDiagonals, varDispatch, search) {
  if (searchVars.isSearching || mazeVars.isCreatingMaze) {
    return;
  }

  searchVars.isSearching = true;
  varDispatch({ type: ALGO_ACTIONS.IS_SEARCHING, payload: true });

  await searching(canCrossDiagonals, search).then(async (path) => {
    if (path == null) {
      endSearch(varDispatch);
      return;
    }
    await drawPath(path);
  });
  endSearch(varDispatch);
}

/*Ends the searching algorithm and resets state.

@param {Function} varDispatch - dispatch function used to change state for the Header component
*/
function endSearch(varDispatch) {
  searchVars.isSearching = false;
  searchVars.stopSearch = false;
  varDispatch({ type: ALGO_ACTIONS.IS_SEARCHING, payload: false });
}

async function drawPath(path) {
  for (let i = 0; i < path.length; i++) {
    const cell = path[i];
    cell.isOnPath = true;
    cell.setCellRerender((rerender) => !rerender);
    await timer(searchVars.pathAnimationTime);
  }
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
