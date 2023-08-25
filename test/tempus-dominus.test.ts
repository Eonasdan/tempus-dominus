import { beforeEach, expect, test, describe } from 'vitest';
import { TempusDominus } from '../src/js/tempus-dominus';
import { tomorrowDate, yesterdayDate } from './test-utilities';

beforeEach(() => {
  document.body.innerHTML = `<div class="container">
<div class="row">
  <div class="col-sm-12" id="htmlTarget">
    <label for="datetimepicker1Input" class="form-label">Picker</label>
    <div
      class="input-group log-event"
      id="datetimepicker1"
      data-td-target-input="nearest"
      data-td-target-toggle="nearest"
    >
      <input
        id="datetimepicker1Input"
        type="text"
        class="form-control"
        data-td-target="#datetimepicker1"
      />
      <span
        class="input-group-text"
        data-td-target="#datetimepicker1"
        data-td-toggle="datetimepicker"
      >
        <i class="fas fa-calendar"></i>
      </span>
    </div>
  </div>
</div>
</div>
`;
});

test('TD can construct', () => {
  const element = document.getElementById('datetimepicker1');
  expect(element).not.toBe(null);

  const td = new TempusDominus(document.getElementById('datetimepicker1'));

  expect(td).not.toBe(null);
  expect(td instanceof TempusDominus).toBe(true);
});

describe('TD constructs correct', () => {
  test('maxDate should be yesterday', () => {
    const maxDate = yesterdayDate();

    const options = {
      restrictions: {
        maxDate,
      },
    };

    const td = new TempusDominus(
      document.getElementById('datetimepicker1'),
      options
    );

    expect(td.optionsStore.options.restrictions.maxDate.getTime()).toBe(
      maxDate.getTime()
    );
    expect(td.viewDate.getTime()).toBe(maxDate.getTime());
  });

  test('minDate should be tomorrow', () => {
    const minDate = tomorrowDate();

    const options = {
      restrictions: {
        minDate,
      },
    };

    const td = new TempusDominus(
      document.getElementById('datetimepicker1'),
      options
    );

    expect(td.optionsStore.options.restrictions.minDate.getTime()).toBe(
      minDate.getTime()
    );
    expect(td.viewDate.getTime()).toBe(minDate.getTime());
  });
});
