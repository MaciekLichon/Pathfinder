import { classNames } from '../settings.js';

export const depthFirst = function(startPosCell, finishPosCell, board) {

  // const visited = [];

  const stack = [ startPosCell ];
  const alreadyVisitedCells = [];

  // console.log(board);
  // thisPathfinder.startTimer();

  const interval = setInterval(function() {

    const currentCell = stack.pop();
    // console.log('current', currentCell);
    alreadyVisitedCells.push(currentCell);
    // console.log('already visited', alreadyVisitedCells);

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
      // if (!alreadyVisitedCells.includes(neighbour) && !stack.includes(neighbour)) {
      if (!alreadyVisitedCells.includes(neighbour)) { // do we add the same neighbor to the stack multiple times or not?
        stack.push(neighbour);
      }
    }
    // console.log('stack', stack);

  }, 20);

};
