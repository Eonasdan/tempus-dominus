import { beforeEach, describe, expect, test, vi } from 'vitest';
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
        value="7/8/2025; 7/12/2025"
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

describe('TD date range', () => {
  let element, input, td;

  beforeEach(() => {
    element = document.getElementById('datetimepicker1');
    input = document.getElementById('datetimepicker1Input');
    td = new TempusDominus(document.getElementById('datetimepicker1'), {
      dateRange: true,
      display: {
        components: {
          clock: false,
        },
      },
      localization: {
        format: 'M/d/yyyy',
      },
    });
  });

  describe('manually inputting from the text input', () => {
    const updateInput = (value) => {
      input.value = value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    test('keeps invalid input but preserves the selected dates', () => {
      updateInput('foobar');
      expect(input.value).toBe('foobar');
      expect(td.dates.picked).toEqual([
        new Date(2025, 6, 8, 0, 0, 0),
        new Date(2025, 6, 12, 0, 0, 0),
      ]);
    });

    test('can be a single date before the current range', () => {
      updateInput('7/1/2025');
      expect(input.value).toBe('7/1/2025; 7/12/2025');
      expect(td.dates.picked).toEqual([
        new Date(2025, 6, 1, 0, 0, 0),
        new Date(2025, 6, 12, 0, 0, 0),
      ]);
    });

    test('can be a single date in between the current range', () => {
      updateInput('7/9/2025');
      expect(input.value).toBe('7/9/2025; 7/12/2025');
      expect(td.dates.picked).toEqual([
        new Date(2025, 6, 9, 0, 0, 0),
        new Date(2025, 6, 12, 0, 0, 0),
      ]);
    });

    // NOTE: This behavior seems like it might be wrong, but I want to preserve
    // current behavior for now
    test('can be a single date after the current range', () => {
      updateInput('7/19/2025');
      expect(input.value).toBe('7/19/2025; 7/12/2025');
      expect(td.dates.picked).toEqual([
        new Date(2025, 6, 19, 0, 0, 0),
        new Date(2025, 6, 12, 0, 0, 0),
      ]);
    });

    test('can be before the current range', () => {
      updateInput('06/07/2025; 06/11/2025');
      expect(td.dates.picked).toEqual([
        new Date(2025, 5, 7, 0, 0, 0),
        new Date(2025, 5, 11, 0, 0, 0),
      ]);
    });

    test('can be after the current range', () => {
      updateInput('08/07/2025; 08/11/2025');
      expect(td.dates.picked).toEqual([
        new Date(2025, 7, 7, 0, 0, 0),
        new Date(2025, 7, 11, 0, 0, 0),
      ]);
    });
  });

  describe('selecting the range from the calendar UI', () => {
    beforeEach(() => {
      // Using the calendar UI ends up using matchMedia, which is not available in jsdom
      vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
    });

    test('can be before the current range', () => {
      document.querySelector('[data-td-toggle="datetimepicker"] i').click();
      document
        .querySelector('[data-action="selectDay"][data-value="2025-06-02"]')
        .click();
      document
        .querySelector('[data-action="selectDay"][data-value="2025-06-06"]')
        .click();
      expect(td.dates.picked).toEqual([
        new Date(2025, 6, 2, 0, 0, 0),
        new Date(2025, 6, 6, 0, 0, 0),
      ]);
    });

    test('can be after the current range', () => {
      document.querySelector('[data-td-toggle="datetimepicker"] i').click();
      document
        .querySelector('[data-action="selectDay"][data-value="2025-06-15"]')
        .click();
      document
        .querySelector('[data-action="selectDay"][data-value="2025-06-19"]')
        .click();
      expect(td.dates.picked).toEqual([
        new Date(2025, 6, 15, 0, 0, 0),
        new Date(2025, 6, 19, 0, 0, 0),
      ]);
    });
  });
});
