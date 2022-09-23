import { classNames } from '../settings.js';

export const depthFirst = function({ startPosCell, finishPosCell, board, timerWidget, selectedAlgorithmName }) {

  // const visited = [];

  const stack = [ startPosCell ];
  const alreadyVisitedCells = [];

  // console.log(board);
  timerWidget.startTimer();

  const interval = setInterval(function() {

    // check if there's still somewhere to go
    if (stack.length === 0) {
      clearInterval(interval);
      timerWidget.stopTimer(selectedAlgorithmName, false);
      console.log('no path');
      return;
    }

    const currentCell = stack.pop();
    // console.log('current', currentCell);
    alreadyVisitedCells.push(currentCell);
    // console.log('already visited', alreadyVisitedCells);

    if (currentCell === finishPosCell) {
      clearInterval(interval);
      timerWidget.stopTimer(selectedAlgorithmName, true);
      // console.log('match');
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
      // visited.push(currentCellDOM);
    }

    for (let neighbour of board[currentCell]) {
      // if (!alreadyVisitedCells.includes(neighbour) && !stack.includes(neighbour)) {
      if (!alreadyVisitedCells.includes(neighbour)) { // do we add the same neighbor to the stack multiple times or not?
        stack.push(neighbour);
      }
    }
    // console.log('stack', stack);

  }, 20);

};
