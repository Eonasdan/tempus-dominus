import { TempusDominus } from '../../tempus-dominus';
import { Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';

export default class HourDisplay {
  private context: TempusDominus;

  constructor(context: TempusDominus) {
    this.context = context;
  }

  get picker(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(Namespace.Css.hourContainer);

    const table = document.createElement('table');
    table.classList.add('table', 'table-sm'); //todo bootstrap
    const tableBody = document.createElement('tbody');
    let row = document.createElement('tr');
    for (
      let i = 0;
      i <=
      (this.context.options.display.components.useTwentyfourHour ? 24 : 12);
      i++
    ) {
      if (i !== 0 && i % 4 === 0) {
        tableBody.appendChild(row);
        row = document.createElement('tr');
      }
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectHour);
      td.appendChild(div);
      row.appendChild(td);
    }

    table.appendChild(tableBody);
    container.appendChild(table);

    return container;
  }

  update(): void {
    const container = this.context.display.widget.getElementsByClassName(
      Namespace.Css.hourContainer
    )[0];
    let innerDate = this.context.viewDate.clone.startOf(Unit.date);

    container
      .querySelectorAll('tbody td div')
      .forEach((containerClone: HTMLElement, index) => {
        let classes = [];
        classes.push(Namespace.Css.hour);

        if (!this.context.validation.isValid(innerDate, Unit.hours)) {
          classes.push(Namespace.Css.disabled);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${innerDate.hours}`);
        containerClone.innerText = this.context.options.display.components
          .useTwentyfourHour
          ? innerDate.hoursFormatted
          : innerDate.twelveHoursFormatted;
        innerDate.manipulate(1, Unit.hours);
      });
  }
}
