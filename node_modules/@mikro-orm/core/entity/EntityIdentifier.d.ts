import { IPrimaryKey } from '../typings';
export declare class EntityIdentifier {
    private value?;
    constructor(value?: import("../typings").IPrimaryKeyValue | undefined);
    setValue(value: IPrimaryKey): void;
    getValue<T extends IPrimaryKey = IPrimaryKey>(): T;
}
