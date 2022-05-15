export declare class TdError extends Error {
    code: number;
}
export declare class ErrorMessages {
    private base;
    /**
     * Throws an error indicating that a key in the options object is invalid.
     * @param optionName
     */
    unexpectedOption(optionName: string): void;
    /**
     * Throws an error indicating that one more keys in the options object is invalid.
     * @param optionName
     */
    unexpectedOptions(optionName: string[]): void;
    /**
     * Throws an error when an option is provide an unsupported value.
     * For example a value of 'cheese' for toolbarPlacement which only supports
     * 'top', 'bottom', 'default'.
     * @param optionName
     * @param badValue
     * @param validOptions
     */
    unexpectedOptionValue(optionName: string, badValue: string, validOptions: string[]): void;
    /**
     * Throws an error when an option value is the wrong type.
     * For example a string value was provided to multipleDates which only
     * supports true or false.
     * @param optionName
     * @param badType
     * @param expectedType
     */
    typeMismatch(optionName: string, badType: string, expectedType: string): void;
    /**
     * Throws an error when an option value is  outside of the expected range.
     * For example restrictions.daysOfWeekDisabled excepts a value between 0 and 6.
     * @param optionName
     * @param lower
     * @param upper
     */
    numbersOutOfRage(optionName: string, lower: number, upper: number): void;
    /**
     * Throws an error when a value for a date options couldn't be parsed. Either
     * the option was an invalid string or an invalid Date object.
     * @param optionName
     * @param date
     * @param soft If true, logs a warning instead of an error.
     */
    failedToParseDate(optionName: string, date: any, soft?: boolean): void;
    /**
     * Throws when an element to attach to was not provided in the constructor.
     */
    mustProvideElement(): void;
    /**
     * Throws if providing an array for the events to subscribe method doesn't have
     * the same number of callbacks. E.g., subscribe([1,2], [1])
     */
    subscribeMismatch(): void;
    /**
     * Throws if the configuration has conflicting rules e.g. minDate is after maxDate
     */
    conflictingConfiguration(message?: string): void;
    /**
     * Logs a warning if a date option value is provided as a string, instead of
     * a date/datetime object.
     */
    dateString(): void;
    throwError(message: any): void;
    /**
     * Used with an Error Event type if the user selects a date that
     * fails restriction validation.
     */
    failedToSetInvalidDate: string;
    /**
     * Used with an Error Event type when a user changes the value of the
     * input field directly, and does not provide a valid date.
     */
    failedToParseInput: string;
}
