import { classNames } from '../settings.js';

export const breadthFirst = function(startPosCell, finishPosCell, board) {

  // const visited = [];

  const queue = [ startPosCell ];
  const alreadyVisitedCells = [];

  // thisPathfinder.startTimer();

  const interval = setInterval(function() {

    const currentCell = queue.shift();
    alreadyVisitedCells.push(currentCell);

    if (currentCell === finishPosCell) {
      clearInterval(interval);
      // thisPathfinder.stopTimer();
      console.log('match');
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

};
