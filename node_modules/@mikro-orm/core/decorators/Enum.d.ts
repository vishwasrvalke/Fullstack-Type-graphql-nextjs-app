import { PropertyOptions } from './Property';
import { AnyEntity, Dictionary } from '../typings';
export declare function Enum(options?: EnumOptions<AnyEntity> | (() => Dictionary)): (target: AnyEntity, propertyName: string) => any;
export interface EnumOptions<T> extends PropertyOptions<T> {
    items?: (number | string)[] | (() => Dictionary);
    array?: boolean;
}
