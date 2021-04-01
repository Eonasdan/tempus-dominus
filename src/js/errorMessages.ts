export class ErrorMessages {
    //#region out to console
    unexpectedOption(optionName: string) {
        return `TD: Unexpected option: ${optionName} does not match a known option.`;
    }

    typeMismatch(optionName: string, badType: string, expectedType: string) {
        return `TD: Mismatch types: ${optionName} has a type of ${badType} instead of the required ${expectedType}`;
    }

    dateString = 'TD: Using a string for date options is not recommended unless you specify an ISO string.';

    numbersOutOfRage(optionName: string, lower: number, upper: number) {
        return `'TD: ${optionName} expected an array of number between ${lower} and ${upper}.'`
    }

    failedToParseDate(optionName: string, date: any) {
        return `TD: Could not correctly parse "${date}" to a date for option ${optionName}.`
    }

    //#endregion

    //#region used with notify.error

    failedToSetInvalidDate = 'Failed to set invalid date';
    failedToParseInput = 'Failed parse input field';

    //#endregion
}