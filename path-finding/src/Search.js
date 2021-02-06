export const SEARCH_TYPES = {
  A_STAR: "A*",
  DIJKSTRA: "DIJKSTRA",
};

export const searchVars = {
  isSearching: false,
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
