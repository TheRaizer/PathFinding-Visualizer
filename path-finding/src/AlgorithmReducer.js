export const ALGO_ACTIONS = {
  IS_SEARCHING: "IS_SEARCHING",
  IS_CREATING_MAZE: "IS_CREATING_MAZE",
};

export const initialState = {
  isSearching: false,
  isCreatingMaze: false,
};

export default function algoReducer(state, action) {
  switch (action.type) {
    case ALGO_ACTIONS.IS_SEARCHING:
      return {
        ...state,
        isSearching: action.payload,
      };
    case ALGO_ACTIONS.IS_CREATING_MAZE:
      return {
        ...state,
        isCreatingMaze: action.payload,
      };
    default:
      console.error("no matching action types");
  }
}
