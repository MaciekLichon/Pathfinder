import { classNames, select } from '../settings.js';

export const randomWalk = function({ startPosCell, finishPosCell, board, timerWidget, selectedAlgorithmName }) {

  const alreadyVisitedCells = [];
  let currentCell = startPosCell;

  timerWidget.startTimer();

  const interval = setInterval(function() {

    const neighbours = board[currentCell];
    const neighboursCount = neighbours.length;

    if (currentCell === finishPosCell) {
      clearInterval(interval);
      timerWidget.stopTimer(selectedAlgorithmName);
      console.log('match');
    }

    const currentCellDOM = document.querySelector(`[num="${currentCell}"]`);
    const isStartPos = currentCellDOM.classList.contains(classNames.board.startPos);
    const isFinishPos = currentCellDOM.classList.contains(classNames.board.finishPos);

    if (!isStartPos && !isFinishPos) {
      currentCellDOM.classList.add(classNames.state.visited);
      currentCellDOM.classList.add(classNames.state.leader);
      setTimeout(function() {
        currentCellDOM.classList.remove(classNames.state.leader);
      }, 20);
      alreadyVisitedCells.push(currentCellDOM);
    }

    const nextMoveIndex = getRandom(neighboursCount);
    currentCell = neighbours[nextMoveIndex];

  }, 20);

  const listener = document.querySelector(select.containerOf.board);
  listener.addEventListener('click', function() {
    clearInterval(interval);
  });

};

const getRandom = function(num) {
  return Math.floor(Math.random() * num);
};
