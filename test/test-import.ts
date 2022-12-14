import { TempusDominus, version } from '../src/js/tempus-dominus';
import { localization } from '../src/locales/ru';

const dp: TempusDominus = new TempusDominus(
  document.getElementById('datetimepicker1'),
  {
    localization: localization,
  }
);
