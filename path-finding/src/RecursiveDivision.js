import { rndEven, rndOdd, timer } from "./UtilityFuncs";
import { gridCl } from "./Grid";
import { searchVars } from "./Search";
import { mazeVars } from "./Maze";
import { CELL_TYPES } from "./CellActions";

const ORIENTATIONS = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
};

export default async function CreateMaze() {
  if (!mazeVars.isCreatingMaze && !searchVars.isSearching) {
    mazeVars.isCreatingMaze = true;
    gridCl.clearEntireGrid();
    await gridCl.outlineGrid(1);
    await startDivision();
    mazeVars.isCreatingMaze = false;
  }
}

function startDivision() {
  return new Promise((resolve) => {
    resolve(
      divide(
        1,
        1,
        gridCl.maxX - 2, // -1 to make it indexed base and -1 again to add an outline of 1
        gridCl.maxY - 2,
        chooseOrientation(1, 1, gridCl.maxX - 2, gridCl.maxY - 2)
      )
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
    if (xWallIdx === xPassageIdx || yWallIdx === yPassageIdx) {
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

function choosePassage(
  isHorizontalCut,
  leftBound,
  upperBound,
  rightBound,
  lowerBound
) {
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
    upperBound + 1 are both EVEN inclusive ranges with a grid whose Y-axis length is ODD
    and an outline of 1 is applied */
    yStartIdx = rndEven(upperBound + 1, lowerBound - 1);
  } else {
    /* a vert wall needs to be on any random EVEN row because the rightBound - 1 and
    leftBound + 1 are both EVEN inclusive ranges with a grid whose X-axis length is 
    ODD and an outline of 1 is applied */
    xStartIdx = rndEven(leftBound + 1, rightBound - 1);
    yStartIdx = upperBound;
  }

  return { xStartIdx, yStartIdx };
}
