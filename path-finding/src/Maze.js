import { ALGO_ACTIONS } from "./AlgorithmReducer";
import { gridCl } from "./Grid/Grid";
import { searchVars } from "./Search";

export const mazeVars = { isCreatingMaze: false };

export async function createMaze(mazeAlgo, varDispatch) {
  // we cannot create a maze if we are searching or already making one
  if (!mazeVars.isCreatingMaze && !searchVars.isSearching) {
    // set a lock so we cannot create multiple mazes at once
    mazeVars.isCreatingMaze = true;
    // make sure to change state so Header component can change
    varDispatch({ type: ALGO_ACTIONS.IS_CREATING_MAZE, payload: true });

    // clear the grid
    gridCl.clearEntireGrid();
    // outline the grid
    await gridCl.outlineGrid(1).then(() => {
      // once outlined create the maze
      mazeAlgo().then(() => {
        // once done creating return states back to initial
        mazeVars.isCreatingMaze = false;
        varDispatch({ type: ALGO_ACTIONS.IS_CREATING_MAZE, payload: false });
      });
    });
  }
}
