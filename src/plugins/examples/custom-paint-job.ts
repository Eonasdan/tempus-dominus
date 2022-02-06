// noinspection JSUnusedGlobalSymbols
export const load = (option, tdClasses, tdFactory) => {
  tdClasses.Display.prototype.paint = (unit, date, classes: string[]) => {
    if (unit === tdFactory.Unit.date) {
      if (date.isSame(new tdFactory.DateTime(), unit)) {
        classes.push('special-day');
      }
    }
  };
};