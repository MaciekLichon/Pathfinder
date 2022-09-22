import { settings, select, classNames } from '../settings.js';
import { utils } from '../utils.js';

import Timer from './Timer.js';
import Modal from './Modal.js';

import { depthFirst } from '../algorithms/depthFirst.js';
import { breadthFirst } from '../algorithms/breadthFirst.js';
import { aStar } from '../algorithms/aStar.js';
import { randomWalk } from '../algorithms/randomWalk.js';
import { dijkstra } from '../algorithms/dijkstra.js';
import { drawMaze } from '../algorithms/maze.js';


class Pathfinder {
  constructor() {
    const thisPathfinder = this;


    thisPathfinder.getElements();
    thisPathfinder.renderBoard(settings.board.defaultRows, settings.board.defaultColumns);
    thisPathfinder.initDropdownMenus();
    thisPathfinder.initActionButtons();
    thisPathfinder.initHeader();
    thisPathfinder.initMouseHoldTracking();

    thisPathfinder.timerWidget = new Timer;
    thisPathfinder.modal = new Modal;
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
    thisPathfinder.dom.addMazeButton = thisPathfinder.dom.header.querySelector(select.header.maze);

    thisPathfinder.dom.boardSizeSetters = thisPathfinder.dom.actionsBar.querySelectorAll(select.action.boardSize);
    thisPathfinder.dom.themeSetters = thisPathfinder.dom.actionsBar.querySelectorAll(select.action.theme);
    thisPathfinder.dom.drawingActions = thisPathfinder.dom.actionsBar.querySelector(select.containerOf.drawingActions);

    thisPathfinder.dom.startPos = thisPathfinder.dom.board.querySelector(select.node.start);
    thisPathfinder.dom.finishPos = thisPathfinder.dom.board.querySelector(select.node.finish);

    thisPathfinder.dom.timerCounter = thisPathfinder.dom.timer.querySelector(select.timer.counter);
    thisPathfinder.dom.timerDropdown = thisPathfinder.dom.timer.querySelector(select.timer.dropdown);
    thisPathfinder.dom.timerResetButton = thisPathfinder.dom.timer.querySelector(select.timer.resetButton);
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

    // TIMER
    thisPathfinder.dom.timerResetButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisPathfinder.timerWidget.resetScores();
    });
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
        thisPathfinder.runPathAlgorithm(thisPathfinder.selectedAlgorithm);
      } else {
        thisPathfinder.modal.showModal();
      }
    });

    thisPathfinder.dom.addMazeButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisPathfinder.clearBoard();
      drawMaze(thisPathfinder.rows, thisPathfinder.columns);
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

  // --------- DEFINE BOARD --------- //

  renderBoard(rows, columns) {
    const thisPathfinder = this;

    thisPathfinder.dom.board.innerHTML = '';

    thisPathfinder.walls = [];
    thisPathfinder.rowCellObj = {};
    thisPathfinder.visited = [];
    thisPathfinder.rows = rows;
    thisPathfinder.columns = columns;


    let cellCount = 0;

    for (let i = 0; i < thisPathfinder.rows; i++) {
      const row = document.createElement('div');
      row.classList.add(classNames.board.row);

      let rowCells = [];
      for (let j = 0; j < thisPathfinder.columns; j++) {
        const cell = document.createElement('div');
        cellCount += 1;
        cell.classList.add(classNames.board.cell);
        cell.setAttribute('row', i+1);
        cell.setAttribute('column', j+1);
        cell.setAttribute('num', cellCount);
        // cell.innerHTML = cellCount;
        row.appendChild(cell);
        rowCells.push(cellCount);
      }
      // console.log(rowCells);
      thisPathfinder.rowCellObj[i+1] = rowCells;
      thisPathfinder.dom.board.appendChild(row);
    }
    // console.log(thisPathfinder.rowCellObj);
    thisPathfinder.setStart();
    thisPathfinder.setFinish();
    // console.log(thisPathfinder.dom.board);
  }

  clearBoard() {
    const thisPathfinder = this;

    // remove all drawn walls
    for (let wall of thisPathfinder.walls) {
      wall.classList.remove(classNames.board.wall);
    }
    thisPathfinder.walls = [];

    // remove walls created by maze
    const mazeWalls = thisPathfinder.dom.board.querySelectorAll(select.board.wall);
    for (let wall of mazeWalls) {
      wall.classList.remove(classNames.board.wall);
    }

    // remove all visited
    const visited = thisPathfinder.dom.board.querySelectorAll(select.board.visited);
    for (let cell of visited) {
      cell.classList.remove(classNames.state.visited);
    }

    // remove path
    const path = thisPathfinder.dom.board.querySelectorAll(select.board.path);
    for (let cell of path) {
      cell.classList.remove(classNames.board.path);
    }

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
    thisPathfinder.timerWidget.resetScores();

  }

  clearBoardForNewAlgorithm() {
    const thisPathfinder = this;

    // remove all visited
    const visited = thisPathfinder.dom.board.querySelectorAll(select.board.visited);
    for (let cell of visited) {
      cell.classList.remove(classNames.state.visited);
    }

    // remove path
    const path = thisPathfinder.dom.board.querySelectorAll(select.board.path);
    for (let cell of path) {
      cell.classList.remove(classNames.board.path);
    }

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

  runPathAlgorithm(name) {
    const thisPathfinder = this;

    const params = {
      startPosCell: parseInt(thisPathfinder.dom.startPos.getAttribute('num')),
      finishPosCell: parseInt(thisPathfinder.dom.finishPos.getAttribute('num')),
      board: thisPathfinder.convertBoardToObject(),
      timerWidget: thisPathfinder.timerWidget,
      selectedAlgorithmName: thisPathfinder.selectedAlgorithmName,
    };

    if (name === 'depthFirst') {
      depthFirst(params);
    }
    else if (name === 'breadthFirst') {
      breadthFirst(params);
    }
    else if (name === 'aStar') {
      aStar(params);
    }
    else if (name === 'randomWalk') {
      randomWalk(params);
    }
    else if (name === 'dijkstra') {
      dijkstra(params);
    }


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

}

export default Pathfinder;
