/* eslint-disable */
// noinspection JSUnusedGlobalSymbols
export default (option, tdClasses, tdFactory) => {
  // noinspection JSUnusedLocalSymbols
  tdClasses.Display.prototype.paint = (
    unit,
    date,
    classes: string[],
    element: HTMLElement
  ) => {
    if (unit === tdFactory.Unit.date) {
      if (date.isSame(new tdFactory.DateTime(), unit)) {
        classes.push('special-day');
      }
    }
  };
};
