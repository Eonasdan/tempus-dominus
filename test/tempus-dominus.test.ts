import { beforeEach, expect, test } from 'vitest';
import { TempusDominus } from '../src/js/tempus-dominus';

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
