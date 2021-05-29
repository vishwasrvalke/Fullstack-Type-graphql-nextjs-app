import { Type } from './Type';
import { EntityProperty } from '../typings';
import { Platform } from '../platforms';
export declare class ArrayType<T extends string | number = string> extends Type<T[] | null, string | null> {
    private readonly hydrate;
    constructor(hydrate?: (i: string) => T);
    convertToDatabaseValue(value: T[] | null, platform: Platform, fromQuery?: boolean): string | null;
    convertToJSValue(value: T[] | string | null, platform: Platform): T[] | null;
    compareAsType(): string;
    toJSON(value: T[]): T[];
    getColumnType(prop: EntityProperty, platform: Platform): string;
}
