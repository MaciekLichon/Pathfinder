import { classNames } from '../settings.js';
import { utils } from '../utils.js';

export const depthFirst = function({ startPosCell, finishPosCell, board, timerWidget, selectedAlgorithmName }) {

  return new Promise((resolve) => {

    // const visited = [];

    // MOJE ZMIANY

    for (let cell in board) {

      const cellData = {
        cell: cell,
        neighbours: board[cell],
        parent: undefined,
      };

      board[cell] = cellData; // overwriting the existing board of neighbours with board of cells with data
    }

    const stack = [ startPosCell ];
    const alreadyVisitedCells = [];
    let path = [];

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

        let pathElement = board[currentCell];
        while (pathElement.parent) {
          path.push(pathElement.cell); // push given cell's parent cell
          pathElement = board[pathElement.parent]; // change current pathElement to recently checked parent to get its parent again
        }
        path = path.reverse();
        console.log('path', path);
        utils.drawPath(path);

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

      for (let neighbour of board[currentCell].neighbours) {
        if (!alreadyVisitedCells.includes(neighbour) && !stack.includes(neighbour)) {
        // if (!alreadyVisitedCells.includes(neighbour)) { // do we add the same neighbor to the stack multiple times or not?
          board[neighbour].parent = currentCell;
          stack.push(neighbour);
        }
      }
      // console.log('stack', stack);

    }, 20);

  });

};
