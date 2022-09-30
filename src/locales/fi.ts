const name = 'fi';

const localization = {
  today: 'Tänään',
  clear: 'Tyhjennä',
  close: 'Sulje',
  selectMonth: 'Valitse kuukausi',
  previousMonth: 'Edellinen kuukausi',
  nextMonth: 'Seuraava kuukausi',
  selectYear: 'Valitse vuosi',
  previousYear: 'Edelline vuosi',
  nextYear: 'Seuraava vuosi',
  selectDecade: 'Valitse vuosikymmen',
  previousDecade: 'Edellinen vuosikymmen',
  nextDecade: 'Seuraava vuosikymmen',
  previousCentury: 'Edellinen vuosisata',
  nextCentury: 'Seuraava vuosisata',
  pickHour: 'Valitse tunnit',
  incrementHour: 'Vähennä tunteja',
  decrementHour: 'Lisää tunteja',
  pickMinute: 'Valitse minuutit',
  incrementMinute: 'Vähennä minuutteja',
  decrementMinute: 'Lisää minuutteja',
  pickSecond: 'Valitse sekuntit',
  incrementSecond: 'Vähennä sekunteja',
  decrementSecond: 'Lisää sekunteja',
  toggleMeridiem: 'Vaihda kellonaikaa',
  selectTime: 'Valitse aika',
  selectDate: 'Valise päivä',
  dayViewHeaderFormat: { month: 'long', year: '2-digit' },
  locale: 'fi',
  startOfTheWeek: 1,
  dateFormats: {
    LT: 'HH.mm',
    LTS: 'HH.mm.ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM[ta] YYYY',
    LLL: 'D. MMMM[ta] YYYY, [klo] HH.mm',
    LLLL: 'dddd, D. MMMM[ta] YYYY, [klo] HH.mm',
    l: 'D.M.YYYY',
    ll: 'D. MMM YYYY',
    lll: 'D. MMM YYYY, [klo] HH.mm',
    llll: 'ddd, D. MMM YYYY, [klo] HH.mm'
  },
  ordinal: n => `${n}.`,
  format: 'L LT'
};

export { localization, name };
