export const settings = {
  board: {
    defaultRows: 20,
    defaultColumns: 35,
  },
  startPos: {
    defaultRow: 10,
    defaultColumn: 10,
  },
  finishPos: {
    defaultRow: 10,
    defaultColumn: 25,
  }
};

export const select = {
  containerOf: {
    visualizer: '.visualizer',
    board: '.board',
    allActions: '.settings-container',
    drawingActions: '.board-settings',
  },
  action: {
    boardSize: '.board-size-selector',
    walls: '.setting.walls',
    startPos: '.setting.start',
    midPos: '.setting.mid-destination',
    endPos: '.setting.finish',
    ereaser: '.setting.ereaser',
  }
};

export const classNames = {
  board: {
    row: 'row',
    cell: 'cell',
    wall: 'wall',
    startPos: 'startPos',
    finishPos: 'finishPos',
  },
  actions: {
    setting: 'setting',
  },
  state: {
    active: 'active',
  }
};
