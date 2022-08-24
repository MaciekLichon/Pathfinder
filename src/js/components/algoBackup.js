// depthFirst() {
//   const thisPathfinder = this;
//
//   thisPathfinder.visited = [];
//
//   const startPosCell = parseInt(thisPathfinder.dom.startPos.getAttribute('num'));
//   const finishPosCell = parseInt(thisPathfinder.dom.finishPos.getAttribute('num'));
//   const board = thisPathfinder.convertBoardToObject();
//
//   const stack = [ startPosCell ];
//   const alreadyVisitedCells = [];
//
//   // console.log(board);
//   thisPathfinder.startTimer();
//
//   const interval = setInterval(function() {
//
//     const currentCell = stack.pop();
//     // console.log('current', currentCell);
//     alreadyVisitedCells.push(currentCell);
//     // console.log('already visited', alreadyVisitedCells);
//
//     if (currentCell === finishPosCell) {
//       clearInterval(interval);
//       thisPathfinder.stopTimer();
//       console.log('match');
//     }
//
//     const currentCellDOM = thisPathfinder.dom.board.querySelector(`[num="${currentCell}"]`);
//     const isStartPos = currentCellDOM.classList.contains(classNames.board.startPos);
//     const isFinishPos = currentCellDOM.classList.contains(classNames.board.finishPos);
//
//     if (!isStartPos && !isFinishPos) {
//       currentCellDOM.classList.add(classNames.state.visited);
//       thisPathfinder.visited.push(currentCellDOM);
//     }
//
//     for (let neighbour of board[currentCell]) {
//       // if (!alreadyVisitedCells.includes(neighbour) && !stack.includes(neighbour)) {
//       if (!alreadyVisitedCells.includes(neighbour)) { // do we add the same neighbor to the stack multiple times or not?
//         stack.push(neighbour);
//       }
//     }
//     // console.log('stack', stack);
//
//   }, 20);
//
// }

// breadthFirst() {
//   const thisPathfinder = this;
//
//   const startPosCell = parseInt(thisPathfinder.dom.startPos.getAttribute('num'));
//   const finishPosCell = parseInt(thisPathfinder.dom.finishPos.getAttribute('num'));
//   const board = thisPathfinder.convertBoardToObject();
//
//   const queue = [ startPosCell ];
//   const alreadyVisitedCells = [];
//
//   thisPathfinder.startTimer();
//
//   const interval = setInterval(function() {
//
//     const currentCell = queue.shift();
//     alreadyVisitedCells.push(currentCell);
//
//     if (currentCell === finishPosCell) {
//       clearInterval(interval);
//       thisPathfinder.stopTimer();
//       console.log('match');
//     }
//
//     const currentCellDOM = thisPathfinder.dom.board.querySelector(`[num="${currentCell}"]`);
//     const isStartPos = currentCellDOM.classList.contains(classNames.board.startPos);
//     const isFinishPos = currentCellDOM.classList.contains(classNames.board.finishPos);
//
//     if (!isStartPos && !isFinishPos) {
//       currentCellDOM.classList.add(classNames.state.visited);
//       thisPathfinder.visited.push(currentCellDOM);
//     }
//
//     for (let neighbour of board[currentCell]) {
//       if (!alreadyVisitedCells.includes(neighbour) && !queue.includes(neighbour)) {
//       // if (!alreadyVisitedCells.includes(neighbour)) { // do we add the same neighbor to the stack multiple times or not?
//         queue.push(neighbour);
//       }
//     }
//   }, 20);
// }

// aStar() {
//   const thisPathfinder = this;
//
//   // --------- ALGORITHM PREP --------- //
//
//   const startPosCell = parseInt(thisPathfinder.dom.startPos.getAttribute('num'));
//   const finishPosCell = parseInt(thisPathfinder.dom.finishPos.getAttribute('num'));
//   const board = thisPathfinder.convertBoardToObject(); // object of neighbours later changed to object of cell objects - below for loop
//
//   for (let cell in board) {
//     const cellDOM = thisPathfinder.dom.board.querySelector(`[num="${cell}"]`);
//
//     const cellData = {
//       cell: cell,
//       row: parseInt(cellDOM.getAttribute('row')),
//       col: parseInt(cellDOM.getAttribute('column')),
//       f: 0, // g + h
//       g: 0, // actual dist from start
//       h: 0, // estimated dist to finish
//       neighbours: board[cell],
//       parent: undefined,
//     };
//
//     board[cell] = cellData; // overwriting the existing board of neighbours with board of cells with data
//   }
//
//   const openSet = [ board[startPosCell] ]; // yet to check (only neighbours can be added)
//   const closedSet = []; // already checked
//   let path = [];
//   thisPathfinder.startTimer();
//
//   // --------- ALGORITHM START --------- //
//
//   // while (openSet.length > 0) {
//   const interval = setInterval(function() {
//
//     // Stage 1 START: get the value with the lowest fScore from openSet array and assign to current
//
//     let lowestFScoreIndex = 0; // set to 0 each time to make sure that all elements are checked in the if statement
//
//     for (let i = 0; i < openSet.length; i++) {
//       if (openSet[i].f < openSet[lowestFScoreIndex].f) {
//         lowestFScoreIndex = i;
//       }
//     }
//
//     let current = openSet[lowestFScoreIndex];
//
//     if (current.cell != startPosCell && current.cell != finishPosCell) {
//       const currentDOM = thisPathfinder.dom.board.querySelector(`[num="${current.cell}"]`);
//       currentDOM.classList.add(classNames.state.visited);
//       thisPathfinder.visited.push(currentDOM);
//     }
//
//     // Stage 1 END
//
//     // Stage 2 START: check if done and get path by going back through all parent nodes
//
//     if (current === board[finishPosCell]) {
//       let pathElement = current;
//       path.push(pathElement.cell); // push final cell: finish pos
//       while (pathElement.parent) {
//         path.push(pathElement.parent.cell); // push given cell's parent cell
//         pathElement = pathElement.parent; // change current pathElement to recently checked parent to get its parent again
//       }
//       path = path.reverse();
//       console.log('path', path);
//       clearInterval(interval);
//       thisPathfinder.stopTimer();
//       return;
//     }
//
//     // Stage 2 END
//
//     // Stage 3 START: update openSet and closedSet
//
//     openSet.splice(lowestFScoreIndex, 1); // remove current from openSet because current = openSet[lowestFScoreIndex]
//     closedSet.push(current); // and add it to closedSet
//
//     // Stage 3 END
//
//     // Stage 4 START: process neighbours
//
//     const neighbours = current.neighbours;
//
//     for (let neighbour of neighbours) {
//       const neighbourData = board[neighbour];
//
//       // if not already checked
//       if (!closedSet.includes(neighbourData)) {
//         const possibleNeighbourG = current.g + 1; // neighbour is always one step from current
//
//         // if not already in 'to-check' (neighbours are the same for multiple cells so there's no point of adding one a few times)
//         if (!openSet.includes(neighbourData)) {
//           openSet.push(neighbourData);
//         }
//         // if already in 'to-check' and ..., ignore neighbour
//         else if (possibleNeighbourG >= neighbourData.g) {
//           continue;
//         }
//
//         neighbourData.g = possibleNeighbourG;
//         neighbourData.h = thisPathfinder.heuristic(neighbour, finishPosCell);
//         neighbourData.f = neighbourData.g + neighbourData.h;
//         neighbourData.parent = current;
//       }
//     }
//     // Stage 4 END
//
//   }, 20);
//
// }
//
// heuristic(cellOne, cellTwo) {
//   const thisPathfinder = this;
//
//   const cellOneDOM = thisPathfinder.dom.board.querySelector(`[num="${cellOne}"]`);
//   const cellTwoDOM = thisPathfinder.dom.board.querySelector(`[num="${cellTwo}"]`);
//
//   const cellOneRow = parseInt(cellOneDOM.getAttribute('row'));
//   const cellOneCol = parseInt(cellOneDOM.getAttribute('column'));
//   const cellTwoRow = parseInt(cellTwoDOM.getAttribute('row'));
//   const cellTwoCol = parseInt(cellTwoDOM.getAttribute('column'));
//
//   const distRows = Math.abs(cellOneRow - cellTwoRow);
//   const distCols = Math.abs(cellOneCol - cellTwoCol);
//
//   return distRows + distCols;
// }
