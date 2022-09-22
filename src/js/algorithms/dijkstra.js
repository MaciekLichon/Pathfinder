import { classNames } from '../settings.js';
import { utils } from '../utils.js';

export const dijkstra = function({ startPosCell, finishPosCell, board, timerWidget, selectedAlgorithmName }) {

  for (let cell in board) {

    const cellData = {
      cell: cell,
      dom: document.querySelector(`[num="${cell}"]`),
      neighbours: board[cell],
      fromStart: Number.MAX_VALUE,
      parent: undefined,
    };

    board[cell] = cellData; // overwriting the existing board of neighbours with board of cells with data
  }

  const visited = [];
  const unvisited = [ startPosCell ];
  let path = [];

  let current = startPosCell;
  board[current].fromStart = 0;

  timerWidget.startTimer();

  const interval = setInterval(function() {

    console.log('current', current);

    // animate by adding class
    if (current != startPosCell && current != finishPosCell) {
      const currentDOM = document.querySelector(`[num="${current}"]`);
      currentDOM.classList.add(classNames.state.visited);
    }

    // filter unvisited neighbours from all new neighbours of a given cell (current)
    let currentNeighbours = board[current].neighbours;
    let unvisitedNeighbours = currentNeighbours.filter(x => !visited.includes(x));
    console.log('unvisited current neighbours', unvisitedNeighbours);

    // calculate new distance for each unvisited neighbour and add them to the global unvisited list
    for (let neighbour of unvisitedNeighbours) {
      const neighbourData = board[neighbour];
      const newDistance = board[current].fromStart + 1;

      if (newDistance < neighbourData.fromStart) {
        neighbourData.fromStart = newDistance;
        neighbourData.parent = current;
      }

      if (!unvisited.includes(neighbour)) {
        unvisited.push(neighbour);
      }
    }

    // remove current from all unvisited
    const visitedToRemove = unvisited.indexOf(current);
    unvisited.splice(visitedToRemove, 1);
    console.log('all unvisited cells', unvisited);

    // select unvisited cell with the lowest distance from start
    // becuase it's not a weighted grid and new neighbours are pushed to the end of unvisted list, it's never going to change from index 0
    let lowestDistanceIndex = 0;

    for (let i = 0; i < unvisited.length; i++) {
      let neighbourData = board[unvisited[i]];
      console.log('neighbourData', neighbourData);
      let lowestDistanceNeighbour = board[unvisited[lowestDistanceIndex]];
      console.log('lowestDistanceNeighbour', lowestDistanceNeighbour);

      if (neighbourData.fromStart < lowestDistanceNeighbour.fromStart) {
        lowestDistanceIndex = i;
      } else {
        console.log('no change');
      }
    }

    // update the visited list and change current to the neighbor closest to start
    visited.push(current);
    console.log('visited', visited);
    console.log('---------');
    current = unvisited[lowestDistanceIndex];

    // check if done and generate path
    if (current === finishPosCell) {
      let pathElement = board[current];
      while (pathElement.parent) {
        path.push(pathElement.cell); // push given cell's parent cell
        pathElement = board[pathElement.parent]; // change current pathElement to recently checked parent to get its parent again
      }
      path = path.reverse();
      console.log('path', path);
      clearInterval(interval);
      timerWidget.stopTimer(selectedAlgorithmName);
      utils.drawPath(path);
      return;
    }


  }, 20);

};
