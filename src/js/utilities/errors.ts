export class TdError extends Error {
  code: number;
}

export class ErrorMessages {
  private base = 'TD:';

  //#region out to console

  /**
   * Throws an error indicating that a key in the options object is invalid.
   * @param optionName
   */
  unexpectedOption(optionName: string) {
    const error = new TdError(
      `${this.base} Unexpected option: ${optionName} does not match a known option.`
    );
    error.code = 1;
    throw error;
  }

  /**
   * Throws an error indicating that one more keys in the options object is invalid.
   * @param optionName
   */
  unexpectedOptions(optionName: string[]) {
    const error = new TdError(`${this.base}: ${optionName.join(', ')}`);
    error.code = 1;
    throw error;
  }

  /**
   * Throws an error when an option is provide an unsupported value.
   * For example a value of 'cheese' for toolbarPlacement which only supports
   * 'top', 'bottom', 'default'.
   * @param optionName
   * @param badValue
   * @param validOptions
   */
  unexpectedOptionValue(
    optionName: string,
    badValue: string,
    validOptions: string[]
  ) {
    const error = new TdError(
      `${
        this.base
      } Unexpected option value: ${optionName} does not accept a value of "${badValue}". Valid values are: ${validOptions.join(
        ', '
      )}`
    );
    error.code = 2;
    throw error;
  }

  /**
   * Throws an error when an option value is the wrong type.
   * For example a string value was provided to multipleDates which only
   * supports true or false.
   * @param optionName
   * @param badType
   * @param expectedType
   */
  typeMismatch(optionName: string, badType: string, expectedType: string) {
    const error = new TdError(
      `${this.base} Mismatch types: ${optionName} has a type of ${badType} instead of the required ${expectedType}`
    );
    error.code = 3;
    throw error;
  }

  /**
   * Throws an error when an option value is  outside of the expected range.
   * For example restrictions.daysOfWeekDisabled excepts a value between 0 and 6.
   * @param optionName
   * @param lower
   * @param upper
   */
  numbersOutOfRange(optionName: string, lower: number, upper: number) {
    const error = new TdError(
      `${this.base} ${optionName} expected an array of number between ${lower} and ${upper}.`
    );
    error.code = 4;
    throw error;
  }

  /**
   * Throws an error when a value for a date options couldn't be parsed. Either
   * the option was an invalid string or an invalid Date object.
   * @param optionName
   * @param date
   * @param soft If true, logs a warning instead of an error.
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  failedToParseDate(optionName: string, date: any, soft = false) {
    const error = new TdError(
      `${this.base} Could not correctly parse "${date}" to a date for ${optionName}.`
    );
    error.code = 5;
    if (!soft) throw error;
    console.warn(error);
  }

  /**
   * Throws when an element to attach to was not provided in the constructor.
   */
  mustProvideElement() {
    const error = new TdError(`${this.base} No element was provided.`);
    error.code = 6;
    throw error;
  }

  /**
   * Throws if providing an array for the events to subscribe method doesn't have
   * the same number of callbacks. E.g., subscribe([1,2], [1])
   */
  subscribeMismatch() {
    const error = new TdError(
      `${this.base} The subscribed events does not match the number of callbacks`
    );
    error.code = 7;
    throw error;
  }

  /**
   * Throws if the configuration has conflicting rules e.g. minDate is after maxDate
   */
  conflictingConfiguration(message?: string) {
    const error = new TdError(
      `${this.base} A configuration value conflicts with another rule. ${message}`
    );
    error.code = 8;
    throw error;
  }

  /**
   * customDateFormat errors
   */
  customDateFormatError(message?: string) {
    const error = new TdError(`${this.base} Custom Date Format: ${message}`);
    error.code = 9;
    throw error;
  }

  /**
   * Logs a warning if a date option value is provided as a string, instead of
   * a date/datetime object.
   */
  dateString() {
    console.warn(
      `${this.base} Using a string for date options is not recommended unless you specify an ISO string or use the customDateFormat plugin.`
    );
  }

  deprecatedWarning(message: string, remediation?: string) {
    console.warn(
      `${this.base} Warning ${message} is deprecated and will be removed in a future version. ${remediation}`
    );
  }

  throwError(message) {
    const error = new TdError(`${this.base} ${message}`);
    error.code = 9;
    throw error;
  }

  //#endregion

  //#region used with notify.error

  /**
   * Used with an Error Event type if the user selects a date that
   * fails restriction validation.
   */
  failedToSetInvalidDate = 'Failed to set invalid date';

  /**
   * Used with an Error Event type when a user changes the value of the
   * input field directly, and does not provide a valid date.
   */
  failedToParseInput = 'Failed parse input field';

  //#endregion
}
