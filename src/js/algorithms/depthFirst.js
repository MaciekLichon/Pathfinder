import { classNames } from '../settings.js';
import { utils } from '../utils.js';

export const depthFirst = function({ startPosCell, finishPosCell, board, timerWidget, selectedAlgorithmName }) {

  return new Promise((resolve) => {

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
        utils.noPath(startPosCell, finishPosCell);
        console.log('no path');
        return resolve();
      }

      const currentCell = stack.pop();
      // console.log('current', currentCell);
      alreadyVisitedCells.push(currentCell);
      // console.log('already visited', alreadyVisitedCells);

      if (currentCell === finishPosCell) {
        clearInterval(interval);
        timerWidget.stopTimer(selectedAlgorithmName, true);
        return resolve();
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

  });

};
