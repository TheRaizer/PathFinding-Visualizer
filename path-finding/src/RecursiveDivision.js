import { rndEven, rndOdd, timer } from "./UtilityFuncs";
import { gridCl } from "./Grid";
import { CELL_TYPES } from "./CellActions";

const ORIENTATIONS = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
};

export default async function CreateMaze() {
  gridCl.clearEntireGrid();
  await gridCl.outlineGrid(15);
  await startDivision();
}

function startDivision() {
  return new Promise((resolve) => {
    resolve(
      divide(
        1,
        1,
        gridCl.maxX - 2, // rightBound needs to be index based
        gridCl.maxY - 2, // lowerBound needs to be index based
        chooseOrientation(1, 1, gridCl.maxX - 2, gridCl.maxY - 2)
      )
    );
  });
}

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

async function divide(
  leftBound,
  upperBound,
  rightBound,
  lowerBound,
  orientation,
  cameFrom
) {
  console.log(
    "rightBound: " +
      rightBound +
      " || lowerBound: " +
      lowerBound +
      " || left bound: " +
      leftBound +
      " || upper bound: " +
      upperBound +
      " || cameFrom X: " +
      cameFrom?.x +
      " || cameFrom Y: " +
      cameFrom?.y +
      " || orientation: " +
      orientation
  );

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
  console.log("Start Wall at X: " + xStartIdx + " Y: " + yStartIdx);
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
    divide(
      leftBound,
      upperBound,
      rightBound,
      yStartIdx - 1,
      chooseOrientation(leftBound, upperBound, rightBound, yStartIdx - 1),
      { x: xStartIdx, y: yStartIdx }
    );
    // bottom section
    divide(
      leftBound,
      yStartIdx + 1,
      rightBound,
      lowerBound,
      chooseOrientation(leftBound, yStartIdx + 1, rightBound, lowerBound),
      { x: xStartIdx, y: yStartIdx }
    );
  } else {
    // left section
    divide(
      leftBound,
      upperBound,
      xStartIdx - 1,
      lowerBound,
      chooseOrientation(leftBound, upperBound, xStartIdx - 1, lowerBound),
      { x: xStartIdx, y: yStartIdx }
    );

    // right section
    divide(
      xStartIdx + 1,
      upperBound,
      rightBound,
      lowerBound,
      chooseOrientation(xStartIdx + 1, upperBound, rightBound, lowerBound),
      { x: xStartIdx, y: yStartIdx }
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
    await timer(15);
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

  if (isHorizontalCut) {
    xPassageIdx = rndEven(leftBound, rightBound);
    yPassageIdx = upperBound;
  } else {
    xPassageIdx = leftBound;
    yPassageIdx = rndEven(upperBound, lowerBound);
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
    yStartIdx = rndOdd(upperBound + 1, lowerBound - 1);
  } else {
    xStartIdx = rndOdd(leftBound + 1, rightBound - 1);
    yStartIdx = upperBound;
  }

  return { xStartIdx, yStartIdx };
}
