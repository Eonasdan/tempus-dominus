// this obviously requires the FA 6 libraries to be loaded

const faFiveIcons = {
  type: 'icons',
  time: 'fas fa-clock',
  date: 'fas fa-calendar',
  up: 'fas fa-arrow-up',
  down: 'fas fa-arrow-down',
  previous: 'fas fa-chevron-left',
  next: 'fas fa-chevron-right',
  today: 'fas fa-calendar-check',
  clear: 'fas fa-trash',
  close: 'fas fa-times',
};

// noinspection JSUnusedGlobalSymbols
const load = (_, __, tdFactory) => {
  tdFactory.DefaultOptions.display.icons = faFiveIcons;
};

export { faFiveIcons, load };
