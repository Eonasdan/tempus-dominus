// this obviously requires the Bootstrap Icons v1 libraries to be loaded

const biOneIcons = {
  type: 'icons',
  time: 'bi bi-clock',
  date: 'bi bi-calendar-week',
  up: 'bi bi-arrow-up',
  down: 'bi bi-arrow-down',
  previous: 'bi bi-chevron-left',
  next: 'bi bi-chevron-right',
  today: 'bi bi-calendar-check',
  clear: 'bi bi-trash',
  close: 'bi bi-x',
};

// noinspection JSUnusedGlobalSymbols
const load = (_, __, tdFactory) => {
  tdFactory.DefaultOptions.display.icons = biOneIcons;
};

export { biOneIcons, load };
