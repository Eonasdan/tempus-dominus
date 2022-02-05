// this obviously requires the FA 6 libraries to be loaded

const faSixIcons = {
  type: 'icons',
  time: 'fa-solid fa-clock',
  date: 'fa-solid fa-calendar',
  up: 'fa-solid fa-arrow-up',
  down: 'fa-solid fa-arrow-down',
  previous: 'fa-solid fa-chevron-left',
  next: 'fa-solid fa-chevron-right',
  today: 'fa-solid fa-calendar-check',
  clear: 'fa-solid fa-trash',
  close: 'fa-solid fa-xmark'
};

// noinspection JSUnusedGlobalSymbols
const load = (_, __, tdFactory) => {
  tdFactory.DefaultOptions.display.icons = faSixIcons;
};

export { faSixIcons, load };