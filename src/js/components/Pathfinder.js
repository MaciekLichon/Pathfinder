import { settings, select, classNames } from '../settings.js';
import { utils } from '../utils.js';

class Pathfinder {
  constructor() {
    const thisPathfinder = this;

    thisPathfinder.getElements();
    thisPathfinder.initDropdownMenus();
    thisPathfinder.initActionButtons();
    thisPathfinder.renderBoard(settings.board.defaultRows, settings.board.defaultColumns);
  }

  getElements() {
    const thisPathfinder = this;

    thisPathfinder.dom = {};

    thisPathfinder.dom.visualizer = document.querySelector(select.containerOf.visualizer);

    thisPathfinder.dom.board = thisPathfinder.dom.visualizer.querySelector(select.containerOf.board);
    thisPathfinder.dom.actionsBar = thisPathfinder.dom.visualizer.querySelector(select.containerOf.allActions);

    thisPathfinder.dom.boardSizeSetters = thisPathfinder.dom.actionsBar.querySelectorAll(select.action.boardSize);
    thisPathfinder.dom.drawingActions = thisPathfinder.dom.actionsBar.querySelector(select.containerOf.drawingActions);
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
          thisPathfinder.currentAction = '';
        }
      }
    });
  }

  // initStages(name) {
  //   const thisPathfinder = this;
  //
  //   if (name === 'drawWalls') {
  //     thisPathfinder.drawWalls();
  //   }
  // }
  //
  // drawWalls() {
  //   const thisPathfinder = this;
  //
  //   console.log('dupa');
  // }

  renderBoard(rows, columns) {
    const thisPathfinder = this;

    thisPathfinder.dom.board.innerHTML = '';

    thisPathfinder.rows = rows;
    thisPathfinder.columns = columns;

    for (let i = 0; i < thisPathfinder.rows; i++) {
      const row = document.createElement('div');
      row.classList.add(classNames.board.row);

      for (let i = 0; i < thisPathfinder.columns; i++) {
        const cell = document.createElement('div');
        cell.classList.add(classNames.board.cell);
        row.appendChild(cell);
      }

      thisPathfinder.dom.board.appendChild(row);
    }
    console.log(thisPathfinder.dom.board);

    thisPathfinder.dom.board.addEventListener('click', function(event) {
      event.preventDefault();
      const clickedCell = event.target;

      if (thisPathfinder.currentAction === 'drawWalls') {
        clickedCell.classList.add(classNames.board.wall);
        console.log(clickedCell);
      }
    });
  }
}

export default Pathfinder;
