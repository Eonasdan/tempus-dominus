import { TempusDominus, version, extend } from '../src/js/tempus-dominus';
//import { localization } from '../src/locales/ru';
import * as cdf from '../src/js/plugins/customDateFormat';

extend(cdf, undefined);

const dp: TempusDominus = new TempusDominus(
  document.getElementById('datetimepicker1'),
  {
    //localization: localization,
  }
);
