import type { FormatLocalization } from './options';
interface OptionProcessorFunctionArguments {
    key: string;
    value: any;
    providedType: string;
    defaultType: string;
    path: string;
    localization: FormatLocalization;
}
export declare function processKey(this: void, args: OptionProcessorFunctionArguments): any;
export {};
