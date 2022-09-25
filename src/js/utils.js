import { classNames } from './settings.js';


export const utils = {}; // eslint-disable-line no-unused-vars

// removes active class from all action buttons unless the clicked one (btn) is currently active
// there's a toggle func added in Pathfinder after calling this one
utils.checkActiveButtons = function(arr, btn) {
  for (let item of arr) {
    if (item.classList.contains(classNames.state.active) && item != btn) {
      item.classList.remove(classNames.state.active);
    }
  }
};

utils.drawPath = function(path) {

  setTimeout(function() {
    let index = 0;

    const interval = setInterval(function() {

      if (path[index]) {
        const cell = document.querySelector(`[num="${path[index]}"]`);
        cell.classList.add(classNames.board.path);
        index += 1;
      }
      else {
        clearInterval(interval);
        console.log('done');
        return;
      }

    }, 20);
  }, 700);

};

utils.noPath = function(start, finish) {

  setTimeout(function() {

    const startCell = document.querySelector(`[num="${start}"]`);
    const finishCell = document.querySelector(`[num="${finish}"]`);

    const cellsToHighlight = [startCell, finishCell];

    for (let cell of cellsToHighlight) {
      cell.classList.add(classNames.board.noPath);

      setTimeout(function() {
        cell.classList.remove(classNames.board.noPath);
      }, 1500);
    }

  }, 1000);
};

utils.checkIfAdjacent = function(start, finish, rows, columns) {

  const startCell = parseInt(start.getAttribute('num'));
  const finishCell = parseInt(finish.getAttribute('num'));

  const isRight = startCell === finishCell + 1;
  const isLeft = startCell === finishCell - 1;
  const isTop = startCell === finishCell - columns;
  const isBottom = startCell === finishCell + columns;
  const isTopLeft = startCell === finishCell - columns - 1;
  const isTopRight = startCell === finishCell - columns + 1;
  const isBottomLeft = startCell === finishCell + columns - 1;
  const isBottomRight = startCell === finishCell + columns + 1;

  if (isRight || isLeft || isTop || isBottom || isTopLeft || isTopRight || isBottomLeft || isBottomRight) {
    return true;
  } else {
    return false;
  }
};

utils.disableClicking = function(status) {
  if (status) {
    document.body.classList.add(classNames.general.clickDisabled);
  } else {
    document.body.classList.remove(classNames.general.clickDisabled);
  }
};
