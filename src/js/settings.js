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
  },
  timer: {
    counter: '.counter',
    dropdown: '.dropdown-content',
  },
  header: {
    clearBoard: '[action=clear]',
    visualize: '[action=visualize]',
  },
  board: {
    cell: '.cell',
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
  board: {
    row: 'row',
    cell: 'cell',
    wall: 'wall',
    startPos: 'start-pos',
    finishPos: 'finish-pos',
  },
  actions: {
    setting: 'setting',
  },
  state: {
    active: 'active',
    sizeSelected: 'sizeSelected',
    themeSelected: 'themeSelected',
    algorithmSelected: 'algorithmSelected',
    visited: 'visited',
  }
};
