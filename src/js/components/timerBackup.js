// --------- TIMER --------- //
// startTimer() {
//   const thisPathfinder = this;
//
//   let count = 0;
//   thisPathfinder.timerInterval = setInterval(function() {
//     count += 1;
//     thisPathfinder.dom.timerCounter.innerHTML = `${count} sec`;
//   }, 1000);
// }
//
// stopTimer() {
//   const thisPathfinder = this;
//
//   const currentTime = thisPathfinder.dom.timerCounter.innerHTML;
//   const currentAlgorithm = thisPathfinder.selectedAlgorithmName;
//
//   const newTime = document.createElement('li');
//   newTime.classList.add(classNames.timer.score);
//   newTime.innerHTML = `${currentAlgorithm}: ${currentTime}`;
//
//   thisPathfinder.dom.timerDropdown.appendChild(newTime);
//
//   clearInterval(thisPathfinder.timerInterval);
// }
//
// resetScores() {
//   const thisPathfinder = this;
//
//   const scores = thisPathfinder.dom.timerDropdown.querySelectorAll(select.timer.score);
//   for (let score of scores) {
//     score.remove();
//   }
// }
