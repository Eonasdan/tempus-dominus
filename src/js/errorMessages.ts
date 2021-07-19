export class ErrorMessages {
  private base = 'TD:';

  //#region out to console

  unexpectedOption(optionName: string) {
    return `${this.base} Unexpected option: ${optionName} does not match a known option.`;
  }

  unexpectedOptions(optionName: string[]) {
    return `${this.base}: ${optionName.join(', ')}`;
  }

  unexpectedOptionString(
    optionName: string,
    badValue: string,
    validOptions: string[]
  ) {
    return `${
      this.base
    } Unexpected option value: ${optionName} does not except a value of "${badValue}". Valid values are: ${validOptions.join(
      ', '
    )}`;
  }

  typeMismatch(optionName: string, badType: string, expectedType: string) {
    return `${this.base} Mismatch types: ${optionName} has a type of ${badType} instead of the required ${expectedType}`;
  }

  dateString = `${this.base} Using a string for date options is not recommended unless you specify an ISO string.`;

  numbersOutOfRage(optionName: string, lower: number, upper: number) {
    return `${this.base} ${optionName} expected an array of number between ${lower} and ${upper}.`;
  }

  failedToParseDate(optionName: string, date: any) {
    return `${this.base} Could not correctly parse "${date}" to a date for option ${optionName}.`;
  }

  mustProvideElement = `${this.base} No element was provided.`;

  //#endregion

  //#region used with notify.error

  failedToSetInvalidDate = 'Failed to set invalid date';
  failedToParseInput = 'Failed parse input field';

  //#endregion
}
