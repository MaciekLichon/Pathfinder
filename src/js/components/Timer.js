import { select, classNames } from '../settings.js';

class Timer {
  constructor() {
    const thisTimer = this;

    thisTimer.getElements();
  }

  getElements() {
    const thisTimer = this;

    thisTimer.dom = {};

    thisTimer.dom.timer = document.querySelector(select.containerOf.timer);

    thisTimer.dom.timerCounter = thisTimer.dom.timer.querySelector(select.timer.counter);
    thisTimer.dom.timerDropdown = thisTimer.dom.timer.querySelector(select.timer.dropdown);
    thisTimer.dom.timerResetButton = thisTimer.dom.timer.querySelector(select.timer.resetButton);
  }

  startTimer() {
    const thisTimer = this;

    thisTimer.count = 0;
    thisTimer.timerInterval = setInterval(function() {
      thisTimer.count += 1;
      thisTimer.dom.timerCounter.innerHTML = `${thisTimer.count} sec`;
    }, 1000);
  }

  stopTimer(currentAlgorithm, pathFound) {
    const thisTimer = this;

    if (pathFound) {
      const currentTime = thisTimer.dom.timerCounter.innerHTML;

      const newTime = document.createElement('li');
      newTime.classList.add(classNames.timer.score);
      newTime.innerHTML = `${currentAlgorithm}: ${currentTime}`;

      thisTimer.dom.timerDropdown.appendChild(newTime);
    }

    clearInterval(thisTimer.timerInterval);
  }

  resetScores() {
    const thisTimer = this;

    const scores = thisTimer.dom.timerDropdown.querySelectorAll(select.timer.score);
    for (let score of scores) {
      score.remove();
    }
  }
}

export default Timer;
