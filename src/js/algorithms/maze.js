import { classNames } from '../settings.js';

export const drawMaze = function(grid, rows, columns) {

  divide(1, 1, columns, rows);

};

const divide = function(initXPos, initYPos, endXPos, endYPos) {

  /* DETERMINE SECTION DIMENTIONS */
  const sectionWidth = endXPos - initXPos + 1; // add 1 because the first col is 1 and not 0
  const sectionHeight = endYPos - initYPos + 1; // add 1 because the first row is 1 and not 0

  if (sectionWidth < 2 || sectionHeight < 2) {
    return;
  }

  /* DETERMINE DIRECTION */
  const direction = orientation(sectionWidth, sectionHeight);

  /* ADD WALLS DEPENDING ON DIRECTION */
  if (direction === 'vertical') { // width > height

    // select wall column - X coord
    let wallX = 1;
    while (wallX % 2 != 0) {
      wallX = Math.floor(Math.random() * ((endXPos - 1) - (initXPos + 1) + 1)) + (initXPos + 1); //Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // select passage row - Y coord
    let passageY = Math.floor(Math.random() * (endYPos - initYPos + 1)) + initYPos; //Math.floor(Math.random() * (max - min + 1)) + min;
    let passageYTwo = null; // used in exceptional cases where the wall is between 2 other passages

    // adjust passage to avoid diagonal passes
    let updatedPassages = adjustPassageVertical(passageY, passageYTwo, initYPos, endYPos, wallX);
    passageY = updatedPassages[0];
    passageYTwo = updatedPassages[1];

    // build wall
    for (let i = initYPos; i <= endYPos; i++) { // select wall-length-number of cells in the selected column starting at initial Y coord
      if (i != passageY && i != passageYTwo) {
        const selectedColumnCell = document.querySelector(`[column="${wallX}"][row="${i}"]`);
        selectedColumnCell.classList.add(classNames.board.wall);
      }
    }

    // next function run for the left side section
    setTimeout(function() {
      divide(initXPos, initYPos, wallX - 1, endYPos);
    }, 300);

    // next function run for the right side section
    setTimeout(function() {
      divide(wallX + 1, initYPos, endXPos, endYPos);
    }, 300);
  }
  else if (direction === 'horizontal') { // width < height

    // select wall row - Y coord
    let wallY = 1;
    while (wallY % 2 != 0) {
      wallY = Math.floor(Math.random() * ((endYPos - 1) - (initYPos + 1) + 1)) + (initYPos + 1); //Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // select passage column - X coord
    let passageX = Math.floor(Math.random() * (endXPos - initXPos + 1)) + initXPos; //Math.floor(Math.random() * (max - min + 1)) + min;
    let passageXTwo = null; // used in exceptional cases where the wall is between 2 other passages

    // adjust passage to avoid diagonal passes
    let updatedPassages = adjustPassageHorizontal(passageX, passageXTwo, initXPos, endXPos, wallY);
    passageX = updatedPassages[0];
    passageXTwo = updatedPassages[1];

    // build wall
    for (let i = initXPos; i <= endXPos; i++) { // select wall-length-number of cells in the selected row starting at initial X coord
      if (i != passageX && i != passageXTwo) {
        const selectedColumnCell = document.querySelector(`[column="${i}"][row="${wallY}"]`);
        selectedColumnCell.classList.add(classNames.board.wall);
      }
    }

    // next function run for the above section
    setTimeout(function() {
      divide(initXPos, initYPos, endXPos, wallY - 1);
    }, 300);

    // next function run for the below section
    setTimeout(function() {
      divide(initXPos, wallY + 1, endXPos, endYPos);
    }, 300);
  }

};


const orientation = function(width, height) {

  const directions = ['horizontal', 'vertical'];

  if (width < height) {
    return directions[0];
  } else if (width > height) {
    return directions[1];
  } else {
    const index = Math.round(Math.random());
    return directions[index];
  }

};


const adjustPassageVertical = function(passageY, passageYTwo, initYPos, endYPos, wallX) {
  // console.log('adjustPassageVertical');

  const cellAboveWall = document.querySelector(`[column="${wallX}"][row="${initYPos - 1}"]`);
  const cellBelowWall = document.querySelector(`[column="${wallX}"][row="${endYPos + 1}"]`);

  if (cellAboveWall && cellBelowWall) {
    if (!cellAboveWall.classList.contains(classNames.board.wall)) {
      passageY = initYPos;
      if (!cellBelowWall.classList.contains(classNames.board.wall)) {
        passageYTwo = endYPos;
        console.log('----------- passageYTwo used');
        console.log(cellAboveWall, cellBelowWall);
      }
    } else {
      passageY = endYPos;
    }
    // console.log('change - up/down');
  } else if (cellBelowWall && !cellAboveWall) {
    if (!cellBelowWall.classList.contains(classNames.board.wall)) {
      passageY = endYPos;
      // console.log('changed - below');
    }
  } else if (!cellBelowWall && cellAboveWall) {
    if (!cellAboveWall.classList.contains(classNames.board.wall)) {
      passageY = initYPos;
      // console.log('changed - above');
    }
  }

  return [passageY, passageYTwo];
};


const adjustPassageHorizontal = function(passageX, passageXTwo, initXPos, endXPos, wallY) {
  // console.log('adjustPassageHorizontal');

  const cellRightToWall = document.querySelector(`[column="${endXPos + 1}"][row="${wallY}"]`);
  const cellLeftToWall = document.querySelector(`[column="${initXPos - 1}"][row="${wallY}"]`);

  if (cellRightToWall && cellLeftToWall) {
    if (!cellRightToWall.classList.contains(classNames.board.wall)) {
      passageX = endXPos;
      if (!cellLeftToWall.classList.contains(classNames.board.wall)) {
        passageXTwo = initXPos;
        console.log('----------- passageXTwo');
        console.log(cellRightToWall, cellLeftToWall);
      }
    } else {
      passageX = initXPos;
    }
    // console.log('changed - left/right');
  } else if (cellLeftToWall && !cellRightToWall) {
    if (!cellLeftToWall.classList.contains(classNames.board.wall)) {
      passageX = initXPos;
      // console.log('changed - left');
    }
  } else if (!cellLeftToWall && cellRightToWall) {
    if (!cellRightToWall.classList.contains(classNames.board.wall)) {
      passageX = endXPos;
      // console.log('changed - right');
    }
  }

  return [passageX, passageXTwo];
};
