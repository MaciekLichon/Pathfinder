import { classNames } from '../settings.js';
import { utils } from '../utils.js';

export const breadthFirst = function({ startPosCell, finishPosCell, board, timerWidget, selectedAlgorithmName }) {

  return new Promise((resolve) => {
    // const visited = [];

    // NOWE ZMIANY

    for (let cell in board) {

      const cellData = {
        cell: cell,
        neighbours: board[cell],
        parent: undefined,
      };

      board[cell] = cellData; // overwriting the existing board of neighbours with board of cells with data
    }

    const queue = [ startPosCell ];
    const alreadyVisitedCells = [];
    let path = [];

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
        // visited.push(currentCellDOM);
      }

      for (let neighbour of board[currentCell].neighbours) {
        if (!alreadyVisitedCells.includes(neighbour) && !queue.includes(neighbour)) {
        // if (!alreadyVisitedCells.includes(neighbour)) { // do we add the same neighbor to the stack multiple times or not?
          board[neighbour].parent = currentCell;
          queue.push(neighbour);
        }
      }
    }, 20);

  });

};
