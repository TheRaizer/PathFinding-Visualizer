import { rndEven, rndOdd, timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { cellIsStartOrEnd } from "../Cell/CellActions";
import { CELL_TYPES } from "../Cell/CellActions";

/*Recursive Division

Maze creation algorithm that recursively seperates the grid into sections.
Each section is seperated by a wall with a single passage.

The maze chooses whether to place vertical or horizontal walls in accordance 
to each sections dimensions.
*/

const ORIENTATIONS = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
};

export default function startRecursiveDivision() {
  return new Promise((resolve, reject) => {
    resolve(
      divide(
        1,
        1,
        gridCl.maxX - 2,
        gridCl.maxY - 2,
        chooseOrientation(1, 1, gridCl.maxX - 2, gridCl.maxY - 2)
      ).catch((err) => {
        console.log(err);
        reject(err);
      })
    );
  });
}

/* Determines whether to do a horizontal or vertical wall

horizontal space is greater than the vertical cut vertically vice-versa

@param {number} leftBound - the left most bound of the current section
@param {number} upperBound - the upper most bound of the current section
@param {number} rightBound - the right most bound of the current section
@param {number} lowerBound - the lower most bound of the current section

@return {string} orientation - the orientation of the wall to place
*/
function chooseOrientation(leftBound, upperBound, rightBound, lowerBound) {
  const horizSpace = rightBound - leftBound;
  const vertSpace = lowerBound - upperBound;

  if (horizSpace > vertSpace) {
    return ORIENTATIONS.VERTICAL;
  } else if (vertSpace > horizSpace) {
    return ORIENTATIONS.HORIZONTAL;
  } else {
    return Math.random() > 0.5
      ? ORIENTATIONS.HORIZONTAL
      : ORIENTATIONS.VERTICAL;
  }
}

const passageSize = 1;

/*Recursively divides the grid into sections

Each section is seperated by a wall with a passage.

@param {number} leftBound - the left most bound of the current section
@param {number} upperBound - the upper most bound of the current section
@param {number} rightBound - the right most bound of the current section
@param {number} lowerBound - the lower most bound of the current section

@param {string} orientation - the orientation of the wall to place
*/
async function divide(
  leftBound,
  upperBound,
  rightBound,
  lowerBound,
  orientation
) {
  if (
    rightBound - leftBound <= passageSize ||
    lowerBound - upperBound <= passageSize
  ) {
    return;
  }

  var isHorizontalCut = orientation === ORIENTATIONS.HORIZONTAL;

  const { xStartIdx, yStartIdx } = findStart(
    isHorizontalCut,
    leftBound,
    upperBound,
    rightBound,
    lowerBound
  );

  const { xPassageIdx, yPassageIdx } = choosePassage(
    isHorizontalCut,
    leftBound,
    upperBound,
    rightBound,
    lowerBound
  );

  var wallDist = isHorizontalCut
    ? rightBound - leftBound
    : lowerBound - upperBound;

  var dirX = isHorizontalCut ? 1 : 0;
  var dirY = isHorizontalCut ? 0 : 1;

  await drawWall(
    xStartIdx,
    yStartIdx,
    xPassageIdx,
    yPassageIdx,
    wallDist,
    dirX,
    dirY
  );

  if (isHorizontalCut) {
    // top section
    await divide(
      leftBound,
      upperBound,
      rightBound,
      yStartIdx - 1,
      chooseOrientation(leftBound, upperBound, rightBound, yStartIdx - 1)
    );
    // bottom section
    await divide(
      leftBound,
      yStartIdx + 1,
      rightBound,
      lowerBound,
      chooseOrientation(leftBound, yStartIdx + 1, rightBound, lowerBound)
    );
  } else {
    // left section
    await divide(
      leftBound,
      upperBound,
      xStartIdx - 1,
      lowerBound,
      chooseOrientation(leftBound, upperBound, xStartIdx - 1, lowerBound)
    );

    // right section
    await divide(
      xStartIdx + 1,
      upperBound,
      rightBound,
      lowerBound,
      chooseOrientation(xStartIdx + 1, upperBound, rightBound, lowerBound)
    );
  }
}

/* Draws the wall at a given start point and avoids placing a wall at a given passage point 

The wall also avoids placing walls where there is a start or end cell

@param {number} xStartIdx - the x-index in the grid to start drawing the wall
@param {number} yStartIdx - the y-index in the grid to start drawing the wall
@param {number} xPassageIdx - the x-index in the grid to avoid placing a wall
@param {number} yPassageIdx - the y-index in the grid to avoid placing a wall
@param {number} wallDist - the number of cells to draw on
@param {number} dirX - the direction to draw cells on the x-axis
@param {number} dirY - the direction to draw cells on the y-axis
*/
async function drawWall(
  xStartIdx,
  yStartIdx,
  xPassageIdx,
  yPassageIdx,
  wallDist,
  dirX,
  dirY
) {
  var xWallIdx = xStartIdx;
  var yWallIdx = yStartIdx;

  for (let i = 0; i <= wallDist; i++) {
    if (
      xWallIdx === xPassageIdx ||
      yWallIdx === yPassageIdx ||
      cellIsStartOrEnd(xWallIdx, yWallIdx)
    ) {
      xWallIdx += dirX;
      yWallIdx += dirY;
      continue;
    }
    gridCl.grid[yWallIdx][xWallIdx].cellType = CELL_TYPES.OBSTACLE;
    gridCl.grid[yWallIdx][xWallIdx].setCellRerender((rerender) => !rerender);

    xWallIdx += dirX;
    yWallIdx += dirY;

    await timer(1);
  }
}

/*Chooses the point to place a passage

Only place passages on odd indices so they do not intersect with walls.

@param {boolean} isHorizontalCut - whether the wall that is being placed is horizontal or not
@param {number} leftBound - the left most bound of the current section
@param {number} upperBound - the upper most bound of the current section
@param {number} rightBound - the right most bound of the current section
@param {number} lowerBound - the lower most bound of the current section

@return {Object} object containing the x and y indices of the passage
*/
function choosePassage(
  isHorizontalCut,
  leftBound,
  upperBound,
  rightBound,
  lowerBound
) {
  var xPassageIdx = 0;
  var yPassageIdx = 0;

  if (isHorizontalCut) {
    xPassageIdx = rndOdd(leftBound, rightBound);
    yPassageIdx = upperBound;
  } else {
    xPassageIdx = leftBound;
    yPassageIdx = rndOdd(upperBound, lowerBound);
  }

  return { xPassageIdx, yPassageIdx };
}

/*Finds the starting point to place the wall

You want walls to be on even indices so they cannot be created right beside
the grid outline as it would leave no room for a path.

@param {boolean} isHorizontalCut - whether the wall that is being placed is horizontal or not
@param {number} leftBound - the left most bound of the current section
@param {number} upperBound - the upper most bound of the current section
@param {number} rightBound - the right most bound of the current section
@param {number} lowerBound - the lower most bound of the current section

@return {Object} object containing the x and y indices of the wall start
*/
function findStart(
  isHorizontalCut,
  leftBound,
  upperBound,
  rightBound,
  lowerBound
) {
  var xStartIdx = 0;
  var yStartIdx = 0;
  if (isHorizontalCut) {
    xStartIdx = leftBound;
    yStartIdx = rndEven(upperBound + 1, lowerBound - 1);
  } else {
    xStartIdx = rndEven(leftBound + 1, rightBound - 1);
    yStartIdx = upperBound;
  }

  return { xStartIdx, yStartIdx };
}
