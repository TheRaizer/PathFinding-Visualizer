import { ALGO_ACTIONS } from "./AlgorithmReducer";
import { gridCl } from "./Grid/Grid";
import { searchVars } from "./Search";

export const mazeVars = { isCreatingMaze: false };

/* Outlines and generates a maze using a given algorithm.

@param {Function} mazeAlgo - the maze algorithm to run
@param {Function} varDispatch - the dispatch function used to change the state of the Header component
*/
export async function createMaze(mazeAlgo, varDispatch) {
  if (!mazeVars.isCreatingMaze && !searchVars.isSearching) {
    mazeVars.isCreatingMaze = true;
    varDispatch({ type: ALGO_ACTIONS.IS_CREATING_MAZE, payload: true });

    gridCl.clearEntireGrid();

    await gridCl
      // run outline grid promise
      .outlineGrid(1)
      .then(() => {
        // if outline grid had no error run maze algorithm promise
        mazeAlgo()
          .catch((err) => {
            // run if the promise was rejected
            console.log("Error running maze algorithm");
            console.error(err);
          })
          .finally(() => {
            // no matter the outcome run this
            mazeVars.isCreatingMaze = false;
            varDispatch({
              type: ALGO_ACTIONS.IS_CREATING_MAZE,
              payload: false,
            });
          });
      })
      .catch((err) => {
        // if the outline grid promise was rejected log the error
        console.error(err);
      });
  }
}
