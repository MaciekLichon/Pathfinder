import { classNames } from './settings.js';


export const utils = {}; // eslint-disable-line no-unused-vars

// removes active class from all action buttons unless the clicked one (btn) is currently active
// there's a toggle func added in Pathfinder after calling this one
utils.checkActiveButtons = function(arr, btn) {
  for (let item of arr) {
    if (item.classList.contains(classNames.state.active) && item != btn) {
      item.classList.remove(classNames.state.active);
    }
  }
};



utils.drawPath = function(path) {

  setTimeout(function() {
    let index = 0;

    const interval = setInterval(function() {

      if (path[index]) {
        const cell = document.querySelector(`[num="${path[index]}"]`);
        cell.classList.add(classNames.board.path);
        index += 1;
      }
      else {
        clearInterval(interval);
        console.log('done');
        return;
      }

    }, 20);
  }, 700);

};
