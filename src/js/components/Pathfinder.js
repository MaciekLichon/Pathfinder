import { settings, select, classNames } from '../settings.js';

class Pathfinder {
  constructor() {
    const thisPathfinder = this;

    thisPathfinder.getElements();
    thisPathfinder.initDropdownMenus();
    thisPathfinder.renderBoard(settings.board.defaultRows, settings.board.defaultColumns);
  }

  getElements() {
    const thisPathfinder = this;

    thisPathfinder.dom = {};

    thisPathfinder.dom.visualizer = document.querySelector(select.containerOf.visualizer);

    thisPathfinder.dom.board = thisPathfinder.dom.visualizer.querySelector(select.containerOf.board);
    thisPathfinder.dom.optionsBar = thisPathfinder.dom.visualizer.querySelector(select.containerOf.settings);

    thisPathfinder.dom.boardSizeSetters = thisPathfinder.dom.optionsBar.querySelectorAll(select.setters.boardSize);

  }

  initDropdownMenus() {
    const thisPathfinder = this;

    for (let sizeSetter of thisPathfinder.dom.boardSizeSetters) {
      sizeSetter.addEventListener('click', function(event) {
        event.preventDefault();
        const clickedElement = event.target;

        const rows = clickedElement.getAttribute('data-rows');
        const columns = clickedElement.getAttribute('data-columns');

        thisPathfinder.renderBoard(rows, columns);
      });
    }

  }

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
  }
}

export default Pathfinder;
