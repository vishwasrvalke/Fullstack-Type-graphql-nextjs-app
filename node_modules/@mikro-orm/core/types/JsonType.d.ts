import { Type } from './Type';
import { Platform } from '../platforms';
import { EntityProperty } from '../typings';
export declare class JsonType extends Type<unknown, string | null> {
    convertToDatabaseValue(value: unknown, platform: Platform): string | null;
    convertToJSValue(value: string | unknown, platform: Platform): unknown;
    getColumnType(prop: EntityProperty, platform: Platform): string;
}
