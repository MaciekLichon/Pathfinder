export const templates = {
  modalMessage: Handlebars.compile(document.querySelector('#template-modal-message').innerHTML),
};

export const settings = {
  board: {
    defaultRows: 20,
    defaultColumns: 35,
  },
  startPos: {
    defaultRow: 1,
    defaultColumn: 1,
  },
  finishPos: {
    defaultRow: 1,
    defaultColumn: 2,
  }
};

export const select = {
  containerOf: {
    visualizer: '.visualizer',
    board: '.board',
    allActions: '.settings-container',
    drawingActions: '.board-settings',
    header: '.header',
    timer: '.timer',
    infoModal: '.infoModal',
    guideModal: '.guide',
  },
  timer: {
    counter: '.counter',
    dropdown: '.dropdown-content',
    resetButton: '.reset-scores',
    score: '.score'
  },
  infoModal: {
    closeButton: '.close-button',
    message: '.infoModal .info',
  },
  guideModal: {
    closeButton: '.carousel-exit',
  },
  header: {
    clearBoard: '[action=clear]',
    visualize: '[action=visualize]',
    maze: '[action=maze]',
  },
  board: {
    cell: '.cell',
    visited: '.visited',
    row: '.row',
    wall: '.wall',
    path: '.path',
  },
  action: {
    algorithm: '.algorithm-selector',
    boardSize: '.board-size-selector',
    theme: '.theme-selector',
    walls: '.setting.walls',
    startPos: '.setting.start',
    midPos: '.setting.mid-destination',
    endPos: '.setting.finish',
    ereaser: '.setting.ereaser',
    active: '.setting.active',
  },
  node: {
    start: '.start-pos',
    finish: '.finish-pos',
  },
  setter: {
    sizeSelected: '.sizeSelected',
    themeSelected: '.themeSelected',
    algorithmSelected: '.algorithmSelected'
  }
};

export const classNames = {
  general: {
    clickDisabled: 'noClickAvailable',
  },
  board: {
    row: 'row',
    cell: 'cell',
    wall: 'wall',
    startPos: 'start-pos',
    finishPos: 'finish-pos',
    path: 'path',
    noPath: 'noPath',
  },
  actions: {
    setting: 'setting',
    help: 'help',
  },
  modal: {
    displayed: 'displayed',
  },
  state: {
    active: 'active',
    sizeSelected: 'sizeSelected',
    themeSelected: 'themeSelected',
    algorithmSelected: 'algorithmSelected',
    visited: 'visited',
    leader: 'leader',
  },
  timer: {
    score: 'score',
  }
};
