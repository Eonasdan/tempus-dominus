export default (option, tdClass, tdFactory) => {
  tdClass.prototype.display.paint = (unit, date, classes: string[]) => {
    if (unit === tdFactory.Unit.date) {
      if (date.isSame(new tdFactory.DateTime(), unit)) {
        classes.push('special-day');
      }
    }
  }
}