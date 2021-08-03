import { ALGO_ACTIONS } from "./AlgorithmReducer";
import { mazeVars } from "./Maze";
import { timer } from "./UtilityFuncs";

export const searchVars = {
  isSearching: false,
  stopSearch: false,
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

/*

  @param {Function} varDispatch - dispatch function used to change state for the Header component
  @param {Function} searching - the searching algorithm to run
*/

/** Starts a given pathfinding algorithm and draws the path if found.
 *
 * @param {Boolean} canCrossDiagonals - whether the searching algorithm can cross diagonals.
 * @param {Function} headerDispatch - dispatch function used to change state for the Header component
 * @param {Function} search - the searching algorithm to run.
 * @returns
 */
export async function pathFind(canCrossDiagonals, headerDispatch, search) {
  if (searchVars.isSearching || mazeVars.isCreatingMaze) {
    return;
  }

  searchVars.isSearching = true;
  headerDispatch({ type: ALGO_ACTIONS.IS_SEARCHING, payload: true });

  // execute promise to search that should resolve a path
  var path = await searching(canCrossDiagonals, search).catch((err) => {
    // if the promise was rejected the log the error
    console.log("error in search");
    console.error(err);
  });

  // no path was found
  if (path == null) {
    endSearch(headerDispatch, false);
    return;
  }
  await drawPath(path).catch((err) => {
    console.error(err);
  });

  endSearch(headerDispatch, true);
}

/** Ends the searching algorithm and resets state.
 *
 * @param {Function} headerDispatch - dispatch function used to change state for the Header component
 * @param {Boolean} foundPath - whether a path was found or not
 */
function endSearch(headerDispatch, foundPath) {
  searchVars.isSearching = false;
  searchVars.stopSearch = false;
  headerDispatch({ type: ALGO_ACTIONS.IS_SEARCHING, payload: false });
  headerDispatch({ type: ALGO_ACTIONS.FOUND_PATH, payload: foundPath });
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
    search(canCrossDiagonals)
      .then((res) => {
        // get the path as 'res'
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
