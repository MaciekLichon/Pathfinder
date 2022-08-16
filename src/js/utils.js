import { classNames } from './settings.js';


export const utils = {}; // eslint-disable-line no-unused-vars

utils.checkActiveButtons = function(arr, btn) {
  for (let item of arr) {
    if (item.classList.contains(classNames.state.active) && item != btn) {
      item.classList.remove(classNames.state.active);
    }
  }
};
