import { Unit } from '../datetime';
import Namespace from './namespace';
import ViewMode from './view-mode';

const CalendarModes: {
  name: keyof ViewMode;
  className: string;
  unit: Unit;
  step: number;
}[] = [
  {
    name: 'calendar',
    className: Namespace.css.daysContainer,
    unit: Unit.month,
    step: 1,
  },
  {
    name: 'months',
    className: Namespace.css.monthsContainer,
    unit: Unit.year,
    step: 1,
  },
  {
    name: 'years',
    className: Namespace.css.yearsContainer,
    unit: Unit.year,
    step: 10,
  },
  {
    name: 'decades',
    className: Namespace.css.decadesContainer,
    unit: Unit.year,
    step: 100,
  },
];

export default CalendarModes;
