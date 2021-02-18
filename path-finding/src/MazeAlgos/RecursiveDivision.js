import { rndEven, rndOdd, timer } from "../UtilityFuncs";
import { gridCl } from "../Grid/Grid";
import { cellIsStartOrEnd } from "../Cell/CellActions";
import { CELL_TYPES } from "../Cell/CellActions";

const ORIENTATIONS = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
};

export default function startRecursiveDivision() {
  // begin the division
  return new Promise((resolve, reject) => {
    resolve(
      divide(
        1,
        1,
        gridCl.maxX - 2, // -1 to make it indexed base and -1 again to add an outline of 1
        gridCl.maxY - 2,
        chooseOrientation(1, 1, gridCl.maxX - 2, gridCl.maxY - 2)
      ).catch((err) => {
        console.log(err);
        reject(err);
      })
    );
  });
}

function chooseOrientation(leftBound, upperBound, rightBound, lowerBound) {
  // if the horizontal space is greater than the vertical cut vertically vice-versa
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

async function divide(
  leftBound,
  upperBound,
  rightBound,
  lowerBound,
  orientation
) {
  if (rightBound - leftBound < 2 || lowerBound - upperBound < 2) {
    return;
  }

  var isHorizontalCut = orientation === ORIENTATIONS.HORIZONTAL;

  // find the point to start the wall at
  const { xStartIdx, yStartIdx } = findStart(
    isHorizontalCut,
    leftBound,
    upperBound,
    rightBound,
    lowerBound
  );

  // find the point to place the passage
  const { xPassageIdx, yPassageIdx } = choosePassage(
    isHorizontalCut,
    leftBound,
    upperBound,
    rightBound,
    lowerBound
  );
  // calculate the max distance the wall can span
  var wallDist = isHorizontalCut
    ? rightBound - leftBound
    : lowerBound - upperBound;
  // get the direction to move in according to whether it is a horiz or vert wall
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

async function drawWall(
  xStartIdx,
  yStartIdx,
  xPassageIdx,
  yPassageIdx,
  wallDist,
  dirX,
  dirY
) {
  // set the starting point to draw the wall
  var xWallIdx = xStartIdx;
  var yWallIdx = yStartIdx;

  // loop through the distance of the wall
  for (let i = 0; i <= wallDist; i++) {
    // to make the space for the passage we just avoid putting a wall where the passage occurs
    // we also musn't put a wall where the start or end cells are
    if (
      xWallIdx === xPassageIdx ||
      yWallIdx === yPassageIdx ||
      cellIsStartOrEnd(xWallIdx, yWallIdx)
    ) {
      xWallIdx += dirX;
      yWallIdx += dirY;
      continue;
    }
    // draw the wall at the indices and rerender
    gridCl.grid[yWallIdx][xWallIdx].cellType = CELL_TYPES.OBSTACLE;
    gridCl.grid[yWallIdx][xWallIdx].setCellRerender((rerender) => !rerender);

    // increment the indices according to the direction
    xWallIdx += dirX;
    yWallIdx += dirY;

    // timer is used for animation
    await timer(1);
  }
}

function choosePassage(
  isHorizontalCut,
  leftBound,
  upperBound,
  rightBound,
  lowerBound
) {
  // choose a passage between the given bounds
  var xPassageIdx = 0;
  var yPassageIdx = 0;

  // must be any odd number between a range because walls are created on even numbers
  if (isHorizontalCut) {
    xPassageIdx = rndOdd(leftBound, rightBound);
    yPassageIdx = upperBound;
  } else {
    xPassageIdx = leftBound;
    yPassageIdx = rndOdd(upperBound, lowerBound);
  }

  return { xPassageIdx, yPassageIdx };
}

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
    /* a horiz wall needs to be on any random EVEN column because the lowerBound - 1 and
    upperBound + 1 are both EVEN inclusive ranges when it is a grid whose Y-axis length is ODD
    and an outline of 1 is applied (you dont wanna place walls right beside a bound as there would be no room for a path)*/
    yStartIdx = rndEven(upperBound + 1, lowerBound - 1);
  } else {
    /* a vert wall needs to be on any random EVEN row because the rightBound - 1 and
    leftBound + 1 are both EVEN inclusive ranges when it is a grid whose X-axis length is 
    ODD and an outline of 1 is applied (you dont wanna place walls right beside a bound as there would be no room for a path)*/
    xStartIdx = rndEven(leftBound + 1, rightBound - 1);
    yStartIdx = upperBound;
  }

  return { xStartIdx, yStartIdx };
}
