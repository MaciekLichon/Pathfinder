export const settings = {
  board: {
    defaultRows: 20,
    defaultColumns: 35,
  },
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
  },
  actions: {
    setting: 'setting',
  },
  state: {
    active: 'active',
  }
};
