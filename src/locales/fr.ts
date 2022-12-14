const name = 'fr';

const localization = {
  today: "Aujourd'hui",
  clear: 'Effacer la sélection',
  close: 'Fermer',
  selectMonth: 'Sélectionner le mois',
  previousMonth: 'Mois précédent',
  nextMonth: 'Mois suivant',
  selectYear: "Sélectionner l'année",
  previousYear: 'Année précédente',
  nextYear: 'Année suivante',
  selectDecade: 'Sélectionner la décennie',
  previousDecade: 'Décennie précédente',
  nextDecade: 'Décennie suivante',
  previousCentury: 'Siècle précédente',
  nextCentury: 'Siècle suivante',
  pickHour: "Sélectionner l'heure",
  incrementHour: "Incrementer l'heure",
  decrementHour: "Diminuer l'heure",
  pickMinute: 'Sélectionner les minutes',
  incrementMinute: 'Incrementer les minutes',
  decrementMinute: 'Diminuer les minutes',
  pickSecond: 'Sélectionner les secondes',
  incrementSecond: 'Incrementer les secondes',
  decrementSecond: 'Diminuer les secondes',
  toggleMeridiem: 'Basculer AM-PM',
  selectTime: "Sélectionner l'heure",
  selectDate: 'Sélectionner une date',
  dayViewHeaderFormat: { month: 'long', year: '2-digit' },
  locale: 'fr',
  startOfTheWeek: 1,
  dateFormats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'dd/MM/yyyy',
    LL: 'd MMMM yyyy',
    LLL: 'd MMMM yyyy HH:mm',
    LLLL: 'dddd d MMMM yyyy HH:mm',
  },
  ordinal: (n) => {
    const o = n === 1 ? 'er' : '';
    return `${n}${o}`;
  },
  format: 'L LT',
};

export { localization, name };
