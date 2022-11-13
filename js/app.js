import Pathfinder from './components/Pathfinder.js';

const app = {
  initPathfinder: function() {
    const thisApp = this;

    thisApp.pathfinder = new Pathfinder();
  },

  init: function() {
    const thisApp = this;

    thisApp.initPathfinder();
  }
};

app.init();
