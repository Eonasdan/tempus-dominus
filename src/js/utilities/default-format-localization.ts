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
  ordinal: (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
  },
  format: 'L LT',
};

export default { ...DefaultFormatLocalization };
