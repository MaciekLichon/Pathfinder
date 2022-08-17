import { settings, select, classNames } from '../settings.js';
import { utils } from '../utils.js';

class Pathfinder {
  constructor() {
    const thisPathfinder = this;

    thisPathfinder.getElements();
    thisPathfinder.initDropdownMenus();
    thisPathfinder.initActionButtons();
    thisPathfinder.renderBoard(settings.board.defaultRows, settings.board.defaultColumns);
    thisPathfinder.initMouseHoldTracking();
  }

  getElements() {
    const thisPathfinder = this;

    thisPathfinder.dom = {};

    thisPathfinder.dom.visualizer = document.querySelector(select.containerOf.visualizer);

    thisPathfinder.dom.board = thisPathfinder.dom.visualizer.querySelector(select.containerOf.board);
    thisPathfinder.dom.actionsBar = thisPathfinder.dom.visualizer.querySelector(select.containerOf.allActions);

    thisPathfinder.dom.boardSizeSetters = thisPathfinder.dom.actionsBar.querySelectorAll(select.action.boardSize);
    thisPathfinder.dom.drawingActions = thisPathfinder.dom.actionsBar.querySelector(select.containerOf.drawingActions);

    thisPathfinder.dom.startPos = thisPathfinder.dom.board.querySelector(select.node.start);
    thisPathfinder.dom.finishPos = thisPathfinder.dom.board.querySelector(select.node.finish);

    // thisPathfinder.dom.startPos = thisPathfinder.dom.actionsBar.querySelector(select.action.startPos);
    // thisPathfinder.dom.midPos = thisPathfinder.dom.actionsBar.querySelector(select.action.midPos);
    // thisPathfinder.dom.endPos = thisPathfinder.dom.actionsBar.querySelector(select.action.endPos);
    // thisPathfinder.dom.wallPainter = thisPathfinder.dom.actionsBar.querySelector(select.action.walls);
    // thisPathfinder.dom.wallEreaser = thisPathfinder.dom.actionsBar.querySelector(select.action.ereaser);
    // console.log(thisPathfinder.dom.drawingActions);

  }

  initDropdownMenus() {
    const thisPathfinder = this;

    for (let sizeSetter of thisPathfinder.dom.boardSizeSetters) {
      sizeSetter.addEventListener('click', function(event) {
        event.preventDefault();
        const clickedElement = event.target;

        const rows = parseInt(clickedElement.getAttribute('data-rows'));
        const columns = parseInt(clickedElement.getAttribute('data-columns'));

        thisPathfinder.renderBoard(rows, columns);
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

  setStart() {
    const thisPathfinder = this;

    const defaultRow = settings.startPos.defaultRow;
    const defaultColumn = settings.startPos.defaultColumn;
    const defaultStartCell = thisPathfinder.dom.board.querySelector(`[row="${defaultRow}"][column="${defaultColumn}"]`);

    if (!thisPathfinder.dom.startPos) {
      defaultStartCell.classList.add(classNames.board.startPos);
    }

    let startPosQueue = [ defaultStartCell ];

    thisPathfinder.dom.board.addEventListener('mouseover', function(event) {
      if (thisPathfinder.holdingMouse && thisPathfinder.currentAction === 'setStart') {
        const hoveredCell = event.target;

        startPosQueue.push(hoveredCell);
        startPosQueue[0].classList.remove(classNames.board.startPos);
        startPosQueue.shift();

        hoveredCell.classList.add(classNames.board.startPos);
        thisPathfinder.dom.startPos = hoveredCell;

        console.log(thisPathfinder.dom.startPos);
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
    }

    let finishPosQueue = [ defaultFinishCell ];

    thisPathfinder.dom.board.addEventListener('mouseover', function(event) {
      if (thisPathfinder.holdingMouse && thisPathfinder.currentAction === 'setFinish') {
        const hoveredCell = event.target;

        finishPosQueue.push(hoveredCell);
        finishPosQueue[0].classList.remove(classNames.board.finishPos);
        finishPosQueue.shift();

        hoveredCell.classList.add(classNames.board.finishPos);
        thisPathfinder.dom.finishPos = hoveredCell;

        console.log(thisPathfinder.dom.finishPos);
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
        hoveredCell.classList.add(classNames.board.wall);
      }
    });
  }

  ereaseWalls() {
    const thisPathfinder = this;

    thisPathfinder.dom.board.addEventListener('mouseover', function(event) {
      if (thisPathfinder.holdingMouse && thisPathfinder.currentAction === 'ereaseWalls') {
        const hoveredCell = event.target;
        hoveredCell.classList.remove(classNames.board.wall);
      }
    });
  }

}

export default Pathfinder;
