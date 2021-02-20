import { ALGO_ACTIONS } from "./AlgorithmReducer";
import { gridCl } from "./Grid/Grid";
import { searchVars } from "./Search";

export const mazeVars = { isCreatingMaze: false };

// outlines and creates the grid with the given maze algorithm
export async function createMaze(mazeAlgo, varDispatch) {
  if (!mazeVars.isCreatingMaze && !searchVars.isSearching) {
    mazeVars.isCreatingMaze = true;
    varDispatch({ type: ALGO_ACTIONS.IS_CREATING_MAZE, payload: true });

    gridCl.clearEntireGrid();

    await gridCl.outlineGrid(1).then(() => {
      mazeAlgo().then(() => {
        mazeVars.isCreatingMaze = false;
        varDispatch({ type: ALGO_ACTIONS.IS_CREATING_MAZE, payload: false });
      });
    });
  }
}
