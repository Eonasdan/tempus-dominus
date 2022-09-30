const name = 'nl';

const localization = {
  today: 'Vandaag',
  clear: 'Verwijder selectie',
  close: 'Sluit de picker',
  selectMonth: 'Selecteer een maand',
  previousMonth: 'Vorige maand',
  nextMonth: 'Volgende maand',
  selectYear: 'Selecteer een jaar',
  previousYear: 'Vorige jaar',
  nextYear: 'Volgende jaar',
  selectDecade: 'Selecteer decennium',
  previousDecade: 'Vorige decennium',
  nextDecade: 'Volgende decennium',
  previousCentury: 'Vorige eeuw',
  nextCentury: 'Volgende eeuw',
  pickHour: 'Kies een uur',
  incrementHour: 'Verhoog uur',
  decrementHour: 'Verlaag uur',
  pickMinute: 'Kies een minute',
  incrementMinute: 'Verhoog  minuut',
  decrementMinute: 'Verlaag minuut',
  pickSecond: 'Kies een seconde',
  incrementSecond: 'Verhoog seconde',
  decrementSecond: 'Verlaag seconde',
  toggleMeridiem: 'Schakel tussen AM/PM',
  selectTime: 'Selecteer een tijd',
  selectDate: 'Selecteer een datum',
  dayViewHeaderFormat: { month: 'long', year: '2-digit' },
  locale: 'nl',
  startOfTheWeek: 1,
  dateFormats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD-MM-YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  ordinal: n => `[${n}${n === 1 || n === 8 || n >= 20 ? 'ste' : 'de'}]`,
  format: 'L LT'
};

export { localization, name };
