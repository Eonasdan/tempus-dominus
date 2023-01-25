import { FormatLocalization } from './options';

const DefaultFormatLocalization: FormatLocalization = {
  locale: 'default',
  hourCycle: undefined,
  dateFormats: {
    LTS: 'h:mm:ss T',
    LT: 'h:mm T',
    L: 'MM/dd/yyyy',
    LL: 'MMMM d, yyyy',
    LLL: 'MMMM d, yyyy h:mm T',
    LLLL: 'dddd, MMMM d, yyyy h:mm T',
  },
  ordinal: (n) => n,
  format: 'L LT',
};

export default { ...DefaultFormatLocalization };
