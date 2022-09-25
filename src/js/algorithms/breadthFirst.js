import { classNames } from '../settings.js';
import { utils } from '../utils.js';

export const breadthFirst = function({ startPosCell, finishPosCell, board, timerWidget, selectedAlgorithmName }) {

  return new Promise((resolve) => {
    // const visited = [];

    const queue = [ startPosCell ];
    const alreadyVisitedCells = [];

    timerWidget.startTimer();

    const interval = setInterval(function() {

      // check if there's still somewhere to go
      if (queue.length === 0) {
        clearInterval(interval);
        timerWidget.stopTimer(selectedAlgorithmName, false);
        utils.noPath(startPosCell, finishPosCell);
        console.log('no path');
        return resolve();
      }

      const currentCell = queue.shift();
      alreadyVisitedCells.push(currentCell);

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
        // visited.push(currentCellDOM);
      }

      for (let neighbour of board[currentCell]) {
        if (!alreadyVisitedCells.includes(neighbour) && !queue.includes(neighbour)) {
        // if (!alreadyVisitedCells.includes(neighbour)) { // do we add the same neighbor to the stack multiple times or not?
          queue.push(neighbour);
        }
      }
    }, 20);

  });
  
};
