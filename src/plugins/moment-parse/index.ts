//obviously, loading moment js is required.
declare let moment;
export default (option, tdClasses, tdFactory) => {
  tdClasses.Dates.prototype.setFromInput = function (value, index) {
    const converted = moment(value, option);
    if (converted.isValid()) {
      const date = tdFactory.DateTime.convert(
        converted.toDate(),
        this.optionsStore.options.localization.locale
      );
      this.setValue(date, index);
    } else {
      console.warn('Momentjs failed to parse the input date.');
    }
  };

  tdClasses.Dates.prototype.formatInput = function (date) {
    return moment(date).format(option);
  };
};
