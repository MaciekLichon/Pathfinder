import { settings, select, classNames } from '../settings.js';
import { utils } from '../utils.js';

class Pathfinder {
  constructor() {
    const thisPathfinder = this;


    thisPathfinder.getElements();
    thisPathfinder.renderBoard(settings.board.defaultRows, settings.board.defaultColumns);
    thisPathfinder.initDropdownMenus();
    thisPathfinder.initActionButtons();
    thisPathfinder.initHeader();
    thisPathfinder.initMouseHoldTracking();
  }

  getElements() {
    const thisPathfinder = this;

    thisPathfinder.dom = {};

    thisPathfinder.dom.visualizer = document.querySelector(select.containerOf.visualizer);

    thisPathfinder.dom.header = document.querySelector(select.containerOf.header);
    thisPathfinder.dom.board = thisPathfinder.dom.visualizer.querySelector(select.containerOf.board);
    thisPathfinder.dom.actionsBar = thisPathfinder.dom.visualizer.querySelector(select.containerOf.allActions);
    thisPathfinder.dom.timer = document.querySelector(select.containerOf.timer);

    thisPathfinder.dom.clearButton = thisPathfinder.dom.header.querySelector(select.header.clearBoard);
    thisPathfinder.dom.algorithmSetters = thisPathfinder.dom.header.querySelectorAll(select.action.algorithm);
    thisPathfinder.dom.visualizeButton = thisPathfinder.dom.header.querySelector(select.header.visualize);

    thisPathfinder.dom.boardSizeSetters = thisPathfinder.dom.actionsBar.querySelectorAll(select.action.boardSize);
    thisPathfinder.dom.themeSetters = thisPathfinder.dom.actionsBar.querySelectorAll(select.action.theme);
    thisPathfinder.dom.drawingActions = thisPathfinder.dom.actionsBar.querySelector(select.containerOf.drawingActions);

    thisPathfinder.dom.startPos = thisPathfinder.dom.board.querySelector(select.node.start);
    thisPathfinder.dom.finishPos = thisPathfinder.dom.board.querySelector(select.node.finish);

    thisPathfinder.dom.timerCounter = thisPathfinder.dom.timer.querySelector(select.timer.counter);
    thisPathfinder.dom.timerDropdown = thisPathfinder.dom.timer.querySelector(select.timer.dropdown);
  }

  // --------- INIT ALL BUTTONS --------- //

  initDropdownMenus() {
    const thisPathfinder = this;

    // ALGORITHMS
    for (let algorithmSetter of thisPathfinder.dom.algorithmSetters) {
      algorithmSetter.addEventListener('click', function(event) {
        event.preventDefault();
        const clickedElement = event.target;

        if (!clickedElement.classList.contains(classNames.state.algorithmSelected)) {
          const currentlySelected = thisPathfinder.dom.header.querySelector(select.setter.algorithmSelected);
          if (currentlySelected) {
            currentlySelected.classList.remove(classNames.state.algorithmSelected);
          }
          clickedElement.classList.add(classNames.state.algorithmSelected);

          thisPathfinder.selectedAlgorithm = clickedElement.getAttribute('data-algorithm');
          thisPathfinder.selectedAlgorithmName = clickedElement.innerHTML;

          const clickedElementHTML = `Visualize ${thisPathfinder.selectedAlgorithmName.toUpperCase()}`;
          thisPathfinder.dom.visualizeButton.innerHTML = clickedElementHTML;
        }

        thisPathfinder.clearBoardForNewAlgorithm();
      });
    }

    // BOARD SIZE
    for (let sizeSetter of thisPathfinder.dom.boardSizeSetters) {
      sizeSetter.addEventListener('click', function(event) {
        event.preventDefault();
        const clickedElement = event.target;

        if (!clickedElement.classList.contains(classNames.state.sizeSelected)) {
          const currentlySelected = thisPathfinder.dom.actionsBar.querySelector(select.setter.sizeSelected);
          currentlySelected.classList.remove(classNames.state.sizeSelected);
          clickedElement.classList.add(classNames.state.sizeSelected);

          const rows = parseInt(clickedElement.getAttribute('data-rows'));
          const columns = parseInt(clickedElement.getAttribute('data-columns'));

          thisPathfinder.renderBoard(rows, columns);
          thisPathfinder.clearBoard();
        }
      });
    }

    // THEME
    const allThemes = [];

    for (let themeSetter of thisPathfinder.dom.themeSetters) {
      allThemes.push(themeSetter.getAttribute('data-theme'));

      themeSetter.addEventListener('click', function(event) {
        event.preventDefault();
        const clickedElement = event.target;

        if (!clickedElement.classList.contains(classNames.state.themeSelected)) {
          const currentlySelected = thisPathfinder.dom.actionsBar.querySelector(select.setter.themeSelected);
          currentlySelected.classList.remove(classNames.state.themeSelected);
          clickedElement.classList.add(classNames.state.themeSelected);

          const selectedTheme = clickedElement.getAttribute('data-theme');

          for (let theme of allThemes) {
            if (thisPathfinder.dom.board.classList.contains(theme)) {
              thisPathfinder.dom.board.classList.remove(theme);
            }
          }

          thisPathfinder.dom.board.classList.add(selectedTheme);
          document.body.style.background = clickedElement.getAttribute('body-color');

          thisPathfinder.renderBoard(thisPathfinder.rows, thisPathfinder.columns);
          thisPathfinder.clearBoard();
        }
      });
    }
  }

  initActionButtons() {
    const thisPathfinder = this;

    const actionButtons = thisPathfinder.dom.drawingActions.children;

    thisPathfinder.dom.actionsBar.addEventListener('click', function(event) {
      const clickedElement = event.target.parentNode;

      if (clickedElement.classList.contains(classNames.actions.setting)) {
        utils.checkActiveButtons(actionButtons, clickedElement);
        clickedElement.classList.toggle(classNames.state.active);

        if (clickedElement.classList.contains(classNames.state.active)) {
          const actionName = clickedElement.getAttribute('action');
          thisPathfinder.currentAction = actionName;
        } else {
          thisPathfinder.currentAction = 'noAction';
        }

        thisPathfinder.initStage(thisPathfinder.currentAction);
      }
    });
  }

  initHeader() {
    const thisPathfinder = this;

    thisPathfinder.dom.clearButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisPathfinder.clearBoard();
    });

    thisPathfinder.dom.visualizeButton.addEventListener('click', function(event) {
      event.preventDefault();
      if (thisPathfinder.selectedAlgorithm) {
        thisPathfinder.runAlgorithm(thisPathfinder.selectedAlgorithm);
      }
    });
  }

  // --------- TRACK MOUSE HOLDING --------- //

  initMouseHoldTracking() {
    const thisPathfinder = this;

    thisPathfinder.holdingMouse = false;

    thisPathfinder.dom.board.onmousedown = function() {
      console.log('down');
      thisPathfinder.holdingMouse = true;
    };

    thisPathfinder.dom.board.onmouseup = function() {
      console.log('up');
      thisPathfinder.holdingMouse = false;
    };
  }

  // --------- TIMER --------- //
  startTimer() {
    const thisPathfinder = this;

    let count = 0;
    thisPathfinder.timerInterval = setInterval(function() {
      count += 1;
      thisPathfinder.dom.timerCounter.innerHTML = `${count} sec`;
    }, 1000);
  }

  stopTimer() {
    const thisPathfinder = this;

    const currentTime = thisPathfinder.dom.timerCounter.innerHTML;
    const currentAlgorithm = thisPathfinder.selectedAlgorithmName;

    const newTime = document.createElement('li');
    newTime.innerHTML = `${currentAlgorithm}: ${currentTime}`;

    thisPathfinder.dom.timerDropdown.appendChild(newTime);

    clearInterval(thisPathfinder.timerInterval);
  }

  resetScores() {
    const thisPathfinder = this;

    
  }

  // --------- DEFINE BOARD --------- //

  renderBoard(rows, columns) {
    const thisPathfinder = this;

    thisPathfinder.dom.board.innerHTML = '';

    thisPathfinder.walls = [];
    thisPathfinder.visited = [];
    thisPathfinder.rows = rows;
    thisPathfinder.columns = columns;

    let cellCount = 0;

    for (let i = 0; i < thisPathfinder.rows; i++) {
      const row = document.createElement('div');
      row.classList.add(classNames.board.row);

      for (let j = 0; j < thisPathfinder.columns; j++) {
        const cell = document.createElement('div');
        cellCount += 1;
        cell.classList.add(classNames.board.cell);
        cell.setAttribute('row', i+1);
        cell.setAttribute('column', j+1);
        cell.setAttribute('num', cellCount);
        // cell.innerHTML = cellCount;
        row.appendChild(cell);
      }

      thisPathfinder.dom.board.appendChild(row);
    }
    thisPathfinder.setStart();
    thisPathfinder.setFinish();
    // console.log(thisPathfinder.dom.board);
  }

  clearBoard() {
    const thisPathfinder = this;

    // remove all walls
    for (let wall of thisPathfinder.walls) {
      wall.classList.remove(classNames.board.wall);
    }
    thisPathfinder.walls = [];

    // remove all visited
    for (let visited of thisPathfinder.visited) {
      visited.classList.remove(classNames.state.visited);
    }
    thisPathfinder.visited = [];

    // reset start pos
    if (thisPathfinder.dom.startPos) {
      thisPathfinder.dom.startPos.classList.remove(classNames.board.startPos);
      thisPathfinder.dom.startPos = null;
    }
    thisPathfinder.setStart();

    // reset finish pos
    if (thisPathfinder.dom.finishPos) {
      thisPathfinder.dom.finishPos.classList.remove(classNames.board.finishPos);
      thisPathfinder.dom.finishPos = null;
    }
    thisPathfinder.setFinish();

    // reset timer
    thisPathfinder.dom.timerCounter.innerHTML = '0 sec';

  }

  // --------- DRAWING ACTIONS --------- //

  initStage(name) {
    const thisPathfinder = this;

    if (name === 'setStart') {
      thisPathfinder.setStart();
    } else if (name === 'setMidPoint') {
      thisPathfinder.setMidPoint();
    } else if (name === 'setFinish') {
      thisPathfinder.setFinish();
    } else if (name === 'drawWalls') {
      thisPathfinder.drawWalls();
    } else if (name === 'ereaseWalls') {
      thisPathfinder.ereaseWalls();
    }
  }

  setStart() {
    const thisPathfinder = this;

    const defaultRow = settings.startPos.defaultRow;
    const defaultColumn = settings.startPos.defaultColumn;
    const defaultStartCell = thisPathfinder.dom.board.querySelector(`[row="${defaultRow}"][column="${defaultColumn}"]`);

    // prevent new start node from appearing when the initial one was moved and start selection was selected again
    if (!thisPathfinder.dom.startPos) {
      defaultStartCell.classList.add(classNames.board.startPos);
      thisPathfinder.dom.startPos = defaultStartCell;
    }

    let startPosQueue = [ defaultStartCell ];

    thisPathfinder.dom.board.addEventListener('mouseover', function(event) {
      if (thisPathfinder.holdingMouse && thisPathfinder.currentAction === 'setStart') {
        const hoveredCell = event.target;

        const isCell = hoveredCell.classList.contains(classNames.board.cell);
        const isWall = hoveredCell.classList.contains(classNames.board.wall);

        if (isCell && !isWall) {
          startPosQueue.push(hoveredCell);
          startPosQueue[0].classList.remove(classNames.board.startPos);
          startPosQueue.shift();

          hoveredCell.classList.add(classNames.board.startPos);
          thisPathfinder.dom.startPos = hoveredCell;
        } else {
          thisPathfinder.holdingMouse = false;
        }
      }
    });

  }

  setFinish() {
    const thisPathfinder = this;

    const defaultRow = settings.finishPos.defaultRow;
    const defaultColumn = settings.finishPos.defaultColumn;
    const defaultFinishCell = thisPathfinder.dom.board.querySelector(`[row="${defaultRow}"][column="${defaultColumn}"]`);

    if (!thisPathfinder.dom.finishPos) {
      defaultFinishCell.classList.add(classNames.board.finishPos);
      thisPathfinder.dom.finishPos = defaultFinishCell;
    }

    let finishPosQueue = [ defaultFinishCell ];

    thisPathfinder.dom.board.addEventListener('mouseover', function(event) {
      if (thisPathfinder.holdingMouse && thisPathfinder.currentAction === 'setFinish') {
        const hoveredCell = event.target;

        const isCell = hoveredCell.classList.contains(classNames.board.cell);
        const isWall = hoveredCell.classList.contains(classNames.board.wall);

        if (isCell && !isWall) {
          finishPosQueue.push(hoveredCell);
          finishPosQueue[0].classList.remove(classNames.board.finishPos);
          finishPosQueue.shift();

          hoveredCell.classList.add(classNames.board.finishPos);
          thisPathfinder.dom.finishPos = hoveredCell;
        } else {
          thisPathfinder.holdingMouse = false;
        }
      }
    });

  }

  setMidPoint() {
    // const thisPathfinder = this;

    console.log('setMidPoint');
  }

  drawWalls() {
    const thisPathfinder = this;

    thisPathfinder.dom.board.addEventListener('mouseover', function(event) {
      if (thisPathfinder.holdingMouse && thisPathfinder.currentAction === 'drawWalls') {
        const hoveredCell = event.target;

        const isCell = hoveredCell.classList.contains(classNames.board.cell);
        const isStartPos = hoveredCell.classList.contains(classNames.board.startPos);
        const isFinishPos = hoveredCell.classList.contains(classNames.board.finishPos);

        if (isCell && !isStartPos && !isFinishPos) {
          hoveredCell.classList.add(classNames.board.wall);

          if (!thisPathfinder.walls.includes(hoveredCell)) {
            thisPathfinder.walls.push(hoveredCell);
          }
        } else {
          thisPathfinder.holdingMouse = false;
        }
      }
    });
  }

  ereaseWalls() {
    const thisPathfinder = this;

    thisPathfinder.dom.board.addEventListener('mouseover', function(event) {
      if (thisPathfinder.holdingMouse && thisPathfinder.currentAction === 'ereaseWalls') {
        const hoveredCell = event.target;
        hoveredCell.classList.remove(classNames.board.wall);

        if (thisPathfinder.walls.includes(hoveredCell)) {
          const wallIndex = thisPathfinder.walls.indexOf(hoveredCell);
          thisPathfinder.walls.splice(wallIndex, 1);
        }
      }
    });
  }

  // --------- ALGORITHMS --------- //

  runAlgorithm(name) {
    const thisPathfinder = this;

    if (name === 'depthFirst') {
      thisPathfinder.depthFirst();
    }
    else if (name === 'breadthFirst') {
      thisPathfinder.breadthFirst();
    }
    else if (name === 'aStar') {
      thisPathfinder.aStar();
    }
  }

  clearBoardForNewAlgorithm() {
    const thisPathfinder = this;

    // remove all visited
    for (let visited of thisPathfinder.visited) {
      visited.classList.remove(classNames.state.visited);
    }
    thisPathfinder.visited = [];

    // reset timer
    thisPathfinder.dom.timerCounter.innerHTML = '0 sec';
  }

  convertBoardToObject() {
    const thisPathfinder = this;

    const boardObj = {};

    const allCells = thisPathfinder.dom.board.querySelectorAll(select.board.cell);

    for (let cell of allCells) {
      const cellNum = parseInt(cell.getAttribute('num'));
      const cellRow = parseInt(cell.getAttribute('row'));
      const cellCol = parseInt(cell.getAttribute('column'));
      let cellNeighbours = [];

      let left = cellNum - 1;
      let right = cellNum + 1;
      let above = cellNum - thisPathfinder.columns;
      let below = cellNum + thisPathfinder.columns;


      if (cellRow === 1 && cellCol === 1) { // top left corner
        cellNeighbours = [right, below];
      }
      else if (cellRow === 1 && cellCol === thisPathfinder.columns) { // top right corner
        cellNeighbours = [left, below];
      }
      else if (cellRow === thisPathfinder.rows && cellCol === 1) { // bottom left corner
        cellNeighbours = [right, above];
      }
      else if (cellRow === thisPathfinder.rows && cellCol === thisPathfinder.columns) { // bottom right corner
        cellNeighbours = [left, above];
      }
      else if (cellRow === 1) { // top row
        cellNeighbours = [below, left, right];
      }
      else if (cellRow === thisPathfinder.rows) { // bottom row
        cellNeighbours = [above, left, right];
      }
      else if (cellCol === 1) { // left column
        cellNeighbours = [right, below, above];
      }
      else if (cellCol === thisPathfinder.columns) { // right column
        cellNeighbours = [left, below, above];
      }
      else { // the rest (middle)
        cellNeighbours = [left, right, below, above];
      }

      const cellsToIgnore = [];

      for (let neighbour of cellNeighbours) {
        const neighbourCell = thisPathfinder.dom.board.querySelector(`[num="${neighbour}"]`);

        if (neighbourCell.classList.contains(classNames.board.wall)) {
          cellsToIgnore.push(neighbour);
        }
      }

      cellNeighbours = cellNeighbours.filter(cell => !cellsToIgnore.includes(cell));

      boardObj[cellNum] = cellNeighbours;
    }

    return boardObj;
  }

  depthFirst() {
    const thisPathfinder = this;

    thisPathfinder.visited = [];

    const startPosCell = parseInt(thisPathfinder.dom.startPos.getAttribute('num'));
    const finishPosCell = parseInt(thisPathfinder.dom.finishPos.getAttribute('num'));
    const board = thisPathfinder.convertBoardToObject();

    const stack = [ startPosCell ];
    const alreadyVisitedCells = [];

    console.log(board);
    thisPathfinder.startTimer();

    const interval = setInterval(function() {

      const currentCell = stack.pop();
      // console.log('current', currentCell);
      alreadyVisitedCells.push(currentCell);
      // console.log('already visited', alreadyVisitedCells);

      if (currentCell === finishPosCell) {
        clearInterval(interval);
        thisPathfinder.stopTimer();
        console.log('match');
      }

      const currentCellDOM = thisPathfinder.dom.board.querySelector(`[num="${currentCell}"]`);
      const isStartPos = currentCellDOM.classList.contains(classNames.board.startPos);
      const isFinishPos = currentCellDOM.classList.contains(classNames.board.finishPos);

      if (!isStartPos && !isFinishPos) {
        currentCellDOM.classList.add(classNames.state.visited);
        thisPathfinder.visited.push(currentCellDOM);
      }

      for (let neighbour of board[currentCell]) {
        // if (!alreadyVisitedCells.includes(neighbour) && !stack.includes(neighbour)) {
        if (!alreadyVisitedCells.includes(neighbour)) { // do we add the same neighbor to the stack multiple times or not?
          stack.push(neighbour);
        }
      }
      // console.log('stack', stack);

    }, 20);

  }

  breadthFirst() {
    const thisPathfinder = this;

    const startPosCell = parseInt(thisPathfinder.dom.startPos.getAttribute('num'));
    const finishPosCell = parseInt(thisPathfinder.dom.finishPos.getAttribute('num'));
    const board = thisPathfinder.convertBoardToObject();

    const queue = [ startPosCell ];
    const alreadyVisitedCells = [];

    thisPathfinder.startTimer();

    const interval = setInterval(function() {

      const currentCell = queue.shift();
      alreadyVisitedCells.push(currentCell);

      if (currentCell === finishPosCell) {
        clearInterval(interval);
        thisPathfinder.stopTimer();
        console.log('match');
      }

      const currentCellDOM = thisPathfinder.dom.board.querySelector(`[num="${currentCell}"]`);
      const isStartPos = currentCellDOM.classList.contains(classNames.board.startPos);
      const isFinishPos = currentCellDOM.classList.contains(classNames.board.finishPos);

      if (!isStartPos && !isFinishPos) {
        currentCellDOM.classList.add(classNames.state.visited);
        thisPathfinder.visited.push(currentCellDOM);
      }

      for (let neighbour of board[currentCell]) {
        if (!alreadyVisitedCells.includes(neighbour) && !queue.includes(neighbour)) {
        // if (!alreadyVisitedCells.includes(neighbour)) { // do we add the same neighbor to the stack multiple times or not?
          queue.push(neighbour);
        }
      }
    }, 20);
  }

  aStar() {
    const thisPathfinder = this;

    // --------- ALGORITHM PREP --------- //

    const startPosCell = parseInt(thisPathfinder.dom.startPos.getAttribute('num'));
    const finishPosCell = parseInt(thisPathfinder.dom.finishPos.getAttribute('num'));
    const board = thisPathfinder.convertBoardToObject(); // object of neighbours later changed to object of cell objects - below for loop

    for (let cell in board) {
      const cellDOM = thisPathfinder.dom.board.querySelector(`[num="${cell}"]`);

      const cellData = {
        cell: cell,
        row: parseInt(cellDOM.getAttribute('row')),
        col: parseInt(cellDOM.getAttribute('column')),
        f: 0, // g + h
        g: 0, // actual dist from start
        h: 0, // estimated dist to finish
        neighbours: board[cell],
        parent: undefined,
      };

      board[cell] = cellData; // overwriting the existing board of neighbours with board of cells with data
    }

    const openSet = [ board[startPosCell] ]; // yet to check (only neighbours can be added)
    const closedSet = []; // already checked
    let path = [];
    thisPathfinder.startTimer();

    // --------- ALGORITHM START --------- //

    // while (openSet.length > 0) {
    const interval = setInterval(function() {

      // Stage 1 START: get the value with the lowest fScore from openSet array and assign to current

      let lowestFScoreIndex = 0; // set to 0 each time to make sure that all elements are checked in the if statement

      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowestFScoreIndex].f) {
          lowestFScoreIndex = i;
        }
      }

      let current = openSet[lowestFScoreIndex];

      if (current.cell != startPosCell && current.cell != finishPosCell) {
        const currentDOM = thisPathfinder.dom.board.querySelector(`[num="${current.cell}"]`);
        currentDOM.classList.add(classNames.state.visited);
        thisPathfinder.visited.push(currentDOM);
      }

      // Stage 1 END

      // Stage 2 START: check if done and get path by going back through all parent nodes

      if (current === board[finishPosCell]) {
        let pathElement = current;
        path.push(pathElement.cell); // push final cell: finish pos
        while (pathElement.parent) {
          path.push(pathElement.parent.cell); // push given cell's parent cell
          pathElement = pathElement.parent; // change current pathElement to recently checked parent to get its parent again
        }
        path = path.reverse();
        console.log('path', path);
        clearInterval(interval);
        thisPathfinder.stopTimer();
        return;
      }

      // Stage 2 END

      // Stage 3 START: update openSet and closedSet

      openSet.splice(lowestFScoreIndex, 1); // remove current from openSet because current = openSet[lowestFScoreIndex]
      closedSet.push(current); // and add it to closedSet

      // Stage 3 END

      // Stage 4 START: process neighbours

      const neighbours = current.neighbours;

      for (let neighbour of neighbours) {
        const neighbourData = board[neighbour];

        // if not already checked
        if (!closedSet.includes(neighbourData)) {
          const possibleNeighbourG = current.g + 1; // neighbour is always one step from current

          // if not already in 'to-check' (neighbours are the same for multiple cells so there's no point of adding one a few times)
          if (!openSet.includes(neighbourData)) {
            openSet.push(neighbourData);
          }
          // if already in 'to-check' and ..., ignore neighbour
          else if (possibleNeighbourG >= neighbourData.g) {
            continue;
          }

          neighbourData.g = possibleNeighbourG;
          neighbourData.h = thisPathfinder.heuristic(neighbour, finishPosCell);
          neighbourData.f = neighbourData.g + neighbourData.h;
          neighbourData.parent = current;
        }
      }
      // Stage 4 END

    }, 20);

  }

  heuristic(cellOne, cellTwo) {
    const thisPathfinder = this;

    const cellOneDOM = thisPathfinder.dom.board.querySelector(`[num="${cellOne}"]`);
    const cellTwoDOM = thisPathfinder.dom.board.querySelector(`[num="${cellTwo}"]`);

    const cellOneRow = parseInt(cellOneDOM.getAttribute('row'));
    const cellOneCol = parseInt(cellOneDOM.getAttribute('column'));
    const cellTwoRow = parseInt(cellTwoDOM.getAttribute('row'));
    const cellTwoCol = parseInt(cellTwoDOM.getAttribute('column'));

    const distRows = Math.abs(cellOneRow - cellTwoRow);
    const distCols = Math.abs(cellOneCol - cellTwoCol);

    return distRows + distCols;
  }

}

export default Pathfinder;
