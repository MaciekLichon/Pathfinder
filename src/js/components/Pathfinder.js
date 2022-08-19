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

    thisPathfinder.dom.clearButton = thisPathfinder.dom.header.querySelector(select.header.clearBoard);

    thisPathfinder.dom.boardSizeSetters = thisPathfinder.dom.actionsBar.querySelectorAll(select.action.boardSize);
    thisPathfinder.dom.themeSetters = thisPathfinder.dom.actionsBar.querySelectorAll(select.action.theme);
    thisPathfinder.dom.drawingActions = thisPathfinder.dom.actionsBar.querySelector(select.containerOf.drawingActions);

    thisPathfinder.dom.startPos = thisPathfinder.dom.board.querySelector(select.node.start);
    thisPathfinder.dom.finishPos = thisPathfinder.dom.board.querySelector(select.node.finish);

  }

  initDropdownMenus() {
    const thisPathfinder = this;

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
  }

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

  renderBoard(rows, columns) {
    const thisPathfinder = this;

    thisPathfinder.dom.board.innerHTML = '';

    thisPathfinder.walls = [];
    thisPathfinder.rows = rows;
    thisPathfinder.columns = columns;

    for (let i = 0; i < thisPathfinder.rows; i++) {
      const row = document.createElement('div');
      row.classList.add(classNames.board.row);

      for (let j = 0; j < thisPathfinder.columns; j++) {
        const cell = document.createElement('div');
        cell.classList.add(classNames.board.cell);
        cell.setAttribute('row', i+1);
        cell.setAttribute('column', j+1);
        row.appendChild(cell);
      }

      thisPathfinder.dom.board.appendChild(row);
    }
    thisPathfinder.setStart();
    thisPathfinder.setFinish();
    console.log(thisPathfinder.dom.board);
  }

  clearBoard() {
    const thisPathfinder = this;

    // remove all walls
    for (let wall of thisPathfinder.walls) {
      wall.classList.remove(classNames.board.wall);
    }
    thisPathfinder.walls = [];

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

        if (hoveredCell.classList.contains(classNames.board.cell)) {
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

        if (hoveredCell.classList.contains(classNames.board.cell)) {
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

        if (hoveredCell.classList.contains(classNames.board.cell)) {
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

}

export default Pathfinder;
